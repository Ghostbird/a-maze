<script lang="ts">
import { generate, orthogonal, nodesRectangle, type MazeNode } from '@/utils/maze'
import { Room } from '@/utils/room';
export default {
  props: {
    width: Number,
    height: Number
  },
  data() {
    const rooms = Array.from(generate(
      nodesRectangle(10, 10).map(node => new Room(node)),
      orthogonal<MazeNode>(
        (r) => r.x,
        (r) => r.y
      )
    ))
      .map(([room, neighbours]) => neighbours.reduce((room: Room, neighbour) => room.withNeighbour(neighbour), room))
    rooms[rooms.length - 1].withExit('south', 'exit')
    rooms[0].withExit('north', 'entrance')
    return {
      scale: 50,
      maze: rooms,
    }
  }
}
</script>
<template>
  <svg :width="scale * width!" :height="scale * height!" shape-rendering="crispEdges">
    <g v-for="room in maze" :transform="'translate(' + room.x * scale + ',' + room.y * scale + ')'"
      :key="room.x + room.y * width!">
      <rect fill="black" :width="scale" :height="scale" />
      <rect fill="white" :x="scale / 4" :y="scale / 4" :width="scale / 2" :height="scale / 2" />
      <rect fill="white" v-if="room.north" :x="scale / 4" :y="-1" :width="scale / 2" :height="scale / 4 + 2" />
      <rect fill="white" v-if="room.east" :x="scale / 4 * 3 - 1" :y="scale / 4" :width="scale / 4 + 2"
        :height="scale / 2" />
      <rect fill="white" v-if="room.south" :x="scale / 4" :y="scale / 4 * 3 - 1" :width="scale / 2"
        :height="scale / 4 + 2" />
      <rect fill="white" v-if="room.west" :x="-1" :y="scale / 4" :width="scale / 4 + 2" :height="scale / 2" />
    </g>
  </svg>
</template>
<style scoped>
</style>
