import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  type ResolvedRepo,
  type Source,
  type UnresolvedSource
} from "@skills-manage/schemas";

export interface ResolveResult {
  repos: ResolvedRepo[];
  unresolved: UnresolvedSource[];
}

export async function resolveSources(sources: Source[], rootDir = process.cwd()): Promise<ResolveResult> {
  const repos: ResolvedRepo[] = [];
  const unresolved: UnresolvedSource[] = [];

  for (const source of sources.filter((item) => item.enabled)) {
    try {
      const resolved = await resolveSource(source, rootDir);
      repos.push(...resolved);
    } catch (error) {
      unresolved.push({
        sourceId: source.id,
        reason: error instanceof Error ? error.message : "Unknown resolver error"
      });
    }
  }

  return { repos, unresolved };
}

async function resolveSource(source: Source, rootDir: string): Promise<ResolvedRepo[]> {
  if (source.type === "github") {
    const repo = parseGithubRepo(source.value);
    if (!repo) {
      throw new Error("Not a supported GitHub repository URL");
    }
    return [
      {
        sourceId: source.id,
        repo,
        url: `https://github.com/${repo}.git`,
        resolvedFrom: source.value
      }
    ];
  }

  if (source.type === "package-json") {
    return resolvePackageJson(source, rootDir);
  }

  return resolveGoMod(source, rootDir);
}

async function resolvePackageJson(source: Source, rootDir: string): Promise<ResolvedRepo[]> {
  const filePath = resolve(rootDir, source.value);
  const pkg = JSON.parse(await readFile(filePath, "utf8")) as {
    repository?: string | { url?: string };
  };
  const repository = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  const repo = repository ? parseGithubRepo(repository) : undefined;
  if (!repo) {
    throw new Error("package.json repository is missing or not hosted on GitHub");
  }

  return [
    {
      sourceId: source.id,
      repo,
      url: `https://github.com/${repo}.git`,
      resolvedFrom: filePath
    }
  ];
}

async function resolveGoMod(source: Source, rootDir: string): Promise<ResolvedRepo[]> {
  const filePath = resolve(rootDir, source.value);
  const content = await readFile(filePath, "utf8");
  const moduleLine = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("module "));
  const repo = moduleLine ? parseGithubRepo(moduleLine.slice("module ".length)) : undefined;
  if (!repo) {
    throw new Error("go.mod module is missing or not hosted on GitHub");
  }

  return [
    {
      sourceId: source.id,
      repo,
      url: `https://github.com/${repo}.git`,
      resolvedFrom: dirname(filePath)
    }
  ];
}

export function parseGithubRepo(value: string): string | undefined {
  const normalized = value
    .trim()
    .replace(/^git\+/, "")
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/\.git$/, "");
  const match = normalized.match(/github\.com[/:]([^/\s]+)\/([^/\s#?]+)/);
  if (!match) {
    return undefined;
  }

  return `${match[1]}/${match[2]}`;
}
