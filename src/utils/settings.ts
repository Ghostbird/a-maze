import { migrateSettings } from '@/utils/migrations'
import type { MovementType } from '@/utils/movement'
import type { MazeRenderMode } from '@/utils/render'
import { useRoute } from 'vue-router'

export type MazeSettings = {
  version: number
  renderMode: MazeRenderMode
  movementMode: MovementType
  width: number
  height: number
  controlPreference: 'left' | 'middle' | 'right'
  builtInTileSet: string
  customTileSetUri: string
}

export const currentVersion = {
  version: 1
}

export const defaultMazeSettings: MazeSettings = {
  ...currentVersion,
  renderMode: 'tiles',
  movementMode: 'choice',
  width: 10,
  height: 10,
  controlPreference: 'right',
  builtInTileSet: 'default',
  customTileSetUri: 'default'
}

export const builtInTileSets = {
  Default: 'default',
  Multiplex: 'multiplex'
}

export const builtinTileSetUri = (builtInTileSetName: string) =>
  !!builtInTileSetName ? `tilesets/${builtInTileSetName}/${builtInTileSetName}.png` : undefined

export const getSettings = (key = 'settings'): MazeSettings => {
  let localStorageSettings = (JSON.parse(localStorage.getItem(key) ?? `${null}`) ??
    currentVersion) as typeof currentVersion & Record<string, unknown>
  if (localStorageSettings.version !== defaultMazeSettings.version) {
    localStorageSettings = migrateSettings(localStorageSettings)
    //‌ Save migrated settings
    localStorage.setItem(key, JSON.stringify(localStorageSettings))
  }
  return Object.assign({}, defaultMazeSettings, localStorageSettings)
}
