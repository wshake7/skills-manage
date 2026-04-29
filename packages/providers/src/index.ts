import type { ProviderName } from "@skills-manage/schemas";

export interface ProviderCheck {
  ok: boolean;
  message: string;
}

export interface SkillGenerationInput {
  prompt: string;
  sourcePath: string;
  skillName: string;
}

export interface SkillGenerationResult {
  skillName: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

export interface AiProvider {
  name: ProviderName;
  description: string;
  checkAuth(): Promise<ProviderCheck>;
  generateSkill(input: SkillGenerationInput): Promise<SkillGenerationResult>;
}

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

export function createProvider(name: ProviderName): AiProvider {
  if (name === "deepseek") {
    return deepseekProvider;
  }

  return codexProvider;
}

export const codexProvider: AiProvider = {
  name: "codex",
  description: "Uses the local Codex workflow to generate or update skills.",
  async checkAuth() {
    return {
      ok: true,
      message: "Codex provider uses the current Codex environment."
    };
  },
  async generateSkill(input) {
    return {
      skillName: input.skillName,
      files: [
        {
          path: "SKILL.md",
          content: `# ${input.skillName}\n\nGenerated from ${input.sourcePath}.\n\n${input.prompt}\n`
        }
      ]
    };
  }
};

export const deepseekProvider: AiProvider = {
  name: "deepseek",
  description: "Uses the DeepSeek Chat Completions API with credentials from DEEPSEEK_API_KEY.",
  async checkAuth() {
    if (!process.env.DEEPSEEK_API_KEY) {
      return {
        ok: false,
        message: "DEEPSEEK_API_KEY is not set. Configure it as a GitHub Actions secret for cloud runs."
      };
    }

    return {
      ok: true,
      message: `DEEPSEEK_API_KEY is configured. Model: ${deepseekModel()}.`
    };
  },
  async generateSkill(input) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not set.");
    }

    const response = await fetch(`${deepseekBaseUrl()}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: deepseekModel(),
        messages: [
          {
            role: "system",
            content:
              "You generate Codex-compatible skills. Return strict JSON with shape: {\"skillName\":\"string\",\"files\":[{\"path\":\"SKILL.md\",\"content\":\"markdown\"}]}. Do not wrap the JSON in markdown."
          },
          {
            role: "user",
            content: JSON.stringify(input)
          }
        ],
        stream: false
      })
    });

    const data = (await response.json()) as DeepSeekChatResponse;
    if (!response.ok) {
      throw new Error(data.error?.message ?? `DeepSeek request failed with HTTP ${response.status}.`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek response did not include message content.");
    }

    return parseSkillGenerationResult(content, input.skillName);
  }
};

function deepseekBaseUrl(): string {
  return (process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/+$/, "");
}

function deepseekModel(): string {
  return process.env.DEEPSEEK_MODEL ?? "deepseek-v4-pro";
}

function parseSkillGenerationResult(content: string, fallbackSkillName: string): SkillGenerationResult {
  const trimmed = content.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    : trimmed;
  const parsed = JSON.parse(jsonText) as SkillGenerationResult;

  if (!parsed.skillName) {
    parsed.skillName = fallbackSkillName;
  }

  if (!Array.isArray(parsed.files) || parsed.files.length === 0) {
    throw new Error("DeepSeek response did not include generated files.");
  }

  return parsed;
}
