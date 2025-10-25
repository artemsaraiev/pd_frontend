<template>
  <div class="panel">
    <h3>Open Discussion</h3>
    <p class="hint" v-if="!paperId">Set a current paper first.</p>
    <div class="row">
      <label>Paper</label>
      <input :value="paperId ?? ''" disabled />
    </div>
    <button :disabled="busyOpen || !paperId || pubOpened" @click="onOpenPub">{{ pubOpened ? 'Pub opened' : (busyOpen ? 'Opening…' : 'Open Pub') }}</button>
    <small v-if="busyOpen">Loading…</small>
    <p v-if="pubMsg" class="msg ok">{{ pubMsg }}</p>
    <p v-if="errorOpen" class="msg err">{{ errorOpen }}</p>

    <h3>Start a thread</h3>
    <div class="row">
      <label>Author</label>
      <input v-model.trim="author" />
    </div>
    <div class="row">
      <label>Body</label>
      <textarea v-model.trim="body" rows="3" />
    </div>
    <div class="row">
      <label>Anchor Id</label>
      <input v-model.trim="anchorId" placeholder="optional" />
    </div>
    <button :disabled="busyThread || !pubId || !author || !body" @click="onStartThread">{{ busyThread ? 'Posting…' : 'Start Thread' }}</button>
    <small v-if="busyThread">Loading…</small>
    <p v-if="threadMsg" class="msg ok">{{ threadMsg }}</p>
    <p v-if="errorThread" class="msg err">{{ errorThread }}</p>

    <h3>Quick reply</h3>
    <div class="row">
      <label>Thread Id</label>
      <input v-model.trim="replyThreadId" />
    </div>
    <div class="row">
      <label>Reply Body</label>
      <textarea v-model.trim="replyBody" rows="2" />
    </div>
    <button :disabled="busyReply || !replyThreadId || !author || !replyBody" @click="onReply">{{ busyReply ? 'Replying…' : 'Reply' }}</button>
    <small v-if="busyReply">Loading…</small>
    <p v-if="replyMsg" class="msg ok">{{ replyMsg }}</p>
    <p v-if="errorReply" class="msg err">{{ errorReply }}</p>

    <div v-if="actions.length" class="recent">
      <h4>Recent actions</h4>
      <ul>
        <li v-for="(a, i) in actions" :key="i">{{ a }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSessionStore } from '@/stores/session';
import { discussion } from '@/api/endpoints';

const props = defineProps<{ paperId: string | null }>();

const session = useSessionStore();
const pubId = ref<string | null>(null);
const pubOpened = ref(false);
const busyOpen = ref(false);
const errorOpen = ref('');
const pubMsg = ref('');

const author = ref(session.userId);
const body = ref('');
const anchorId = ref('');
const busyThread = ref(false);
const errorThread = ref('');
const threadMsg = ref('');

const replyThreadId = ref('');
const replyBody = ref('');
const busyReply = ref(false);
const errorReply = ref('');
const replyMsg = ref('');

const actions = ref<string[]>([]);

watch(() => props.paperId, () => { pubId.value = null; pubMsg.value=''; pubOpened.value = false; });

async function onOpenPub() {
  if (!props.paperId) return;
  busyOpen.value = true; errorOpen.value=''; pubMsg.value='';
  try {
    const res = await discussion.open({ paperId: props.paperId });
    pubId.value = res.pubId;
    pubMsg.value = `Pub opened (pubId: ${res.pubId})`;
    pubOpened.value = true;
    actions.value.unshift(`Pub ${res.pubId} opened for paper ${props.paperId}`);
  } catch (e: any) {
    errorOpen.value = e?.message ?? String(e);
  } finally {
    busyOpen.value = false;
  }
}

async function onStartThread() {
  if (!pubId.value) return;
  busyThread.value = true; errorThread.value=''; threadMsg.value='';
  try {
    const res = await discussion.startThread({ pubId: pubId.value, author: author.value, body: body.value, anchorId: anchorId.value || undefined });
    threadMsg.value = `Thread created (id: ${res.threadId})`;
    actions.value.unshift(`Thread ${res.threadId} created${anchorId.value ? ` (anchor: ${anchorId.value})` : ''}`);
    body.value = '';
    anchorId.value = '';
    replyThreadId.value = res.threadId;
  } catch (e: any) {
    errorThread.value = e?.message ?? String(e);
  } finally {
    busyThread.value = false;
  }
}

async function onReply() {
  busyReply.value = true; errorReply.value=''; replyMsg.value='';
  try {
    const res = await discussion.reply({ threadId: replyThreadId.value, author: author.value, body: replyBody.value });
    replyMsg.value = `Reply created (id: ${res.replyId})`;
    actions.value.unshift(`Reply ${res.replyId} added to ${replyThreadId.value}`);
    replyBody.value = '';
  } catch (e: any) {
    errorReply.value = e?.message ?? String(e);
  } finally {
    busyReply.value = false;
  }
}
</script>

<style scoped>
.panel { display: flex; flex-direction: column; gap: 8px; }
.row { display: grid; grid-template-columns: 100px 1fr; gap: 8px; align-items: center; }
input, textarea { padding: 6px 8px; border: 1px solid #ddd; border-radius: 6px; }
button { padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; background: #111827; color: white; }
button:disabled { opacity: 0.6; }
.msg { font-size: 12px; margin: 0; }
.ok { color: #11683a; }
.err { color: #9b1c1c; }
.recent ul { margin: 0; padding-left: 16px; }
</style>


