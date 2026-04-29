import { chmod, mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cliEntry = join(rootDir, "packages", "cli", "dist", "index.js");
const binDir = findGlobalBinDir();

await mkdir(binDir, { recursive: true });

if (process.platform === "win32") {
  await writeFile(
    join(binDir, "skills-manage.cmd"),
    `@ECHO off\r\nnode "${cliEntry}" %*\r\n`,
    "utf8"
  );
  await writeFile(
    join(binDir, "skills-manage.ps1"),
    `#!/usr/bin/env pwsh\r\nnode "${cliEntry}" @args\r\n`,
    "utf8"
  );
} else {
  const shimPath = join(binDir, "skills-manage");
  await writeFile(shimPath, `#!/usr/bin/env sh\nexec node "${cliEntry}" "$@"\n`, "utf8");
  await chmod(shimPath, 0o755);
}

console.log(`Installed skills-manage globally at ${binDir}`);
console.log("Try: skills-manage --help");

function findGlobalBinDir() {
  if (process.env.PNPM_HOME) {
    return process.env.PNPM_HOME;
  }

  try {
    return execFileSync("pnpm", ["bin", "--global"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    throw new Error("Unable to locate the pnpm global bin directory. Set PNPM_HOME and try again.");
  }
}
