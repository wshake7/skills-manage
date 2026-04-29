import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type Layer,
  type SkillManifest,
  skillManifestSchema
} from "@skills-manage/schemas";

export async function readSkillManifests(skillsDir: string): Promise<SkillManifest[]> {
  const entries = await readdir(skillsDir, { withFileTypes: true }).catch(() => []);
  const manifests: SkillManifest[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const path = join(skillsDir, entry.name, "skill.manifest.json");
    const raw = await readFile(path, "utf8").catch(() => undefined);
    if (!raw) {
      continue;
    }

    manifests.push(skillManifestSchema.parse(JSON.parse(raw)));
  }

  return manifests;
}

export function createManagedManifest(input: {
  name: string;
  layer: Layer;
  sourceRepo: string;
  sourceCommit: string;
  provider: "codex" | "deepseek";
  mode?: SkillManifest["mode"];
  runtime?: SkillManifest["runtime"];
  overrides?: SkillManifest["overrides"];
}): SkillManifest {
  return skillManifestSchema.parse({
    ...input,
    managedBy: "skills-manage",
    generatedAt: new Date().toISOString(),
    overrides: input.overrides ?? []
  });
}
