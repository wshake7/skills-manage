import type { Layer } from "@skills-manage/schemas";

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
