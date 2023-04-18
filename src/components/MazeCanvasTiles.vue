<script setup lang="ts">
import type { Room2D } from '@/utils/room';
import { getBitmapTileSet } from '@/utils/tile';
import { tap } from 'rxjs';
import { ref, onMounted } from 'vue';

const canvas = ref(null as HTMLCanvasElement | null);

const props = withDefaults(defineProps<{
  tilesUri?: string,
  maze: Room2D[],
}>(), { tilesUri: 'tilesets/test/test.png' });

onMounted(() => getBitmapTileSet(props.tilesUri).pipe(
  tap(({ size, ...tiles }) => {
    canvas.value!.width = size * (Math.max(...props.maze.map(r => r.x)) + 1)
    canvas.value!.height = size * (Math.max(...props.maze.map(r => r.y)) + 1)
    const ctx2d = canvas.value!.getContext('2d');
    for (const room of props.maze) {
      ctx2d?.drawImage(tiles[room.tileType], room.x * size, room.y * size);
    }
  })
).subscribe())

</script>
<template>
  <canvas ref="canvas"></canvas>
</template>
<style>
</style>
