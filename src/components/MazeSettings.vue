<script setup lang="ts">
import { getSettings, type MazeSettings } from '@/utils/settings';

const settingsKey = 'settings'
const settings = getSettings();
const updateSetting = <K extends keyof MazeSettings>(key: K) => (ev: { target: HTMLElement & { value: MazeSettings[K] } }) => {
  settings[key] = ev.target.value;
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}
</script>
<template>
  <header>
    <h1>Settings</h1>
  </header>
  <main>
    <router-link v-bind="$attrs" class='router-link' to="/">⏎</router-link>
    <form>
      <span style="grid-area: renderMode">Render mode:</span>
      <select style="grid-area: renderChoice" name="renderMode" :value="settings.renderMode"
        @change="$event => updateSetting('renderMode')($event)">
        <option value="svg">SVG</option>
        <option value="tiles">Canvas bitmap tiles</option>
      </select>
      <span style="grid-area: movementMode">Movement mode:</span>
      <select style="grid-area: movementChoice" name="movementMode" :value="settings.movementMode"
        @change="$event => updateSetting('movementMode')($event)">
        <option value="step">Step</option>
        <option value="choice">Decision</option>
      </select>
      <span style="grid-area: size">Maze size</span>
      <input style="grid-area: width" type="number" step="1" min="1" :value="settings.width"
        @change="$event => updateSetting('width')($event)" />
      <span style="grid-area: times">×</span>
      <input style="grid-area: height" type="number" step="1" min="1" :value="settings.height"
        @change="$event => updateSetting('height')($event)" />
      <span style="grid-area: controls">Control preference</span>
      <div style="grid-area: left"><input type="radio" id="left" name="controls"
          :checked="settings.controlPreference === 'left'" value="left"
          @change="$event => updateSetting('controlPreference')($event)" />
        <label for="left">Left</label>
      </div>
      <div style="grid-area: right"><input type="radio" id="right" name="controls"
          :checked="settings.controlPreference === 'right'" value="right"
          @change="$event => updateSetting('controlPreference')($event)" />
        <label for="right">Right</label>
      </div>
    </form>
  </main>
</template>
<style scoped>
form {
  grid-area: options;
  display: grid;
  grid-template:
    'renderMode   renderChoice   renderChoice   renderChoice' min-content
    'movementMode movementChoice movementChoice movementChoice' min-content
    'size         width          times          height' min-content
    'controls     left           .              right' min-content / min-content 1fr 1fr 1fr;
  gap: 0.1em 1em;
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
</style>
