import { createServer, type ServerResponse } from "node:http";
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
  const title = `${capitalize(options.config.layer)} Skills`;
  const sourceCount = options.config.sources.length;
  const enabledSourceCount = options.config.sources.filter((source) => source.enabled).length;
  const disabledSourceCount = sourceCount - enabledSourceCount;
  const writableScopes = [
    options.mode.canWriteCurrentLayer ? "Current layer" : undefined,
    options.mode.canWriteSystem ? "System" : undefined,
    options.mode.canWriteCloud ? "Cloud" : undefined
  ].filter(Boolean);
  const visibleLayers =
    options.config.layer === "project" ? ["Project", "System", "Cloud"] : ["System", "Cloud"];
  const sources = options.config.sources
    .map(
      (source) => `<tr>
        <td><span class="mono">${escapeHtml(source.id)}</span></td>
        <td><span class="pill">${escapeHtml(source.type)}</span></td>
        <td><span class="pill mode">${escapeHtml(source.mode)}</span></td>
        <td class="truncate" title="${escapeHtml(source.value)}">${escapeHtml(source.value)}</td>
        <td class="truncate" title="${escapeHtml(source.runtime?.preferred.join(", ") ?? "none")}">${escapeHtml(source.runtime?.preferred.join(", ") ?? "none")}</td>
        <td><span class="status ${source.enabled ? "ok" : "paused"}">${source.enabled ? "Enabled" : "Paused"}</span></td>
      </tr>`
    )
    .join("");
  const layerSteps = visibleLayers
    .map(
      (layer) => `<div class="layer-step ${layer.toLowerCase() === options.config.layer ? "active" : ""}">
        <span class="step-dot"></span>
        <span>${escapeHtml(layer)}</span>
      </div>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>skills-manage</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        --bg: #f6f7f9;
        --panel: #ffffff;
        --panel-soft: #f0f4f3;
        --text: #17201c;
        --muted: #66706b;
        --line: #dfe5e1;
        --line-strong: #c7d0cb;
        --teal: #0f766e;
        --teal-soft: #d9f1ed;
        --indigo: #3949ab;
        --indigo-soft: #e5e8ff;
        --amber: #b45309;
        --amber-soft: #fff1d6;
        --red: #b42318;
        --shadow: 0 16px 40px rgba(24, 32, 28, 0.08);
      }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
      }
      * {
        box-sizing: border-box;
      }
      a {
        color: inherit;
      }
      .shell {
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
        min-height: 100vh;
      }
      aside {
        border-right: 1px solid var(--line);
        background: #101817;
        color: #eef6f2;
        padding: 20px 16px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 28px;
        font-weight: 700;
      }
      .brand-mark {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background: #1f6f68;
        color: #ffffff;
        font-weight: 800;
      }
      nav {
        display: grid;
        gap: 6px;
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 38px;
        padding: 8px 10px;
        border-radius: 8px;
        color: #c5d1cb;
        text-decoration: none;
        transition: background 180ms ease, color 180ms ease;
      }
      .nav-item:hover,
      .nav-item:focus-visible,
      .nav-item.active {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        outline: none;
      }
      .nav-icon {
        width: 18px;
        height: 18px;
        color: currentColor;
      }
      .workspace {
        margin-top: 28px;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        padding-top: 16px;
        color: #aab9b3;
        font-size: 13px;
      }
      .workspace code {
        display: block;
        margin-top: 8px;
        overflow-wrap: anywhere;
        color: #ffffff;
      }
      main {
        min-width: 0;
        padding: 22px;
      }
      header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }
      h1,
      h2,
      h3,
      p {
        margin: 0;
      }
      h1 {
        font-size: 30px;
        line-height: 1.15;
        letter-spacing: 0;
      }
      h2 {
        font-size: 16px;
        line-height: 1.3;
        letter-spacing: 0;
      }
      h3 {
        font-size: 13px;
        color: var(--muted);
        font-weight: 600;
        letter-spacing: 0;
        text-transform: uppercase;
      }
      .muted {
        color: var(--muted);
      }
      .eyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: var(--teal);
        font-weight: 700;
      }
      .toolbar {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 8px 11px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        color: var(--text);
        text-decoration: none;
        font-weight: 650;
        transition: border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
      }
      .button:hover,
      .button:focus-visible {
        border-color: var(--teal);
        box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
        outline: none;
      }
      .button.primary {
        background: var(--teal);
        border-color: var(--teal);
        color: #ffffff;
      }
      .dashboard {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 16px;
        align-items: start;
      }
      .stack {
        display: grid;
        gap: 16px;
      }
      .panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: var(--shadow);
      }
      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 18px;
        border-bottom: 1px solid var(--line);
      }
      .panel-body {
        padding: 18px;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 16px;
      }
      .metric {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 14px;
      }
      .metric .value {
        display: block;
        margin-top: 10px;
        font-size: 26px;
        line-height: 1;
        font-weight: 800;
      }
      .metric .caption {
        display: block;
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }
      .layer-map {
        display: grid;
        gap: 10px;
      }
      .layer-step {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 42px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 10px 12px;
        background: var(--panel-soft);
        color: var(--muted);
        font-weight: 650;
      }
      .layer-step.active {
        border-color: var(--teal);
        background: var(--teal-soft);
        color: #0b4944;
      }
      .step-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: currentColor;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }
      th,
      td {
        border-bottom: 1px solid var(--line);
        padding: 12px 10px;
        text-align: left;
        vertical-align: middle;
      }
      th {
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
      }
      tr:hover td {
        background: #f8fbfa;
      }
      .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        display: grid;
        place-items: center;
        min-height: 150px;
        border: 1px dashed var(--line-strong);
        border-radius: 8px;
        color: var(--muted);
        background: #fbfcfb;
      }
      .mono,
      code {
        font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
      }
      code,
      .mono {
        background: #edf2f0;
        border-radius: 5px;
        padding: 2px 6px;
        font-size: 13px;
      }
      .pill,
      .status {
        display: inline-flex;
        align-items: center;
        min-height: 24px;
        border-radius: 999px;
        padding: 3px 8px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }
      .pill {
        background: var(--indigo-soft);
        color: var(--indigo);
      }
      .pill.mode {
        background: var(--teal-soft);
        color: #0b4944;
      }
      .status.ok {
        background: var(--teal-soft);
        color: #0b4944;
      }
      .status.paused {
        background: var(--amber-soft);
        color: var(--amber);
      }
      .definition {
        display: grid;
        gap: 12px;
      }
      .definition-row {
        display: grid;
        gap: 5px;
      }
      .definition-row span {
        color: var(--muted);
        font-size: 13px;
      }
      .definition-row strong {
        overflow-wrap: anywhere;
      }
      .guardrails {
        display: grid;
        gap: 10px;
      }
      .guardrail {
        display: grid;
        grid-template-columns: 18px minmax(0, 1fr);
        gap: 10px;
        align-items: start;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 11px;
        background: #fbfcfb;
      }
      .guardrail strong {
        display: block;
        margin-bottom: 3px;
      }
      .icon {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
      }
      @media (max-width: 980px) {
        .shell {
          grid-template-columns: 1fr;
        }
        aside {
          position: static;
          border-right: 0;
        }
        .dashboard {
          grid-template-columns: 1fr;
        }
        .metrics {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 620px) {
        main {
          padding: 16px;
        }
        header {
          display: grid;
        }
        .toolbar {
          justify-content: stretch;
        }
        .button {
          justify-content: center;
          width: 100%;
        }
        .metrics {
          grid-template-columns: 1fr;
        }
        table {
          min-width: 640px;
        }
        .table-scroll {
          overflow-x: auto;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition: none !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <aside>
        <div class="brand">
          <span class="brand-mark">SM</span>
          <span>skills-manage</span>
        </div>
        <nav aria-label="Primary">
          <a class="nav-item active" href="/">
            ${iconDashboard()}
            <span>Overview</span>
          </a>
        </nav>
        <div class="workspace">
          <span>Workspace</span>
          <code>${escapeHtml(options.rootDir)}</code>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <div class="eyebrow">
              ${iconPulse()}
              <span>Local UI online</span>
            </div>
            <h1>${escapeHtml(title)}</h1>
            <p class="muted">Started ${escapeHtml(options.startedAt)}</p>
          </div>
        </header>
        <section class="metrics" aria-label="Summary metrics">
          <div class="metric">
            <h3>Layer</h3>
            <span class="value">${escapeHtml(capitalize(options.config.layer))}</span>
            <span class="caption">Active context</span>
          </div>
          <div class="metric">
            <h3>Provider</h3>
            <span class="value">${escapeHtml(options.config.provider)}</span>
            <span class="caption">Configured runtime</span>
          </div>
          <div class="metric">
            <h3>Sources</h3>
            <span class="value">${sourceCount}</span>
            <span class="caption">${enabledSourceCount} enabled, ${disabledSourceCount} paused</span>
          </div>
          <div class="metric">
            <h3>Writable</h3>
            <span class="value">${writableScopes.length}</span>
            <span class="caption">${escapeHtml(writableScopes.join(", ") || "None")}</span>
          </div>
        </section>
        <div class="dashboard">
          <div class="stack">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h2>Source Registry</h2>
                  <p class="muted">Configured dependency inputs for this layer.</p>
                </div>
                <span class="status ok">${enabledSourceCount} active</span>
              </div>
              <div class="panel-body">
                ${
                  sources
                    ? `<div class="table-scroll"><table>
                      <thead>
                        <tr>
                          <th style="width: 24%">ID</th>
                          <th style="width: 18%">Type</th>
                          <th style="width: 150px">Mode</th>
                          <th>Value</th>
                          <th style="width: 150px">Runtime</th>
                          <th style="width: 110px">State</th>
                        </tr>
                      </thead>
                      <tbody>${sources}</tbody>
                    </table></div>`
                    : '<div class="empty">No sources configured yet.</div>'
                }
              </div>
            </section>
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h2>Layer Resolution</h2>
                  <p class="muted">Effective priority is project, then system, then cloud.</p>
                </div>
              </div>
              <div class="panel-body">
                <div class="layer-map">${layerSteps}</div>
              </div>
            </section>
          </div>
          <div class="stack">
            <section class="panel">
              <div class="panel-header">
                <h2>Workspace Detail</h2>
              </div>
              <div class="panel-body definition">
                <div class="definition-row">
                  <span>Root</span>
                  <strong>${escapeHtml(options.rootDir)}</strong>
                </div>
                <div class="definition-row">
                  <span>Skills directory</span>
                  <strong>${escapeHtml(options.config.skillsDir)}</strong>
                </div>
                <div class="definition-row">
                  <span>Current layer writable</span>
                  <strong>${String(options.mode.canWriteCurrentLayer)}</strong>
                </div>
                <div class="definition-row">
                  <span>System writable</span>
                  <strong>${String(options.mode.canWriteSystem)}</strong>
                </div>
                <div class="definition-row">
                  <span>Cloud writable</span>
                  <strong>${String(options.mode.canWriteCloud)}</strong>
                </div>
              </div>
            </section>
            <section class="panel">
              <div class="panel-header">
                <h2>Runtime Guardrails</h2>
              </div>
              <div class="panel-body guardrails">
                <div class="guardrail">
                  ${iconPulse()}
                  <div>
                    <strong>Local only</strong>
                    <p class="muted">The UI listens on localhost and stays on this machine.</p>
                  </div>
                </div>
                <div class="guardrail">
                  ${iconDatabase()}
                  <div>
                    <strong>Scoped writes</strong>
                    <p class="muted">Actions are limited to the current writable layer.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </body>
</html>`;
}

function capitalize(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function iconDashboard(): string {
  return `<svg class="nav-icon icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`;
}

function iconDatabase(): string {
  return `<svg class="nav-icon icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 7c0-1.66 3.13-3 7-3s7 1.34 7 3-3.13 3-7 3-7-1.34-7-3Z" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5 7v5c0 1.66 3.13 3 7 3s7-1.34 7-3V7M5 12v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" stroke="currentColor" stroke-width="1.8"/>
  </svg>`;
}

function iconPulse(): string {
  return `<svg class="nav-icon icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12h4l2-6 4 12 2-6h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
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
