import { rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const binDir = findGlobalBinDir();
const names =
  process.platform === "win32"
    ? ["skills-manage.cmd", "skills-manage.ps1"]
    : ["skills-manage"];

for (const name of names) {
  await rm(join(binDir, name), { force: true });
}

console.log(`Removed skills-manage global command from ${binDir}`);

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
