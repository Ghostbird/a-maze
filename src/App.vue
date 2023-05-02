<script setup lang="ts">
import MazeGame from '@/components/MazeGame.vue'
import MazeControls from '@/components/MazeControls.vue'
import type { MovementType } from '@/utils/movement';
import type { MazeRenderMode } from '@/utils/render';
import { reactive, ref } from 'vue';
import type { Direction2D } from '@/utils/room';
import { BehaviorSubject, Subject, debounce, debounceTime, skip } from 'rxjs';
const dialog = ref(null as HTMLDialogElement | null)
const guiMove = new Subject<Direction2D>();
const mazeSize = new BehaviorSubject<number>(parseInt(localStorage.getItem('mazeSize') ?? '10'))
const options = reactive({
  renderMode: localStorage.getItem('renderMode') ?? 'svg',
  movementMode: localStorage.getItem('movementMode') as MovementType ?? 'step',
})
function updateRenderMode(ev: { target: HTMLSelectElement & { value: MazeRenderMode } }) {
  options.renderMode = ev.target.value
  localStorage.setItem('renderMode', ev.target.value)
}
function updateMovement(ev: { target: HTMLSelectElement & { value: MovementType } }) {
  options.movementMode = ev.target.value;
  localStorage.setItem('movementMode', ev.target.value)
}
function updateSize(ev: { target: HTMLInputElement & { value: number } }) {
  localStorage.setItem('mazeSize', ev.target.value)
  mazeSize.next(ev.target.value)
}
const showDialog = () => dialog.value?.showModal()
const reloadWindow = () => window.location.reload()
mazeSize.pipe(skip(1), debounceTime(500)).subscribe(() => window.location.reload())
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
      <span style="grid-area: e">Maze size</span>
      <input style="grid-area: f" type="number" step="1" min="1" :value="mazeSize.value" @change="updateSize" />
    </form>
    <div style="grid-area:controls">
      <MazeControls @move="direction => guiMove.next(direction)"></MazeControls>
    </div>
    <div style="grid-area:game">
      <MazeGame :width="mazeSize.value" :height="mazeSize.value" :options="options" :guiMove="guiMove" @exit="showDialog" />
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

.options {
  grid-area: options;
  display: grid;
  grid-template:
    'a b' min-content
    'c d' min-content
    'e f' min-content / min-content 1fr;
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
      'a a' min-content
      'b b' min-content
      'c c' min-content
      'd d' min-content
      'e f' min-content / minmax(0, 25vw) minmax(0, 25vw);
  }

  .options input {
    max-width: 25vw;
  }
}
</style>
