<script setup lang="ts">
import type { MazeRenderMode } from '@/utils/render';
import MazeSvg from '@/components/MazeSvg.vue';
import MazeCanvasTilesBitmap from '@/components/MazeCanvasTilesBitmap.vue';
import { onUnmounted } from 'vue';
import { maze2d } from '@/utils/maze2d';
import { choose, first, last } from '@/utils/choice';
import { Player2D } from '@/utils/player';
import { movement2d, type MovementType } from '@/utils/movement';
import { defaultKeyboardControls } from '@/utils/control';
import { map } from 'rxjs';
import { Player2DAnimation } from '@/utils/animation';
const emit = defineEmits<{ (ev: 'exit'): void }>()
const props = defineProps<
  {
    width: number, height: number, options: {
      renderMode: MazeRenderMode,
      movementMode: MovementType
    }
  }>();
const { rooms, start } = maze2d(props.width, props.height, choose, last, first)
const player = new Player2D(start)
const animatedPlayer = new Player2DAnimation(player)
player.exitReached.then(() => emit('exit'))
const moveSubscription = defaultKeyboardControls.pipe(map(direction => movement2d[props.options.movementMode](player, direction))).subscribe()
onUnmounted(moveSubscription.unsubscribe)
</script>
<template>
  <MazeSvg v-if="options.renderMode === 'svg'" :rooms="rooms" :player="animatedPlayer" />
  <MazeCanvasTilesBitmap v-if="options.renderMode === 'tiles'" :rooms="rooms" :player="animatedPlayer" />
</template>
<style scoped>
</style>
