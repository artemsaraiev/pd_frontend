<template>
  <header class="topbar">
    <div class="brand" @click="goHome">PubDiscuss</div>
    <div class="search">
      <input v-model.trim="q" placeholder="Search papers or authors" @keyup.enter="emitSearch" />
      <button class="primary" @click="emitSearch">Search</button>
    </div>
    <div class="right">
      <button class="ghost">+ New Thread</button>
      <div class="status" :class="{ ok: backendOk, bad: !backendOk }">{{ backendOk ? 'Connected' : 'Offline' }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ backendOk: boolean }>();
const emit = defineEmits<{ (e: 'search', q: string): void }>();
const q = ref('');

function emitSearch() { emit('search', q.value); }
function goHome() { window.location.assign('/'); }
</script>

<style scoped>
.topbar { position: sticky; top: 0; z-index: 50; display: grid; grid-template-columns: 200px 1fr auto; gap: 12px; align-items: center; padding: 10px 16px; border-bottom: 1px solid var(--border); background: #fff; }
.brand { color: var(--brand); font-weight: 700; font-family: var(--font-serif); cursor: pointer; }
.search { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
input { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; }
.right { display: flex; gap: 8px; align-items: center; }
.status { font-size: 12px; padding: 4px 8px; border-radius: 999px; background: #f4f4f5; color: #444; }
.status.ok { background: #e7f7ee; color: var(--ok); }
.status.bad { background: #fde8e8; color: var(--error); }
.primary { background: var(--brand); color: #fff; border: 1px solid var(--brand); border-radius: 6px; padding: 6px 10px; }
.ghost { background: #fff; color: var(--brand); border: 1px solid var(--brand); border-radius: 6px; padding: 6px 10px; }
@media (max-width: 780px) {
  .topbar { grid-template-columns: 1fr auto; }
  .brand { display: none; }
}
</style>


