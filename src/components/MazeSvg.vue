<script setup lang="ts">
import type { Player2DAnimation } from '@/utils/animation';
import type { Room2D } from '@/utils/room';
import { onMounted, ref } from 'vue';
const svg = ref(null as SVGElement | null)
const playerIcon = ref(null as SVGRectElement | null)
const props = withDefaults(defineProps<{
  scale?: number,
  rooms: Room2D[],
  player: Player2DAnimation,
}>(), { scale: 120 });
onMounted(() => {
  svg.value!.setAttribute('viewBox', `0 0 ${props.scale * (Math.max(...props.rooms.map(room => room.x)) + 1)} ${props.scale * (Math.max(...props.rooms.map(room => room.y)) + 1)}`)
  window.requestAnimationFrame(draw);
})
function draw(time: DOMHighResTimeStamp) {
  // Update player animation
  props.player.update(time)
  playerIcon.value?.setAttribute('transform', `translate(${props.player.x * props.scale},${props.player.y * props.scale})`);
  window.requestAnimationFrame(draw);
}

</script>
<template>
  <svg ref="svg" shape-rendering="crispEdges">
    <g v-for="room, index in rooms" :transform="`translate(${room.x * scale - 1},${room.y * scale + 2})`" :key="index">
      <rect class="wall" :width="scale + 2" :height="scale + 2" />
      <!-- Note all the stupid -1 and +2 are to avoid render artifacts between the tiles.-->
      <rect class="floor" :x="scale / 4" :y="scale / 4" :width="scale / 2" :height="scale / 2" />
      <rect class="floor" v-if="room.north" :x="scale / 4" :y="-1" :width="scale / 2" :height="scale / 4 + 2" />
      <rect class="floor" v-if="room.east" :x="scale / 4 * 3 - 1" :y="scale / 4" :width="scale / 4 + 2"
        :height="scale / 2" />
      <rect class="floor" v-if="room.south" :x="scale / 4" :y="scale / 4 * 3 - 1" :width="scale / 2"
        :height="scale / 4 + 2" />
      <rect class="floor" v-if="room.west" :x="-1" :y="scale / 4" :width="scale / 4 + 2" :height="scale / 2" />
    </g>
    <rect ref="playerIcon" class="player" :width="scale / 4" :height="scale / 4" :x="3 / 8 * scale" :y="3 / 8 * scale" />
  </svg>
</template>
<style scoped>
.wall {
  fill: green;
}

.floor {
  fill: sandybrown;
}

.player {
  fill: purple;
}

svg {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
