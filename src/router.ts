import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  { path: '/', name: 'home', component: () => import('./views/HomeFeed.vue') },
  { path: '/paper/:id', name: 'paper', component: () => import('./views/PaperPage.vue'), props: true },
  { path: '/my', name: 'my', component: () => import('./views/MyPapers.vue') },
  { path: '/explore', name: 'explore', component: () => import('./views/Explore.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { left: 0, top: 0 }; },
});

export default router;


