import type { VueElementConstructor } from 'vue';

export type MazeRenderMode = 'svg' | 'tiles'
interface MazeRenderer {
  render(): VueElementConstructor;
}
export const Renderers: Record<MazeRenderMode, MazeRenderer | null> = {
  svg: null,
  tiles: null
}
