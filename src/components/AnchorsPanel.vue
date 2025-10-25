<template>
  <div class="panel">
    <h3>Anchors</h3>
    <p class="hint" v-if="!paperId">Set a current paper first.</p>
    <div class="row">
      <label>Kind</label>
      <select v-model="kind">
        <option>Section</option>
        <option>Figure</option>
        <option>Lines</option>
      </select>
    </div>
    <div class="row">
      <label>Ref</label>
      <input v-model.trim="refVal" placeholder="e.g., 3.2 or Fig 3" />
    </div>
    <div class="row">
      <label>Snippet</label>
      <textarea v-model.trim="snippet" rows="3" />
    </div>
    <button :disabled="busy || !paperId || !refVal || !snippet" @click="onAdd">{{ busy ? 'Adding…' : 'Add Anchor' }}</button>
    <small v-if="busy">Loading…</small>

    <p v-if="toast" class="toast">{{ toast }}</p>
    <p v-if="error" class="msg err">{{ error }}</p>

    <div v-if="recent.length" class="recent">
      <h4>Session Anchors</h4>
      <ul>
        <li v-for="a in recent" :key="a.anchorId">
          {{ a.anchorId }} — {{ a.kind }} — {{ a.ref }}
          <button class="copy" @click="copy(a.anchorId)">Copy id</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { anchored, type AnchorKind } from '@/api/endpoints';

const props = defineProps<{ paperId: string | null }>();

const kind = ref<AnchorKind>('Section');
const refVal = ref('');
const snippet = ref('');
const busy = ref(false);
const toast = ref('');
const error = ref('');
const recent = ref<{ anchorId: string; kind: AnchorKind; ref: string }[]>([]);

watch(props, () => { error.value = ''; });

async function onAdd() {
  if (!props.paperId) return;
  error.value = '';
  toast.value = '';
  busy.value = true;
  try {
    const res = await anchored.create({ paperId: props.paperId, kind: kind.value, ref: refVal.value, snippet: snippet.value });
    toast.value = `Anchor created (id: ${res.anchorId})`;
    recent.value.unshift({ anchorId: res.anchorId, kind: kind.value, ref: refVal.value });
    setTimeout(() => (toast.value = ''), 2000);
    refVal.value = '';
    snippet.value = '';
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    busy.value = false;
  }
}

async function copy(id: string) {
  try {
    await navigator.clipboard.writeText(id);
    toast.value = 'Copied';
    setTimeout(() => (toast.value = ''), 800);
  } catch {}
}
</script>

<style scoped>
.panel { display: flex; flex-direction: column; gap: 8px; }
.row { display: grid; grid-template-columns: 100px 1fr; gap: 8px; align-items: center; }
input, select, textarea { padding: 6px 8px; border: 1px solid #ddd; border-radius: 6px; }
button { padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; background: #111827; color: white; }
button:disabled { opacity: 0.6; }
.toast { font-size: 12px; color: #2563eb; }
.msg.err { font-size: 12px; color: #9b1c1c; }
.recent { margin-top: 8px; }
.recent ul { margin: 0; padding-left: 16px; }
.copy { margin-left: 8px; padding: 2px 6px; border: 1px solid #ddd; border-radius: 4px; }
</style>


