#!/usr/bin/env node
import { execFile } from "node:child_process";
import { cp, mkdir, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { Command, Option } from "commander";
import {
  buildLayerGraph,
  configPathFor,
  createManagedManifest,
  defaultConfig,
  readConfig,
  resolveSources,
  writeConfig
} from "@skills-manage/core";
import { startLocalUiServer } from "@skills-manage/local-ui";
import { createProvider } from "@skills-manage/providers";
import { type Layer, configFileName } from "@skills-manage/schemas";

const program = new Command();
const execFileAsync = promisify(execFile);
const recentArchiveLimit = 10;

program
  .name("sm")
  .description("Manage cloud, system, and project AI skills. Alias: skills-manage.")
  .version("0.1.0");

program
  .command("init-cloud")
  .description("Initialize a cloud skills workspace in the current directory.")
  .option("--dir <path>", "Target directory", ".")
  .action(async (options: { dir: string }) => {
    await initLayer("cloud", resolve(options.dir));
  });

program
  .command("init-system")
  .description("Initialize a system skills workspace. Defaults to ~/.skills-manage.")
  .option("--dir <path>", "Target directory")
  .action(async (options: { dir?: string }) => {
    await initLayer("system", rootFor("system", options.dir));
  });

program
  .command("init-project")
  .description("Initialize a project skills workspace in the current directory.")
  .option("--dir <path>", "Target directory", ".")
  .action(async (options: { dir: string }) => {
    await initLayer("project", resolve(options.dir));
  });

program
  .command("doctor")
  .description("Check config, provider credentials, git, and layer links.")
  .addOption(layerOption())
  .option("--dir <path>", "Workspace directory", ".")
  .action(async (options: { layer: Layer; dir: string }) => {
    const configPath = configPathFor(resolve(options.dir), options.layer);
    const config = await readConfig(configPath);
    const graph = await buildLayerGraph(configPath);
    const provider = createProvider(config.provider);
    const auth = await provider.checkAuth();
    console.log(`Config: ${configPath}`);
    console.log(`Layer: ${config.layer}`);
    console.log(`Graph: ${graph.nodes.map((node) => node.layer).join(" -> ")}`);
    console.log(`Provider: ${provider.name} (${auth.ok ? "ok" : "needs attention"})`);
    console.log(auth.message);
  });

program
  .command("sync")
  .description("Resolve configured sources for the selected layer.")
  .addOption(layerOption())
  .option("--dir <path>", "Workspace directory", ".")
  .action(async (options: { layer: Layer; dir: string }) => {
    const rootDir = resolve(options.dir);
    const config = await readConfig(configPathFor(rootDir, options.layer));
    const result = await resolveSources(config.sources, rootDir);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command("ai-update")
  .description("Run the selected layer's provider update flow.")
  .addOption(layerOption())
  .option("--dir <path>", "Workspace directory", ".")
  .action(async (options: { layer: Layer; dir: string }) => {
    const rootDir = resolve(options.dir);
    const config = await readConfig(configPathFor(rootDir, options.layer));
    const provider = createProvider(config.provider);
    const check = await provider.checkAuth();
    if (!check.ok) {
      throw new Error(check.message);
    }

    const resolved = await resolveSources(config.sources, rootDir);
    for (const unresolved of resolved.unresolved) {
      console.warn(`Skipped ${unresolved.sourceId}: ${unresolved.reason}`);
    }

    if (resolved.repos.length === 0) {
      console.log("No enabled sources resolved to repositories.");
      return;
    }

    for (const repo of resolved.repos) {
      const skillName = safePathSegment(repo.sourceId);
      const result = await provider.generateSkill({
        skillName,
        sourcePath: repo.resolvedFrom,
        prompt: [
          `Create or update a Codex skill for ${repo.repo}.`,
          "The skill must help an AI coding agent work effectively with this repository or technology.",
          "Keep it concise, reusable, and include concrete workflow guidance."
        ].join("\n")
      });
      const targetDir = resolve(rootDir, config.skillsDir, safePathSegment(result.skillName || skillName));
      await archiveExistingSkill(rootDir, targetDir, safePathSegment(result.skillName || skillName));
      await writeGeneratedSkillFiles(targetDir, result.files);

      const manifest = createManagedManifest({
        name: result.skillName || skillName,
        layer: config.layer,
        sourceRepo: repo.repo,
        sourceCommit: await resolveRemoteHead(repo.url),
        provider: config.provider
      });
      await writeFile(join(targetDir, "skill.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
      console.log(`Updated ${relative(rootDir, targetDir)} from ${repo.repo}.`);
    }
  });

program
  .command("publish-cloud-ui")
  .description("Prepare static cloud UI data for GitHub Pages.")
  .option("--dir <path>", "Cloud workspace directory", ".")
  .action(async (options: { dir: string }) => {
    const rootDir = resolve(options.dir);
    const config = await readConfig(configPathFor(rootDir, "cloud"));
    if (config.layer !== "cloud") {
      throw new Error("publish-cloud-ui requires a cloud config.");
    }

    const dataDir = join(rootDir, config.pages.dataDir);
    await mkdir(dataDir, { recursive: true });
    await writeFile(
      join(dataDir, "skills-manage.json"),
      `${JSON.stringify({ layer: "cloud", sources: config.sources, generatedAt: new Date().toISOString() }, null, 2)}\n`,
      "utf8"
    );
    console.log(`Wrote ${join(dataDir, "skills-manage.json")}`);
  });

program
  .command("ui")
  .description("Start the local UI. Defaults to the system layer from ~/.skills-manage.")
  .option("--system", "Use the system layer")
  .option("--project", "Use the project layer")
  .option("--dir <path>", "Workspace directory")
  .action(async (options: { system?: boolean; project?: boolean; dir?: string }) => {
    const layer: Extract<Layer, "system" | "project"> = options.project ? "project" : "system";
    const rootDir = rootFor(layer, options.dir);
    const config = await readConfig(configPathFor(rootDir, layer));
    if (config.layer === "cloud") {
      throw new Error("Cloud UI is static and must be published with publish-cloud-ui.");
    }

    await startLocalUiServer({ rootDir, config });
  });

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

async function initLayer(layer: Layer, rootDir: string): Promise<void> {
  const config = defaultConfig(layer);
  await writeConfig(configPathFor(rootDir, layer), config);
  await mkdir(join(rootDir, ".agents", "skills"), { recursive: true });
  if (layer === "cloud") {
    await mkdir(join(rootDir, ".github", "workflows"), { recursive: true });
    await mkdir(join(rootDir, "public", "data"), { recursive: true });
  }

  console.log(`Initialized ${layer} workspace with ${configFileName(layer)}.`);
}

function layerOption(): Option {
  return new Option("--layer <layer>", "Layer to operate on")
    .choices(["cloud", "system", "project"])
    .default("project") as Option;
}

function rootFor(layer: Layer, dir?: string): string {
  if (dir) {
    return resolve(dir);
  }

  if (layer === "system") {
    return join(homedir(), ".skills-manage");
  }

  return resolve(".");
}

async function writeGeneratedSkillFiles(targetDir: string, files: Array<{ path: string; content: string }>): Promise<void> {
  await mkdir(targetDir, { recursive: true });

  for (const file of files) {
    const filePath = resolve(targetDir, file.path);
    const relativePath = relative(targetDir, filePath);
    if (relativePath.startsWith("..") || resolve(relativePath) === relativePath) {
      throw new Error(`Generated file path escapes skill directory: ${file.path}`);
    }

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, file.content, "utf8");
  }
}

async function archiveExistingSkill(rootDir: string, targetDir: string, skillName: string): Promise<void> {
  const existing = await stat(targetDir).catch(() => undefined);
  if (!existing?.isDirectory()) {
    return;
  }

  const entries = await readdir(targetDir).catch(() => []);
  if (entries.length === 0) {
    return;
  }

  const archiveRoot = resolve(rootDir, ".agents", "skill-archives", skillName);
  const recentRoot = join(archiveRoot, "recent");
  const timestamp = archiveTimestamp();
  const archiveDir = join(recentRoot, timestamp);
  await mkdir(recentRoot, { recursive: true });
  await cp(targetDir, archiveDir, { recursive: true });
  await rm(targetDir, { recursive: true, force: true });
  await rotateSkillArchives(archiveRoot, recentRoot);
  console.log(`Archived previous ${relative(rootDir, targetDir)} to ${relative(rootDir, archiveDir)}.`);
}

async function rotateSkillArchives(archiveRoot: string, recentRoot: string): Promise<void> {
  const recentEntries = await readdir(recentRoot, { withFileTypes: true }).catch(() => []);
  const versions = recentEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
  const overflow = versions.slice(recentArchiveLimit);
  if (overflow.length === 0) {
    return;
  }

  const olderRoot = join(archiveRoot, "older");
  await mkdir(olderRoot, { recursive: true });
  for (const version of overflow) {
    await rename(join(recentRoot, version), join(olderRoot, version));
  }
}

function archiveTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9a-z]/gi, "-").replace(/-+$/g, "");
}

async function resolveRemoteHead(url: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", ["ls-remote", url, "HEAD"]);
    return stdout.trim().split(/\s+/)[0] || "unknown";
  } catch {
    return "unknown";
  }
}

function safePathSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "skill";
}
