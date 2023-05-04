<script setup lang="ts">
import { choose, first, last } from '@/utils/choice';
import { defaultKeyboardControls } from '@/utils/control';
import { Subject, map, merge } from 'rxjs';
import { maze2d } from '@/utils/maze2d';
import { movement2d } from '@/utils/movement';
import { onUnmounted, ref } from 'vue';
import { Player2D } from '@/utils/player';
import { Player2DAnimation } from '@/utils/animation';
import MazeControls from '@/components/MazeControls.vue';
import MazeCanvasTilesBitmap from '@/components/MazeCanvasTilesBitmap.vue';
import MazeSvg from '@/components/MazeSvg.vue';
import type { Direction2D } from '@/utils/room';
import { useRouter } from 'vue-router';
import { getSettings, type MazeSettings } from '@/utils/settings';
const { random } = Math;
const dialog = ref(null as HTMLDialogElement | null)
const router = useRouter();
const props = withDefaults(defineProps<{ settings?: MazeSettings }>(), { settings: () => getSettings() });
const { rooms, start } = maze2d(props.settings!.width, props.settings!.height, choose, last, first)
const showDialog = () => dialog.value?.showModal()
const player = new Player2D(start)
const animatedPlayer = new Player2DAnimation(player)
player.exitReached.then(showDialog)
const guiMove = new Subject<Direction2D>();
const moveSubscription = merge(defaultKeyboardControls, guiMove)
  .pipe(map(direction => movement2d[props.settings!.movementMode](player, direction))).subscribe()
const reloadWindow = () => router
  // Add a random hash fragment. Because we've added `:key='$route.fullPath' to the <router-view> on App.vue
  // This will rerender the routed (the current) component.
  .replace(`#${random().toString(32).substring(2)}`)
  // Then quickly disappear the ugly hash fragment again.
  .then(() => history.replaceState(null, '', '/'))
onUnmounted(() => moveSubscription.unsubscribe)
</script>
<template>
  <main>
    <div class="maze">
      <MazeSvg v-if="settings.renderMode === 'svg'" :rooms="rooms" :player="animatedPlayer" />
      <MazeCanvasTilesBitmap v-if="settings.renderMode === 'tiles'" :rooms="rooms" :player="animatedPlayer" />
    </div>
    <router-link v-bind="$attrs" class='router-link' to="/settings">⚙</router-link>
    <MazeControls @move="direction => guiMove.next(direction)"></MazeControls>
    <dialog ref="dialog">
      <h2>You won!</h2>
      <form method="dialog">
        <button @click="reloadWindow">Play again</button>
      </form>
    </dialog>
  </main>
  <header>
    <h1>A Maze</h1>
  </header>
</template>
<style scoped>
h1 {
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
  font-size: 5vmin;
}

.maze {
  position: fixed;
  top: max(50px, 5vmin);
  left: 0;
  right: 0;
  margin: auto;
  width: calc(95vmin);
  height: calc(95vmin);
}

dialog {
  min-width: 50vw;
  min-height: 50vh;
}

dialog>h2 {
  font-size: 10vmin;
  width: 100%;
  text-align: center;
}

dialog>form {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1em;
  margin: 0 auto;
  width: max-content;
}

dialog button {
  font-size: 5vmin;
}
</style>
