<script setup lang="ts">
import MazeGame from '@/components/MazeGame.vue'
import MazeControls from '@/components/MazeControls.vue'
import type { MovementType } from '@/utils/movement';
import type { MazeRenderMode } from '@/utils/render';
import { reactive, ref } from 'vue';
import type { Direction2D } from '@/utils/room';
import { Subject } from 'rxjs';
const dialog = ref(null as HTMLDialogElement | null)
const guiMove = new Subject<Direction2D>();
const options = reactive({
  renderMode: localStorage.getItem('renderMode') ?? 'svg',
  movementMode: localStorage.getItem('movementMode') as MovementType ?? 'step'
})
function updateRenderMode(ev: { target: HTMLSelectElement & { value: MazeRenderMode } }) {
  options.renderMode = ev.target.value
  localStorage.setItem('renderMode', ev.target.value)
}
function updateMovement(ev: { target: HTMLSelectElement & { value: MovementType } }) {
  options.movementMode = ev.target.value;
  localStorage.setItem('movementMode', ev.target.value)
}
const showDialog = () => dialog.value?.showModal()
const reloadWindow = () => window.location.reload()
</script>
<template>
  <header>
    <h1>A Maze</h1>
  </header>
  <main>
    <form class="options">
      <span style="grid-area: a">Render mode:</span>
      <select style="grid-area: b" name="renderMode" :value="options.renderMode" @change="updateRenderMode">
        <option value="svg">SVG</option>
        <option value="tiles">Canvas bitmap tiles</option>
      </select>
      <span style="grid-area: c">Movement mode:</span>
      <select style="grid-area: d" name="movementMode" :value="options.movementMode" @change="updateMovement">
        <option value="step">Step</option>
        <option value="choice">Decision</option>
      </select>
    </form>
    <div style="grid-area:controls">
      <MazeControls @move="direction => guiMove.next(direction)"></MazeControls>
    </div>
    <div style="grid-area:game">
      <MazeGame :width="10" :height="10" :options="options" :guiMove="guiMove" @exit="showDialog" />
    </div>
    <dialog ref="dialog">
      <h2>You won!</h2>
      <form method="dialog">
        <button @click="reloadWindow">Play again</button>
      </form>
    </dialog>
  </main>
</template>
<style scoped>
main {
  display: grid;
  gap: 1em;
  grid-template:
    'game game game' min-content
    'options . controls' min-content / max-content auto min-content;
}

dialog {
  min-width: 50vw;
  min-height: 50vh;
}

dialog > h2 {
  font-size: 10vmin;
  width: 100%;
  text-align: center;
}

dialog > form {
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

.options {
  grid-area: options;
  display: grid;
  grid-template:
    'a b' min-content
    'c d' min-content / min-content 1fr;
  gap: 0.1em 1em;
}

.options>* {
  max-width: 50vw;
}


.options>span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 480px) {
  main {
    grid-template:
      'game game' min-content
      'options controls' min-content / min-content min-content;
  }

  .options {
    grid-template:
      'a' min-content
      'b' min-content
      'c' min-content
      'd' min-content / min-content;
  }
}
</style>
