<script setup lang="ts">
import type { MazeRenderMode } from '@/utils/render';
import MazeSvg from '@/components/MazeSvg.vue';
import MazeCanvasTilesBitmap from '@/components/MazeCanvasTilesBitmap.vue';
import { onUnmounted, reactive, ref, type Ref } from 'vue';
import { maze2d } from '@/utils/maze2d';
import { choose, first, last } from '@/utils/choice';
import { Player2D } from '@/utils/player';
import { movement } from '@/utils/control'

const props = withDefaults(defineProps<
  { width: number, height: number, renderMode?: MazeRenderMode }>(), {
  renderMode: 'svg',
});
const { rooms, start } = maze2d(props.width, props.height, choose, last, first)
let renderMode: Ref<MazeRenderMode> = ref(props.renderMode)
const player = reactive(new Player2D(start))
const updateRenderMode = (ev: { target: HTMLSelectElement & { value: MazeRenderMode } }) => renderMode.value = ev.target.value
const moveSubscription = movement(player).subscribe()
onUnmounted(moveSubscription.unsubscribe)
</script>
<template>
  <select name="renderMode" :value="renderMode" @change="updateRenderMode">
    <option value="svg">SVG</option>
    <option value="tiles">Canvas bitmap tiles</option>
  </select>
  <MazeSvg v-if="renderMode === 'svg'" :rooms="rooms" :player="player" />
  <MazeCanvasTilesBitmap v-if="renderMode === 'tiles'" :rooms="rooms" :player="player" />
</template>
<style scoped>
</style>
