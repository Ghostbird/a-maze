<script setup lang="ts">
import type { MazeRenderMode } from '@/utils/render';
import MazeSvg from '@/components/MazeSvg.vue';
import MazeCanvasTiles from '@/components/MazeCanvasTiles.vue';
import { onMounted, reactive } from 'vue';
import { maze2d } from '@/utils/maze2d';
const props = withDefaults(defineProps<
  { width: number, height: number, renderMode?: MazeRenderMode }>(), {
  renderMode: 'svg',
});
const state = reactive<{ renderMode: MazeRenderMode }>({ renderMode: 'svg' })
function updateRenderMode(ev: { target: HTMLSelectElement & { value: MazeRenderMode } }) { state.renderMode = ev.target.value }
const maze = maze2d(props.width, props.height)
onMounted(() => state.renderMode = props.renderMode)
</script>
<template>
  <select name="renderMode" :value="state.renderMode" @change="updateRenderMode">
    <option value="svg">SVG</option>
    <option value="tiles">Canvas bitmap tiles</option>
  </select>
  <MazeSvg v-if="state.renderMode === 'svg'" :maze="maze" />
  <MazeCanvasTiles v-if="state.renderMode === 'tiles'" :maze="maze" />
</template>
<style scoped>
</style>
