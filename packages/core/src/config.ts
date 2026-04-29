import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  type Layer,
  type SkillsConfig,
  configFileName,
  skillsConfigSchema
} from "@skills-manage/schemas";

export function configPathFor(rootDir: string, layer: Layer): string {
  return join(rootDir, configFileName(layer));
}

export async function readConfig(path: string): Promise<SkillsConfig> {
  const raw = await readFile(path, "utf8");
  const parsed: unknown = JSON.parse(raw);
  return skillsConfigSchema.parse(parsed);
}

export async function writeConfig(path: string, config: SkillsConfig): Promise<void> {
  const parsed = skillsConfigSchema.parse(config);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}

export function defaultConfig(layer: Layer): SkillsConfig {
  if (layer === "cloud") {
    return {
      version: 1,
      layer,
      sources: [],
      provider: "deepseek",
      skillsDir: ".agents/skills",
      pages: {
        outDir: "dist/cloud-ui",
        dataDir: "public/data"
      }
    };
  }

  if (layer === "system") {
    return {
      version: 1,
      layer,
      sources: [],
      provider: "codex",
      skillsDir: ".agents/skills",
      ui: {
        host: "localhost",
        port: 4173
      }
    };
  }

  return {
    version: 1,
    layer,
    sources: [],
    provider: "codex",
    skillsDir: ".agents/skills",
    ui: {
      host: "localhost",
      port: 4174
    }
  };
}
