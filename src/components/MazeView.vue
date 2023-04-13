<script setup lang="ts">
import { generate, orthogonal, nodesRectangle, type MazeNode } from '@/utils/maze'
import { Room } from '@/utils/room';
import type { MazeRenderMode } from '@/utils/render';
import MazeSvg from '@/components/MazeSvg.vue';
const props = withDefaults(defineProps<
  { width: number, height: number, renderMode: MazeRenderMode }>(), {
  width: 10, height: 10, renderMode: 'svg',
});
const rooms = Array.from(generate(
  nodesRectangle(props.width, props.height).map(node => new Room(node)),
  orthogonal<MazeNode>(
    (r) => r.x,
    (r) => r.y
  )
)).map(([room, neighbours]) => neighbours.reduce((room: Room, neighbour) => room.withNeighbour(neighbour), room));
rooms[rooms.length - 1].withExit('south', 'exit');
rooms[0].withExit('north', 'entrance');
</script>
<template>
  <MazeSvg v-if="renderMode === 'svg'" :maze="rooms" :width="width" :height="height" />
</template>
<style scoped>
</style>
