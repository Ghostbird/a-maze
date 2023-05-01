<script setup lang="ts">
import type { Player2DAnimation } from '@/utils/animation';
import type { Room2D } from '@/utils/room';
import type { TileSet2D } from '@/utils/tile';
import { getBitmapTileSet } from '@/utils/tile';
import { tap, type Subscription } from 'rxjs';
import { ref, onMounted, onUnmounted } from 'vue';
const canvas = ref<HTMLCanvasElement>();
const tileSet = ref<TileSet2D>()
let tileSetSubscription: Subscription;

const props = withDefaults(defineProps<{
  tilesUri?: string,
  rooms: Room2D[],
  player: Player2DAnimation,
}>(), { tilesUri: 'tilesets/test/test.png' });

onMounted(() => tileSetSubscription = getBitmapTileSet(props.tilesUri).pipe(
  tap(({ size }) => {
    // Update canvas size on tile-set load
    canvas.value!.width = size * (Math.max(...props.rooms.map(room => room.x)) + 1)
    canvas.value!.height = size * (Math.max(...props.rooms.map(room => room.y)) + 1)
  }))
  .subscribe(loadedTileSet => {
    tileSet.value = loadedTileSet
    // We know this only happens once, so this is safe.
    window.requestAnimationFrame(draw);
  })
)

onUnmounted(() => {
  // Unload tile set, stop animation.
  tileSet.value = undefined;
  tileSetSubscription.unsubscribe();
})

function draw(time: DOMHighResTimeStamp) {
  // Don't draw until tile-set is loaded.
  if (!tileSet.value) { return };
  const { size, ...tiles } = tileSet.value;
  const ctx2d = canvas.value!.getContext('2d');
  // Update player animation
  props.player.update(time)
  for (const room of props.rooms) {
    ctx2d?.drawImage(tiles[room.tileType], room.x * size, room.y * size);
  }
  ctx2d?.drawImage(tiles[props.player.direction], props.player.x * size, props.player.y * size)
  window.requestAnimationFrame(draw);
}

</script>
<template>
  <canvas ref="canvas"></canvas>
</template>
<style>
</style>
