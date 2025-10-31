<template>
  <div class="paper">
    <header class="card header">
      <div class="title-row">
        <h2 class="title">{{ header.title || id }}</h2>
        <div class="actions">
          <a class="ghost" :href="pdfLink" target="_blank" rel="noreferrer">Open PDF</a>
          <button class="primary" @click="scrollToAnchors">Add Anchor</button>
          <button class="ghost" @click="saveToLibrary">Add to library</button>
          <a class="ghost" href="/">Back to Feed</a>
        </div>
      </div>
      <div class="meta">
        <span v-if="header.doi"><a :href="header.link" target="_blank" rel="noreferrer">{{ header.doi }}</a></span>
        <span v-if="header.authors"> · {{ header.authors }}</span>
      </div>
      <p v-if="banner" class="banner">{{ banner }} <button class="primary inline" @click="ensurePaper">Ensure</button></p>
    </header>

    <div class="columns">
      <section class="center">
        <DiscussionPanel :paperId="id" :anchorFilterProp="anchorFilter" />
      </section>
      <aside class="right card" ref="anchorsBox">
        <h3>Anchors</h3>
        <AnchorsPanel :paperId="id" @filter-by-anchor="anchorFilter = $event" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import DiscussionPanel from '@/components/DiscussionPanel.vue';
import AnchorsPanel from '@/components/AnchorsPanel.vue';
import { paper } from '@/api/endpoints';

const props = defineProps<{ id: string }>();
const anchorFilter = ref<string | null>(null);
const header = reactive<{ title?: string; doi?: string; link?: string; authors?: string }>({});
const anchorsBox = ref<HTMLElement | null>(null);
const banner = ref('');

const pdfLink = `https://arxiv.org/pdf/${encodeURIComponent(props.id)}.pdf`;

onMounted(async () => {
  try {
    const { id, title } = await paper.get({ id: props.id });
    header.title = title;
    header.doi = id;
    header.link = `https://arxiv.org/abs/${encodeURIComponent(id)}`;
    if (!title) {
      banner.value = 'This paper is not yet in your index.';
    }
  } catch {}
});

function scrollToAnchors() {
  anchorsBox.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const id = props.id;

function saveToLibrary() {
  const key = 'libraryPaperIds';
  const ids: string[] = JSON.parse(localStorage.getItem(key) || '[]');
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(key, JSON.stringify(ids));
  }
}

async function ensurePaper() {
  try {
    await paper.ensure({ id });
    const { title } = await paper.get({ id });
    header.title = title;
    banner.value = '';
  } catch (e: any) {
    banner.value = String(e?.message ?? 'Failed to ensure paper');
  }
}
</script>

<style scoped>
.paper { display: grid; gap: 12px; }
.header .title { font-family: var(--font-serif); }
.title-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.actions { display: flex; gap: 8px; }
.inline { padding: 2px 8px; }
.columns { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.center { display: block; }
.card { border: 1px solid var(--border); border-radius: 8px; background: #fff; padding: 12px 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.primary { background: var(--brand); color: #fff; border: 1px solid var(--brand); border-radius: 6px; padding: 6px 10px; text-decoration: none; }
.ghost { background: #fff; color: var(--brand); border: 1px solid var(--brand); border-radius: 6px; padding: 6px 10px; text-decoration: none; }
.banner { margin-top: 8px; color: var(--error); }
@media (max-width: 1100px) {
  .columns { grid-template-columns: 1fr; }
}
</style>


