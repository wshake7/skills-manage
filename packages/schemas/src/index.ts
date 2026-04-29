import { z } from "zod";

export const layerSchema = z.enum(["cloud", "system", "project"]);
export type Layer = z.infer<typeof layerSchema>;

export const providerNameSchema = z.enum(["codex", "deepseek"]);
export type ProviderName = z.infer<typeof providerNameSchema>;

export const sourceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["github", "package-json", "go-mod"]),
  value: z.string().min(1),
  enabled: z.boolean().default(true),
  context7: z
    .object({
      prefer: z.boolean().default(true),
      libraryId: z.string().regex(/^\/[^/\s]+\/[^/\s]+(?:\/[^/\s]+)?$/).optional(),
      libraryName: z.string().min(1).optional(),
      query: z.string().min(1).optional()
    })
    .optional()
});
export type Source = z.infer<typeof sourceSchema>;

export const linkedCloudSchema = z.object({
  repo: z.string().min(1),
  pagesUrl: z.string().url(),
  enabled: z.boolean().default(true)
});

export const linkedSystemSchema = z.object({
  path: z.string().min(1),
  enabled: z.boolean().default(true)
});

const baseConfigSchema = z.object({
  version: z.literal(1).default(1),
  sources: z.array(sourceSchema).default([]),
  provider: providerNameSchema.default("codex"),
  skillsDir: z.string().default(".agents/skills")
});

export const cloudConfigSchema = baseConfigSchema.extend({
  layer: z.literal("cloud"),
  pages: z
    .object({
      outDir: z.string().default("dist/cloud-ui"),
      dataDir: z.string().default("public/data")
    })
    .default({})
});

export const systemConfigSchema = baseConfigSchema.extend({
  layer: z.literal("system"),
  linkedCloud: linkedCloudSchema.optional(),
  ui: z
    .object({
      host: z.literal("localhost").default("localhost"),
      port: z.number().int().min(1).max(65535).default(4173)
    })
    .default({})
});

export const projectConfigSchema = baseConfigSchema.extend({
  layer: z.literal("project"),
  linkedSystem: linkedSystemSchema.optional(),
  ui: z
    .object({
      host: z.literal("localhost").default("localhost"),
      port: z.number().int().min(1).max(65535).default(4174)
    })
    .default({})
});

export const skillsConfigSchema = z.discriminatedUnion("layer", [
  cloudConfigSchema,
  systemConfigSchema,
  projectConfigSchema
]);
export type CloudConfig = z.infer<typeof cloudConfigSchema>;
export type SystemConfig = z.infer<typeof systemConfigSchema>;
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type SkillsConfig = z.infer<typeof skillsConfigSchema>;

export const managedBySchema = z.literal("skills-manage");

export const skillOverrideSchema = z.object({
  layer: layerSchema,
  name: z.string().min(1),
  path: z.string().min(1).optional()
});

export const skillManifestSchema = z.object({
  name: z.string().min(1),
  layer: layerSchema,
  sourceRepo: z.string().min(1),
  sourceCommit: z.string().min(1),
  provider: providerNameSchema,
  generatedAt: z.string().datetime(),
  managedBy: managedBySchema,
  overrides: z.array(skillOverrideSchema).default([])
});
export type SkillManifest = z.infer<typeof skillManifestSchema>;

export const resolvedRepoSchema = z.object({
  sourceId: z.string().min(1),
  repo: z.string().min(1),
  url: z.string().url(),
  resolvedFrom: z.string().min(1)
});
export type ResolvedRepo = z.infer<typeof resolvedRepoSchema>;

export const unresolvedSourceSchema = z.object({
  sourceId: z.string().min(1),
  reason: z.string().min(1)
});
export type UnresolvedSource = z.infer<typeof unresolvedSourceSchema>;

export function configFileName(layer: Layer): string {
  return `skills-${layer}.config.json`;
}
