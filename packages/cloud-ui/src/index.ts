import type { Source } from "@skills-manage/schemas";

export interface CloudUiSnapshot {
  layer: "cloud";
  generatedAt: string;
  sources: Source[];
  readonly: true;
}

export function createCloudSnapshot(sources: Source[]): CloudUiSnapshot {
  return {
    layer: "cloud",
    generatedAt: new Date().toISOString(),
    sources,
    readonly: true
  };
}
