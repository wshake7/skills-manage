#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { Command, Option } from "commander";
import {
  buildLayerGraph,
  configPathFor,
  defaultConfig,
  readConfig,
  resolveSources,
  writeConfig
} from "@skills-manage/core";
import { createProvider } from "@skills-manage/providers";
import { type Layer, configFileName } from "@skills-manage/schemas";

const program = new Command();

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
    const config = await readConfig(configPathFor(resolve(options.dir), options.layer));
    const provider = createProvider(config.provider);
    const check = await provider.checkAuth();
    if (!check.ok) {
      throw new Error(check.message);
    }

    console.log(`Provider ${provider.name} is ready. Skill generation will be implemented in the next iteration.`);
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
    const config = await readConfig(configPathFor(rootFor(layer, options.dir), layer));
    if (config.layer === "cloud") {
      throw new Error("Cloud UI is static and must be published with publish-cloud-ui.");
    }

    console.log(`Local UI placeholder for ${config.layer} will listen on ${config.ui.host}:${config.ui.port}.`);
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
