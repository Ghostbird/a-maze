<script setup lang="ts">
import MazeGame from '@/components/MazeGame.vue'
import type { MovementType } from '@/utils/movement';
import type { MazeRenderMode } from '@/utils/render';
import { reactive, ref } from 'vue';
const dialog = ref(null as HTMLDialogElement | null)
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
    <MazeGame :width="10" :height="10" :options="options" @exit="showDialog" />
    <dialog ref="dialog">
      <h2>You won!</h2>
      <form method="dialog">
        <button @click="reloadWindow">Play again</button>
      </form>
    </dialog>
  </main>
</template>
<style scoped>
.options {
  display: grid;
  grid-template:
    'a b'
    'c d' auto / min-content 1fr;
  gap: 0.1em 1em;
  margin-bottom: 1em;
}

.options>span {
  white-space: nowrap;
}
</style>
