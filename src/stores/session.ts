import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    userId: 'u1' as string,
  }),
});


