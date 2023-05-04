<script setup lang="ts">
import type { Direction2D } from '@/utils/room';
import { getSettings } from '@/utils/settings';
const emit = defineEmits<{ (ev: 'move', direction: Direction2D): void }>()
const { controlPreference } = getSettings();
</script>
<template>
  <form :class="controlPreference">
    <button type="button" name="north" @click="$emit('move', 'north')" style="grid-area:north">⇧</button>
    <button type="button" name="south" @click="$emit('move', 'south')" style="grid-area:south">⇩</button>
    <button type="button" name="west" @click="$emit('move', 'west')" style="grid-area:west">⇦</button>
    <button type="button" name="east" @click="$emit('move', 'east')" style="grid-area:east">⇨</button>
  </form>
</template>
<style scoped>
form {
  position: fixed;
  display: grid;
  grid-template:
    '.    north .   '
    'west .     east'
    '.    south .   ' auto / min-content min-content min-content;
  width: auto;
  bottom: 5vmin;
}

button {
  width: 3em;
  height: 3em;
  font-size: 3vmin;
}

@media screen and ((min-aspect-ratio: 3/2) or (max-aspect-ratio: 2/3)) {
  form.right {
    right: 5vmin;
    left: auto;
  }

  form.left {
    right: auto;
    left: 5vmin;
  }
}

@media screen and (max-aspect-ratio: 2/3) {
  form.middle {
    right: auto;
    left: auto;
  }
}

@media screen and (max-aspect-ratio: 3/2) and (min-aspect-ratio: 1/1) {
  form {
    position: fixed;
    gap: 5vmin;
    grid-template: 'north . east' auto
      'west . south' auto / min-content 1fr min-content;
    left: 1vmin;
    right: 1vmin;
    bottom: 5vmin;
  }
}

@media screen and (min-aspect-ratio: 2/3) and (max-aspect-ratio: 1/1) {
  form {
    position: fixed;
    grid-template: 'west . north . south . east' auto / min-content 1fr min-content 1fr min-content 1fr min-content;
    left: 5vmin;
    right: 5vmin;
    bottom: 5vmin;
  }
}
</style>
