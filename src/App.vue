<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">PubDiscuss</div>
      <div class="status" :class="{ ok: backendOk, bad: !backendOk }">
        Backend: {{ backendOk ? 'Connected' : 'Error' }}
      </div>
    </header>
    <main class="columns">
      <section class="left">
        <h2>Paper & Anchors</h2>
        <PaperPanel @paper-changed="onPaperChanged" />
        <hr />
        <AnchorsPanel :paperId="currentPaperId" />
        <AnchorsList :paperId="currentPaperId" @filter-by-anchor="anchorFilter = $event" />
        <button class="reset" @click="resetDemo">Reset demo</button>
      </section>
      <section class="right">
        <h2>Discussion</h2>
        <DiscussionPanel :paperId="currentPaperId" />
        <ThreadsList :paperId="currentPaperId" />
        <hr />
        <IdentityPanel />
      </section>
    </main>
  </div>
  </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { post } from './api/client';
import PaperPanel from '@/components/PaperPanel.vue';
import AnchorsPanel from '@/components/AnchorsPanel.vue';
import DiscussionPanel from '@/components/DiscussionPanel.vue';
import IdentityPanel from '@/components/IdentityPanel.vue';
import AnchorsList from '@/components/AnchorsList.vue';
import ThreadsList from '@/components/ThreadsList.vue';

const backendOk = ref(true);
const currentPaperId = ref<string | null>(null);
const anchorFilter = ref<string | null>(null);

onMounted(async () => {
  try {
    // Attempt a harmless request; expect 404 or CORS to help determine connectivity.
    await post('/__ping__', {});
    backendOk.value = true;
  } catch {
    try {
      await fetch('http://localhost:8000/api', { method: 'OPTIONS' });
      backendOk.value = true;
    } catch {
      backendOk.value = false;
    }
  }
});

function onPaperChanged(id: string) {
  currentPaperId.value = id;
}

function resetDemo() {
  // Clear current paper and remount children by toggling a key
  currentPaperId.value = null;
}
 </script>

<style scoped>
.app { display: flex; flex-direction: column; height: 100vh; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid #eee; }
.brand { font-weight: 600; }
.status { font-size: 12px; padding: 4px 8px; border-radius: 999px; background: #f4f4f5; color: #444; }
.status.ok { background: #e7f7ee; color: #11683a; }
.status.bad { background: #fde8e8; color: #9b1c1c; }
.columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; flex: 1; overflow: auto; }
.left, .right { border: 1px solid #eee; border-radius: 8px; padding: 12px; background: #fff; }
.reset { margin-top: 12px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; background: #f8fafc; }
</style>


