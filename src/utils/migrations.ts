import type { MazeSettings } from '@/utils/settings'

export const migrateSettings = (settings: { version?: number }) => {
  for (let version = settings.version ?? 0; version < settingsMigrations.length; version++) {
    // Must assign this function in the local scope, because typeof settingsMigrations[version] doesn't work in TypeScript, and we need to assert the parameter type.
    const migrationStep = settingsMigrations[version]
    settings = migrationStep(settings as Parameters<typeof migrationStep>[0])
  }
  return settings as MazeSettings
}

const migrateToV1 = (v0Settings: {
  renderMode: 'svg' | 'tiles'
  movementMode: 'step' | 'choice'
  width: number
  height: number
  controlPreference: 'left' | 'middle' | 'right'
  builtInTileSet: string
  customTileSetUri: string
}) => ({
  ...v0Settings,
  version: 1,
  ...('builtInTileSet' in v0Settings
    ? {
        builtInTileSet: (v0Settings.builtInTileSet as string)?.replace(
          new RegExp('tilesets(?:/([a-z]+)){2}.png'),
          (_, tileSetName) => tileSetName
        )
      }
    : {})
})

const settingsMigrations = [migrateToV1]
