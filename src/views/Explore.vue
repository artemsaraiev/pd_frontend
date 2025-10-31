<template>
  <div class="page">
    <h2>Explore</h2>
    <div class="toolbar">
      <input v-model.trim="q" placeholder="Filter by title or id" />
    </div>
    <div class="cards">
      <div v-for="p in filtered" :key="p.id" class="card">
        <h3 class="title"><a :href="`/paper/${encodeURIComponent(p.id)}`">{{ p.title || p.id }}</a></h3>
      </div>
      <p v-if="!filtered.length" class="hint">No matching papers.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { paper } from '@/api/endpoints';

const q = ref('');
const list = ref<Array<{ id: string; title?: string }>>([]);

onMounted(async () => {
  const { papers } = await paper.listRecent({ limit: 50 });
  list.value = papers;
});

const filtered = computed(() =>
  list.value.filter(p => (p.title || p.id).toLowerCase().includes(q.value.toLowerCase()))
);
</script>

<style scoped>
.toolbar { display: grid; grid-template-columns: 1fr; margin-bottom: 8px; }
input { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; }
.cards { display: grid; gap: 12px; }
.card { border: 1px solid var(--border); border-radius: 8px; background: #fff; padding: 12px 16px; }
.title { font-family: var(--font-serif); }
</style>


