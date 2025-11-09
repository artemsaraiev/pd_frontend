<template>
  <div class="pdf-root">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="viewer">
      <div v-if="loading" class="loading">Loading PDF…</div>
      <div ref="pagesContainer" class="pages"></div>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
// Use Vite's asset url import to resolve worker at build-time
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure worker
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerSrc;

const props = defineProps<{
  src?: string;
  sources?: string[];
}>();

const pagesContainer = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref('');

let cancelled = false;

async function tryLoad(url: string) {
  const loadingTask = (pdfjsLib as any).getDocument({
    url,
    withCredentials: false,
  });
  const pdf = await loadingTask.promise;
  return pdf;
}

async function renderPdf() {
  error.value = '';
  loading.value = true;
  // Clear existing canvases
  if (pagesContainer.value) {
    pagesContainer.value.innerHTML = '';
  }
  try {
    const candidates = (props.sources && props.sources.length ? props.sources : (props.src ? [props.src] : []))
      .filter(Boolean) as string[];
    if (!candidates.length) {
      throw new Error('No PDF source provided');
    }
    let pdf: any | null = null;
    let lastErr: unknown = null;
    for (const url of candidates) {
      try {
        pdf = await tryLoad(url);
        if (pdf) break;
      } catch (e) {
        lastErr = e;
        continue;
      }
    }
    if (!pdf) {
      throw lastErr ?? new Error('Failed to load PDF');
    }
    if (cancelled) return;
    const total = pdf.numPages;
    for (let i = 1; i <= total; i++) {
      if (cancelled) return;
      const page = await pdf.getPage(i);
      const container = pagesContainer.value!;
      const canvas = document.createElement('canvas');
      canvas.className = 'page-canvas';
      container.appendChild(canvas);
      const context = canvas.getContext('2d')!;
      // Fit-to-width scaling
      const baseViewport = page.getViewport({ scale: 1 });
      const cssWidth = container.clientWidth || baseViewport.width;
      const scale = cssWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      await page.render({ canvasContext: context, viewport }).promise;
    }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  cancelled = false;
  renderPdf();
});

onBeforeUnmount(() => {
  cancelled = true;
});

watch(() => [props.src, props.sources], () => {
  cancelled = false;
  renderPdf();
});
</script>

<style scoped>
.pdf-root { display: block; }
.viewer { display: block; }
.loading { color: #666; padding: 8px 0; }
.error { color: var(--error); }
.pages { display: grid; gap: 12px; }
.page-canvas {
  display: block;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
</style>


