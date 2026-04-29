import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Layer } from "@skills-manage/schemas";
import type { ProjectConfig, SystemConfig } from "@skills-manage/schemas";

export interface LocalUiMode {
  layer: Extract<Layer, "system" | "project">;
  canWriteCurrentLayer: true;
  canWriteSystem: boolean;
  canWriteCloud: false;
}

export function localUiMode(layer: Extract<Layer, "system" | "project">): LocalUiMode {
  return {
    layer,
    canWriteCurrentLayer: true,
    canWriteSystem: layer === "system",
    canWriteCloud: false
  };
}

export interface StartLocalUiServerOptions {
  rootDir: string;
  config: SystemConfig | ProjectConfig;
}

export async function startLocalUiServer(options: StartLocalUiServerOptions): Promise<void> {
  const mode = localUiMode(options.config.layer);
  const host = options.config.ui.host;
  const port = options.config.ui.port;
  const startedAt = new Date().toISOString();

  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);

    if (url.pathname === "/health") {
      sendJson(response, {
        ok: true,
        layer: options.config.layer,
        startedAt
      });
      return;
    }

    if (url.pathname === "/api/status") {
      sendJson(response, {
        layer: options.config.layer,
        rootDir: options.rootDir,
        skillsDir: options.config.skillsDir,
        provider: options.config.provider,
        permissions: mode,
        sources: options.config.sources,
        startedAt
      });
      return;
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      sendHtml(response, renderIndexHtml({ ...options, mode, startedAt }));
      return;
    }

    response.statusCode = 404;
    response.end("Not found");
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  console.log(`Local UI available at http://${host}:${port}`);
  console.log("Press Ctrl+C to stop.");

  await new Promise<void>((resolve) => {
    const close = () => {
      server.close(() => resolve());
    };
    process.once("SIGINT", close);
    process.once("SIGTERM", close);
  });
}

function sendJson(response: ServerResponse, data: unknown): void {
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(`${JSON.stringify(data, null, 2)}\n`);
}

function sendHtml(response: ServerResponse, html: string): void {
  response.setHeader("content-type", "text/html; charset=utf-8");
  response.end(html);
}

function renderIndexHtml(options: StartLocalUiServerOptions & {
  mode: LocalUiMode;
  startedAt: string;
}): string {
  const title = `${options.config.layer} skills`;
  const sources = options.config.sources
    .map((source) => `<li><code>${escapeHtml(source.id)}</code> ${escapeHtml(source.type)} ${escapeHtml(source.value)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>skills-manage</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        background: #f7f7f4;
        color: #20211f;
      }
      main {
        max-width: 920px;
        margin: 0 auto;
        padding: 40px 24px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 32px;
      }
      .muted {
        color: #666b62;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin: 24px 0;
      }
      section {
        border: 1px solid #ddded8;
        border-radius: 8px;
        padding: 16px;
        background: #ffffff;
      }
      code {
        background: #eeefea;
        border-radius: 4px;
        padding: 2px 5px;
      }
      ul {
        padding-left: 20px;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background: #181a1b;
          color: #f2f3ef;
        }
        section {
          background: #202325;
          border-color: #363a3d;
        }
        .muted {
          color: #aeb4ac;
        }
        code {
          background: #303438;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <p class="muted">skills-manage local UI</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="muted">Running from <code>${escapeHtml(options.rootDir)}</code></p>
      <div class="grid">
        <section>
          <h2>Layer</h2>
          <p><code>${escapeHtml(options.config.layer)}</code></p>
        </section>
        <section>
          <h2>Provider</h2>
          <p><code>${escapeHtml(options.config.provider)}</code></p>
        </section>
        <section>
          <h2>Skills Dir</h2>
          <p><code>${escapeHtml(options.config.skillsDir)}</code></p>
        </section>
        <section>
          <h2>Permissions</h2>
          <p>Current layer writable: <code>${String(options.mode.canWriteCurrentLayer)}</code></p>
          <p>Cloud writable: <code>${String(options.mode.canWriteCloud)}</code></p>
        </section>
      </div>
      <section>
        <h2>Sources</h2>
        ${sources ? `<ul>${sources}</ul>` : '<p class="muted">No sources configured yet.</p>'}
      </section>
      <section>
        <h2>Status API</h2>
        <p><a href="/health">/health</a> <a href="/api/status">/api/status</a></p>
        <p class="muted">Started at ${escapeHtml(options.startedAt)}</p>
      </section>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
