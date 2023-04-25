<script setup lang="ts">
import MazeGame from '@/components/MazeGame.vue'
import { ref } from 'vue';
const dialog = ref(null as HTMLDialogElement | null)
const showDialog = () => dialog.value?.showModal()
const reloadWindow = () => window.location.reload()
</script>
<template>
  <header>
    <h1>A Maze</h1>
  </header>
  <main>
    <MazeGame :width="10" :height="10" @exit="showDialog" />
    <dialog ref="dialog">
      <h2>You won!</h2>
      <form method="dialog">
        <button @click="reloadWindow">Play again</button>
      </form>
    </dialog>
  </main>
</template>
<style scoped>
</style>
