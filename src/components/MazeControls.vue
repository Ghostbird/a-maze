<script setup lang="ts">
import type { Direction2D } from '@/utils/room';

const emit = defineEmits<{ (ev: 'move', direction: Direction2D): void }>()
</script>
<template>
  <form>
    <button type="button" name="north" @click="$emit('move', 'north')" style="grid-area:north">⇧</button>
    <button type="button" name="south" @click="$emit('move', 'south')" style="grid-area:south">⇩</button>
    <button type="button" name="west" @click="$emit('move', 'west')" style="grid-area:west">⇦</button>
    <button type="button" name="east" @click="$emit('move', 'east')" style="grid-area:east">⇨</button>
  </form>
</template>
<style scoped>
form {
  display: grid;
  grid-template:
    '.    north .   '
    'west .     east'
    '.    south .   ' auto / min-content min-content min-content;
  width: auto;
}

button {
  max-width: 10vmin;
  max-height: 10vmin;
  width: 3em;
  height: 3em;
}

@media screen and (max-width: 480px) {
  form {
    max-width: 25vw;
  }
}
</style>
