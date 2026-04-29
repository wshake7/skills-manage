import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import type { ResolvedRepo } from "@skills-manage/schemas";

export interface FetchResult {
  repo: string;
  path: string;
}

export async function shallowFetch(repo: ResolvedRepo, cacheDir: string): Promise<FetchResult> {
  await mkdir(cacheDir, { recursive: true });
  const target = join(cacheDir, repo.repo.replace(/[\\/]/g, "__"));
  await run("git", ["clone", "--depth", "1", repo.url, target]);
  return {
    repo: repo.repo,
    path: target
  };
}

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32"
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
  });
}
