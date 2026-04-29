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
  readSkillManifests,
  resolveSources,
  writeConfig
} from "@skills-manage/core";
import { startLocalUiServer } from "@skills-manage/local-ui";
import { createProvider } from "@skills-manage/providers";
import { type Layer, type ResolvedRepo, type Source, configFileName } from "@skills-manage/schemas";

const program = new Command();
const execFileAsync = promisify(execFile);
const recentArchiveLimit = 10;
const maxContext7ReferenceChars = 24_000;

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
    console.log(`Sources: ${config.sources.length} (${sourceModeSummary(config.sources)})`);
    const runtimeAdapters = config.sources.filter((source) => source.mode === "runtime-adapter");
    if (runtimeAdapters.length > 0) {
      console.log(`Runtime adapters: ${runtimeAdapters.map((source) => source.id).join(", ")}`);
    }
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
      const source = config.sources.find((item) => item.id === repo.sourceId);
      const context7Reference = source ? await fetchContext7Reference(source, repo) : undefined;
      const result = await provider.generateSkill({
        skillName,
        sourcePath: repo.resolvedFrom,
        prompt: [
          `Create or update a Codex skill for ${repo.repo}.`,
          "The skill must help an AI coding agent work effectively with this repository or technology.",
          `Skill sync mode: ${source?.mode ?? "generated"}.`,
          source?.mode === "runtime-adapter"
            ? "This is a runtime-adapter skill: document how to use the local MCP/CLI/API runtime first, then describe fallback behavior when the runtime is not configured."
            : undefined,
          source?.mode === "vendor"
            ? "This is a vendor skill: preserve the upstream skill's intent, structure, rules, and assets as much as possible instead of inventing a generic summary."
            : undefined,
          source?.runtime
            ? `Runtime requirements: ${JSON.stringify(source.runtime)}`
            : undefined,
          "Keep it concise, reusable, and include concrete workflow guidance.",
          context7Reference
            ? [
                "Prefer the following Context7-provided reference over raw GitHub repository inference.",
                "Use the GitHub repository as supporting context only when the Context7 reference is incomplete.",
                context7Reference
              ].join("\n")
            : "No Context7 reference was available; use the GitHub repository as the primary source."
        ].filter(Boolean).join("\n")
      });
      const targetDir = resolve(rootDir, config.skillsDir, safePathSegment(result.skillName || skillName));
      await archiveExistingSkill(rootDir, targetDir, safePathSegment(result.skillName || skillName));
      await writeGeneratedSkillFiles(targetDir, result.files);

      const manifest = createManagedManifest({
        name: result.skillName || skillName,
        layer: config.layer,
        sourceRepo: repo.repo,
        sourceCommit: await resolveRemoteHead(repo.url),
        provider: config.provider,
        mode: source?.mode ?? "generated",
        runtime: source?.runtime
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

      const generatedAt = new Date().toISOString();
      const skills = await readSkillManifests(resolve(rootDir, config.skillsDir));
      const snapshot = {
        layer: "cloud",
        readonly: true,
        generatedAt,
        sources: config.sources,
        skills
      };

      const dataDir = join(rootDir, config.pages.dataDir);
      await mkdir(dataDir, { recursive: true });
      await writeFile(
        join(dataDir, "skills-manage.json"),
        `${JSON.stringify(snapshot, null, 2)}\n`,
        "utf8"
      );

      const outDir = join(rootDir, config.pages.outDir);
      const outDataDir = join(outDir, "data");
      await mkdir(outDataDir, { recursive: true });
      await writeFile(join(outDataDir, "skills-manage.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
      await writeFile(join(outDir, "index.html"), cloudIndexHtml(), "utf8");

      console.log(`Wrote ${join(dataDir, "skills-manage.json")}`);
      console.log(`Wrote ${join(outDir, "index.html")}`);
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

async function fetchContext7Reference(source: Source, repo: ResolvedRepo): Promise<string | undefined> {
  if (source.context7?.prefer === false) {
    return undefined;
  }

  const query =
    source.context7?.query ??
    `Create or update a Codex skill for ${repo.repo}. Prefer official installation, runtime setup, MCP/CLI/API usage, and agent workflow guidance.`;

  try {
    const context7 = source.context7;
    const libraryId = context7?.libraryId ?? (await resolveContext7LibraryId(source, repo, query));
    if (!libraryId) {
      return undefined;
    }

    const docs = trimContext7Reference(await runContext7(["docs", libraryId, query]));
    return [
      `Context7 library ID: ${libraryId}`,
      docs
    ].join("\n\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Context7 error";
    console.warn(`Context7 reference unavailable for ${source.id}: ${message}`);
    return undefined;
  }
}

async function resolveContext7LibraryId(
  source: Source,
  repo: ResolvedRepo,
  query: string
): Promise<string | undefined> {
  const libraryName = source.context7?.libraryName ?? repo.repo.split("/").at(-1) ?? source.id;
  const output = await runContext7(["library", libraryName, query]);
  const match = output.match(/Context7-compatible library ID:\s*(\/[^\s]+)/);
  return match?.[1];
}

async function runContext7(args: string[]): Promise<string> {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const { stdout, stderr } = await execFileAsync(command, ["ctx7@latest", ...args], {
    timeout: 120_000,
    maxBuffer: 5 * 1024 * 1024
  });
  return [stdout, stderr].filter(Boolean).join("\n").trim();
}

function trimContext7Reference(content: string): string {
  if (content.length <= maxContext7ReferenceChars) {
    return content;
  }

  return `${content.slice(0, maxContext7ReferenceChars)}\n\n[Context7 reference truncated by skills-manage to keep the provider prompt within a safe size.]`;
}

function sourceModeSummary(sources: Source[]): string {
  const counts = new Map<string, number>();
  for (const source of sources) {
    counts.set(source.mode, (counts.get(source.mode) ?? 0) + 1);
  }

  return ["runtime-adapter", "vendor", "generated"]
    .map((mode) => `${mode}: ${counts.get(mode) ?? 0}`)
    .join(", ");
}

function safePathSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "skill";
}

function cloudIndexHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Skills Manage Cloud</title>
  <style>
    :root { color-scheme: light; --ink: #18202f; --muted: #657086; --line: #d9dee8; --panel: #ffffff; --bg: #f5f7fb; --accent: #256f7a; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--ink); }
    header { border-bottom: 1px solid var(--line); background: var(--panel); }
    .wrap { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
    .top { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 22px 0; }
    h1 { font-size: 24px; margin: 0; letter-spacing: 0; }
    .stamp { color: var(--muted); font-size: 13px; }
    main { padding: 24px 0 40px; }
    .metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px; }
    .metric, .section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; }
    .metric { padding: 16px; }
    .metric strong { display: block; font-size: 26px; margin-bottom: 4px; }
    .metric span, .empty { color: var(--muted); }
    .section { margin-top: 16px; overflow: hidden; }
    .section h2 { font-size: 16px; margin: 0; padding: 14px 16px; border-bottom: 1px solid var(--line); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 16px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; font-size: 14px; }
    th { color: var(--muted); font-weight: 600; background: #fafbfe; }
    tr:last-child td { border-bottom: 0; }
    code { color: var(--accent); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; overflow-wrap: anywhere; }
    .empty { padding: 16px; }
    @media (max-width: 720px) { .top, .metrics { display: block; } .metric { margin-bottom: 12px; } th, td { padding: 10px; } }
  </style>
</head>
<body>
  <header>
    <div class="wrap top">
      <h1>Skills Manage Cloud</h1>
      <div class="stamp" id="generated">Loading snapshot...</div>
    </div>
  </header>
  <main class="wrap">
    <div class="metrics">
      <div class="metric"><strong id="source-count">0</strong><span>Sources</span></div>
      <div class="metric"><strong id="skill-count">0</strong><span>Generated skills</span></div>
      <div class="metric"><strong>Read-only</strong><span>Cloud layer</span></div>
    </div>
    <section class="section">
      <h2>Sources</h2>
      <div id="sources"></div>
    </section>
    <section class="section">
      <h2>Skills</h2>
      <div id="skills"></div>
    </section>
  </main>
  <script>
    const cell = (value) => '<td>' + value + '</td>';
    const code = (value) => '<code>' + String(value ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) + '</code>';
    const empty = (text) => '<div class="empty">' + text + '</div>';
    fetch('./data/skills-manage.json')
      .then((response) => response.json())
      .then((data) => {
        const sources = data.sources || [];
        const skills = data.skills || [];
        document.getElementById('generated').textContent = 'Generated ' + new Date(data.generatedAt).toLocaleString();
        document.getElementById('source-count').textContent = sources.length;
        document.getElementById('skill-count').textContent = skills.length;
        document.getElementById('sources').innerHTML = sources.length ? '<table><thead><tr><th>ID</th><th>Type</th><th>Value</th><th>Status</th></tr></thead><tbody>' + sources.map((source) => '<tr>' + cell(code(source.id)) + cell(source.type) + cell(code(source.value)) + cell(source.enabled === false ? 'disabled' : 'enabled') + '</tr>').join('') + '</tbody></table>' : empty('No sources configured yet.');
        document.getElementById('skills').innerHTML = skills.length ? '<table><thead><tr><th>Name</th><th>Source repo</th><th>Provider</th><th>Generated</th></tr></thead><tbody>' + skills.map((skill) => '<tr>' + cell(code(skill.name)) + cell(code(skill.sourceRepo)) + cell(skill.provider) + cell(new Date(skill.generatedAt).toLocaleString()) + '</tr>').join('') + '</tbody></table>' : empty('No generated skills yet. Run Update skills and merge its PR first.');
      })
      .catch((error) => {
        document.getElementById('sources').innerHTML = empty('Could not load cloud snapshot: ' + error.message);
        document.getElementById('skills').innerHTML = empty('No data loaded.');
      });
  </script>
</body>
</html>
`;
}
