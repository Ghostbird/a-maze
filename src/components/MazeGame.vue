<script setup lang="ts">
import { choose, first, last } from '@/utils/choice';
import { defaultKeyboardControls } from '@/utils/control';
import { Observable, map, merge } from 'rxjs';
import { maze2d } from '@/utils/maze2d';
import { movement2d, type MovementType } from '@/utils/movement';
import { onUnmounted } from 'vue';
import { Player2D } from '@/utils/player';
import { Player2DAnimation } from '@/utils/animation';
import MazeCanvasTilesBitmap from '@/components/MazeCanvasTilesBitmap.vue';
import MazeSvg from '@/components/MazeSvg.vue';
import type { MazeRenderMode } from '@/utils/render';
import type { Direction2D } from '@/utils/room';
const emit = defineEmits<{ (ev: 'exit'): void }>()
const props = defineProps<
  {
    width: number,
    height: number,
    options: {
      renderMode: MazeRenderMode,
      movementMode: MovementType,
    },
    guiMove: Observable<Direction2D>
  }>();
const { rooms, start } = maze2d(props.width, props.height, choose, last, first)
const player = new Player2D(start)
const animatedPlayer = new Player2DAnimation(player)
player.exitReached.then(() => emit('exit'))
const moveSubscription = merge(defaultKeyboardControls, props.guiMove)
  .pipe(map(direction => movement2d[props.options.movementMode](player, direction))).subscribe()
onUnmounted(moveSubscription.unsubscribe)
</script>
<template>
  <div>
    <MazeSvg v-if="options.renderMode === 'svg'" :rooms="rooms" :player="animatedPlayer" />
    <MazeCanvasTilesBitmap v-if="options.renderMode === 'tiles'" :rooms="rooms" :player="animatedPlayer" />
  </div>
</template>
<style scoped>
div {
  width: calc(100vw - 2em);
  height: calc(100vh - 200px);
  position: initial;
}
</style>
