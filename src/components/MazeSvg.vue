<script setup lang="ts">
import type { Room } from '@/utils/room';
const props = withDefaults(defineProps<{
  width: number,
  height: number,
  scale: number,
  maze: Room[],
}>(), { scale: 50 });
</script>
<template>
  <svg :width="scale * width" :height="scale * height" shape-rendering="crispEdges">
    <g v-for="room in maze" :transform="'translate(' + room.x * scale + ',' + room.y * scale + ')'"
      :key="room.x + room.y * width">
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
