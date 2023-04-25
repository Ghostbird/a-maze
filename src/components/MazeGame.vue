<script setup lang="ts">
import type { MazeRenderMode } from '@/utils/render';
import MazeSvg from '@/components/MazeSvg.vue';
import MazeCanvasTilesBitmap from '@/components/MazeCanvasTilesBitmap.vue';
import { onUnmounted, reactive, ref, type Ref } from 'vue';
import { maze2d } from '@/utils/maze2d';
import { choose, first, last } from '@/utils/choice';
import { Player2D } from '@/utils/player';
import { movement, type MovementType2D } from '@/utils/movement';
import { stepMovement } from '@/utils/movement';
import { defaultKeyboardControls } from '@/utils/control';
import { map } from 'rxjs';
const emit = defineEmits<{ (ev: 'exit'): void }>()
const props = withDefaults(defineProps<
  { width: number, height: number, renderMode?: MazeRenderMode }>(), {
  renderMode: 'svg',
});
const { rooms, start } = maze2d(props.width, props.height, choose, last, first)
let renderMode: Ref<MazeRenderMode> = ref(props.renderMode)
let movementMode = reactive(stepMovement)
const player = reactive(new Player2D(start))
player.exitReached.then(() => emit('exit'))
const moveSubscription = defaultKeyboardControls.pipe(map(direction => movementMode(player, direction))).subscribe()
onUnmounted(moveSubscription.unsubscribe)
const updateRenderMode = (ev: { target: HTMLSelectElement & { value: MazeRenderMode } }) => renderMode.value = ev.target.value
const updateMovement = (ev: { target: HTMLSelectElement & { value: MovementType2D } }) => movementMode = movement[ev.target.value]
</script>
<template>
  <select name="renderMode" :value="renderMode" @change="updateRenderMode">
    <option value="svg">SVG</option>
    <option value="tiles">Canvas bitmap tiles</option>
  </select>
  <select name="movementMode" value="step" @change="updateMovement">
    <option value="step">Step</option>
    <option value="choice">Decision</option>
  </select>
  <MazeSvg v-if="renderMode === 'svg'" :rooms="rooms" :player="player" />
  <MazeCanvasTilesBitmap v-if="renderMode === 'tiles'" :rooms="rooms" :player="player" />
</template>
<style scoped>
</style>
