<script setup lang="ts">
import type { Room2D } from '@/utils/room';
import { onMounted, ref } from 'vue';
const svg = ref(null as SVGElement | null)
const props = withDefaults(defineProps<{
  scale?: number,
  maze: Room2D[],
}>(), { scale: 120 });
onMounted(() => {
  svg.value!.style.width = `${props.scale * (Math.max(...props.maze.map(r => r.x)) + 1)}px`
  svg.value!.style.height = `${props.scale * (Math.max(...props.maze.map(r => r.y)) + 1)}px`
})
</script>
<template>
  <svg ref="svg" shape-rendering="crispEdges">
    <g v-for="room, index in maze" :transform="'translate(' + room.x * scale + ',' + room.y * scale + ')'" :key="index">
      <rect class="wall" :width="scale" :height="scale" />
      <rect class="floor" :x="scale / 4" :y="scale / 4" :width="scale / 2" :height="scale / 2" />
      <rect class="floor" v-if="room.north" :x="scale / 4" :y="-1" :width="scale / 2" :height="scale / 4 + 2" />
      <rect class="floor" v-if="room.east" :x="scale / 4 * 3 - 1" :y="scale / 4" :width="scale / 4 + 2"
        :height="scale / 2" />
      <rect class="floor" v-if="room.south" :x="scale / 4" :y="scale / 4 * 3 - 1" :width="scale / 2"
        :height="scale / 4 + 2" />
      <rect class="floor" v-if="room.west" :x="-1" :y="scale / 4" :width="scale / 4 + 2" :height="scale / 2" />
    </g>
  </svg>
</template>
<style>
.wall {
  fill: green;
}

.floor {
  fill: sandybrown;
}
</style>
