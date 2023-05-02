<script setup lang="ts">
import type { Player2DAnimation } from '@/utils/animation';
import type { Room2D } from '@/utils/room';
import type { TileSet2D } from '@/utils/tile';
import { getBitmapTileSet } from '@/utils/tile';
import { tap, type Subscription } from 'rxjs';
import { ref, onMounted, onUnmounted } from 'vue';
const mazeCanvas = ref<HTMLCanvasElement>();
const playerCanvas = ref<HTMLCanvasElement>();
const tileSet = ref<TileSet2D>()
let tileSetSubscription: Subscription;

const props = withDefaults(defineProps<{
  tilesUri?: string,
  rooms: Room2D[],
  player: Player2DAnimation,
}>(), { tilesUri: 'tilesets/test/test.png' });

const drawMaze = () => {
  // Abort if tile-set is not loaded or canvas was not rendered
  if (!tileSet.value || !mazeCanvas.value) { return };
  if (!tileSet.value) { return };
  const { size, ...tiles } = tileSet.value;
  const ctx2d = mazeCanvas.value.getContext('2d');
  // Erase canvas
  ctx2d?.clearRect(0, 0, mazeCanvas.value.width, mazeCanvas.value.height)
  // Draw maze
  for (const room of props.rooms) {
    ctx2d?.drawImage(tiles[room.tileType], room.x * size, room.y * size);
  }
}

const drawPlayer = (time: DOMHighResTimeStamp) => {
  // Abort if tile-set is not loaded or canvas was not rendered
  if (!tileSet.value || !playerCanvas.value) { return };
  const { size, ...tiles } = tileSet.value;
  // Update player animation
  props.player.update(time)
  const ctx2d = playerCanvas.value.getContext('2d');
  // Erase canvas
  ctx2d?.clearRect(0, 0, playerCanvas.value.width, playerCanvas.value.height)
  // Draw player
  ctx2d?.drawImage(tiles[props.player.direction], props.player.x * size, props.player.y * size)
  window.requestAnimationFrame(drawPlayer);
}

onMounted(() => tileSetSubscription = getBitmapTileSet(props.tilesUri).pipe(
  tap(({ size }) => {
    // Update canvas size on tile-set load
    mazeCanvas.value!.width = playerCanvas.value!.width = size * (Math.max(...props.rooms.map(room => room.x)) + 1)
    mazeCanvas.value!.height = playerCanvas.value!.height = size * (Math.max(...props.rooms.map(room => room.y)) + 1)
  }))
  .subscribe(loadedTileSet => {
    tileSet.value = loadedTileSet
    // Draw the maze once
    drawMaze();
    // Start the player animation loop once
    window.requestAnimationFrame(drawPlayer);
  })
)

onUnmounted(() => {
  // Unload tile set, stop animation.
  tileSet.value = undefined;
  tileSetSubscription.unsubscribe();
})

</script>
<template>
  <canvas ref="mazeCanvas"></canvas>
  <canvas ref="playerCanvas"></canvas>
</template>
<style scoped>
canvas {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
