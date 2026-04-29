import { access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import {
  type Layer,
  type SkillsConfig,
  type SkillManifest,
  configFileName
} from "@skills-manage/schemas";
import { readConfig } from "./config.js";

export interface LayerNode {
  layer: Layer;
  rootDir: string;
  configPath: string;
  config: SkillsConfig;
}

export interface LayerGraph {
  nodes: LayerNode[];
}

export async function buildLayerGraph(configPath: string): Promise<LayerGraph> {
  const rootDir = dirname(resolve(configPath));
  const config = await readConfig(configPath);
  const nodes: LayerNode[] = [
    {
      layer: config.layer,
      rootDir,
      configPath: resolve(configPath),
      config
    }
  ];

  if (config.layer === "project" && config.linkedSystem?.enabled) {
    const systemRoot = resolve(rootDir, expandHome(config.linkedSystem.path));
    const systemPath = join(systemRoot, configFileName("system"));
    await assertReadable(systemPath);
    const systemConfig = await readConfig(systemPath);
    nodes.push({
      layer: "system",
      rootDir: systemRoot,
      configPath: systemPath,
      config: systemConfig
    });

    if (systemConfig.layer === "system" && systemConfig.linkedCloud?.enabled) {
      nodes.push({
        layer: "cloud",
        rootDir: systemConfig.linkedCloud.repo,
        configPath: systemConfig.linkedCloud.pagesUrl,
        config: {
          version: 1,
          layer: "cloud",
          sources: [],
          provider: "codex",
          skillsDir: ".agents/skills",
          pages: {
            outDir: "dist/cloud-ui",
            dataDir: "public/data"
          }
        }
      });
    }
  }

  if (config.layer === "system" && config.linkedCloud?.enabled) {
    nodes.push({
      layer: "cloud",
      rootDir: config.linkedCloud.repo,
      configPath: config.linkedCloud.pagesUrl,
      config: {
        version: 1,
        layer: "cloud",
        sources: [],
        provider: "codex",
        skillsDir: ".agents/skills",
        pages: {
          outDir: "dist/cloud-ui",
          dataDir: "public/data"
        }
      }
    });
  }

  return { nodes };
}

export function effectiveSkillManifests(manifests: SkillManifest[]): SkillManifest[] {
  const priority: Record<Layer, number> = {
    project: 3,
    system: 2,
    cloud: 1
  };
  const byName = new Map<string, SkillManifest>();

  for (const manifest of manifests) {
    const current = byName.get(manifest.name);
    if (!current || priority[manifest.layer] > priority[current.layer]) {
      byName.set(manifest.name, manifest);
    }
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function expandHome(path: string): string {
  if (!path.startsWith("~/")) {
    return path;
  }

  const home = process.env.USERPROFILE ?? process.env.HOME;
  if (!home) {
    return path;
  }

  return join(home, path.slice(2));
}

async function assertReadable(path: string): Promise<void> {
  try {
    await access(path);
  } catch {
    throw new Error(`Linked config is not readable: ${path}`);
  }
}
