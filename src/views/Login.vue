<template>
  <div class="page">
    <h2>Sign in</h2>
    <form class="card form" @submit.prevent="loginUser">
      <label>
        <div>Username</div>
        <input v-model.trim="username" placeholder="choose a username" />
      </label>
      <label>
        <div>Password</div>
        <input v-model.trim="password" placeholder="password" type="password" />
      </label>
      <button class="primary" :disabled="!username || !password">Sign in</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import { session } from '@/api/endpoints';
import { useSessionStore } from '@/stores/session';

const store = useSessionStore();
const username = ref('');
const password = ref('');
const error = ref('');

async function loginUser() {
  error.value = '';
  try {
    const res = await session.login({ username: username.value, password: password.value });
    if ('error' in res) throw new Error(res.error);
    store.setSession(username.value, res.session);
    window.location.assign('/');
  } catch (e: any) {
    error.value = String(e?.message ?? 'Failed to sign in');
  }
}
</script>

<style scoped>
.form { display: grid; gap: 12px; max-width: 360px; }
label { display: grid; gap: 6px; }
input { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; }
.error { color: var(--error); }
.card { border: 1px solid var(--border); border-radius: 8px; background: #fff; padding: 12px 16px; }
.primary { background: var(--brand); color: #fff; border: 1px solid var(--brand); border-radius: 6px; padding: 6px 10px; }
</style>


