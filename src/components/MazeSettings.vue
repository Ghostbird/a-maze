<script setup lang="ts">
import { builtInTileSets, builtinTileSetUri, getSettings, type MazeSettings } from '@/utils/settings';
import { reactive } from 'vue';
const settingsKey = 'settings'
const settings = reactive(getSettings());
const updateSetting = <K extends keyof MazeSettings>(key: K) => (ev: Event) => {
  // Awkward cast required because a DOM input change event is an `Event` whose `target` has no `value`
  settings[key] = (ev as unknown as { target: HTMLElement & { value: MazeSettings[K] } }).target.value;
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}
</script>
<template>
  <header>
    <h1>Settings</h1>
  </header>
  <main>
    <form>
      <span style="grid-area: renderMode">Render mode:</span>
      <select style="grid-area: renderChoice" name="renderMode" :value="settings.renderMode"
        @change="$event => updateSetting('renderMode')($event)">
        <option value="svg">SVG</option>
        <option value="tiles">Canvas bitmap tiles</option>
      </select>
      <template v-if="settings.renderMode === 'tiles'">
        <span style="grid-area: tileSet">Tile-set:</span>
        <select style="grid-area: tileSetChoice" name="tilesUri" :value="settings.builtInTileSet"
          @change="$event => updateSetting('builtInTileSet')($event)">
          <option v-for="(path, key) in builtInTileSets" :value="path">{{key}}</option>
          <option value="">Load from URI</option>
        </select>
      </template>
      <template v-if="!settings.builtInTileSet">
        <span style="grid-area: tileUri">Custom tile-set URI</span>
        <input style="grid-area: tileUriString" type="text" :value="settings.customTileSetUri"
          @change="$event => updateSetting('customTileSetUri')($event)" />
      </template>
      <span style="grid-area: movementMode">Movement mode:</span>
      <select style="grid-area: movementChoice" name="movementMode" :value="settings.movementMode"
        @change="$event => updateSetting('movementMode')($event)">
        <option value="step">Step</option>
        <option value="choice">Decision</option>
      </select>
      <span style="grid-area: size">Maze size:</span>
      <input style="grid-area: width" type="number" step="1" min="1" :value="settings.width"
        @change="$event => updateSetting('width')($event)" />
      <span style="grid-area: times">×</span>
      <input style="grid-area: height" type="number" step="1" min="1" :value="settings.height"
        @change="$event => updateSetting('height')($event)" />
      <span style="grid-area: controls">Control preference:</span>
      <span style="grid-area: left"><input type="radio" id="left" name="controls"
          :checked="settings.controlPreference === 'left'" value="left"
          @change="$event => updateSetting('controlPreference')($event)" />
        <label for="left">Left</label>
      </span>
      <span style="grid-area: right"><input type="radio" id="right" name="controls"
          :checked="settings.controlPreference === 'right'" value="right"
          @change="$event => updateSetting('controlPreference')($event)" />
        <label for="right">Right</label>
      </span>
    </form>
    <div v-if="settings.renderMode === 'tiles'" class="tile-set">
      <span>Tile-set preview:</span>
      <img :src="builtinTileSetUri(settings.builtInTileSet) ?? settings.customTileSetUri" error="Failed to load!" />
      <h2>Create your own!</h2>
      <p>
        <a href="tilesets/default/default.svg" target="blank" download="tileset-template.svg">Download tile-set SVG
          template</a> made for <a href="https://inkscape.org">Inkscape</a>
      </p>
      <p>
        <a href="tilesets/default/default.png" target="blank" download="tileset-template.png">Download tile-set PNG
          template</a>
      </p>
      <p>
        Once you've made your own tile-set, upload it somewhere <em>publicly</em> accessible on the internet. Then choose <em>Tile-set: Load from URI</em> above, and paste the URI in the field <em>Custom tile-set URI</em>.
      </p>
    </div>
    <router-link v-bind="$attrs" class='router-link' to="/">⏎</router-link>
  </main>
</template>
<style scoped>
header,
main {
  max-width: 100vw;
}

form {
  grid-area: options;
  display: grid;
  grid-template:
    'renderMode   renderChoice   renderChoice   renderChoice' min-content
    'tileSet      tileSetChoice  tileSetChoice  tileSetChoice' min-content
    'tileUri      tileUriString  tileUriString  tileUriString' min-content
    'movementMode movementChoice movementChoice movementChoice' min-content
    'size         width          times          height' min-content
    'controls     left           .              right' min-content / min-content 1fr 1fr 1fr;
  gap: 0.1em 0.25em;
}

form>* {
  max-width: 50vw;
}

span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

input[type="number"] {
  max-width: 5em;
}

input[type="radio"] {
  margin-right: 1em;
}

.tile-set>img {
  display: block;
}

img {
  max-width: 100%;
}
</style>
