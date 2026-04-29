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
  description: "Uses DeepSeek API credentials from DEEPSEEK_API_KEY.",
  async checkAuth() {
    if (!process.env.DEEPSEEK_API_KEY) {
      return {
        ok: false,
        message: "DEEPSEEK_API_KEY is not set."
      };
    }

    return {
      ok: true,
      message: "DEEPSEEK_API_KEY is configured."
    };
  },
  async generateSkill(input) {
    return {
      skillName: input.skillName,
      files: [
        {
          path: "SKILL.md",
          content: `# ${input.skillName}\n\nDeepSeek generation placeholder for ${input.sourcePath}.\n\n${input.prompt}\n`
        }
      ]
    };
  }
};
