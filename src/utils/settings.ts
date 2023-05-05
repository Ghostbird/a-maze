import type { MovementType } from '@/utils/movement'
import type { MazeRenderMode } from '@/utils/render'

export type MazeSettings = {
  renderMode: MazeRenderMode
  movementMode: MovementType
  width: number
  height: number
  controlPreference: 'left' | 'middle' | 'right'
  builtInTileSet: string
  customTileSetUri: string
}

export const defaultMazeSettings: MazeSettings = {
  renderMode: 'tiles',
  movementMode: 'choice',
  width: 10,
  height: 10,
  controlPreference: 'right',
  builtInTileSet: 'tilesets/default/default.png',
  customTileSetUri: 'tilesets/default/default.png'
}

export const getSettings = (key = 'settings'): MazeSettings =>
  Object.assign({}, defaultMazeSettings, JSON.parse(localStorage.getItem(key) ?? '{}'))
