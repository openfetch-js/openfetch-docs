<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

/** Short, readable snippet for the hero typewriter (loops). */
const CODE = `import openFetch from "@hamdymohamedak/openfetch";

const res = await openFetch.get("https://api.example.com/v1/items");
// res.data · interceptors · middleware`;

const displayed = ref("");
const cursorVisible = ref(true);

let typeTimer: ReturnType<typeof setTimeout> | undefined;
let pauseTimer: ReturnType<typeof setTimeout> | undefined;
let cursorTimer: ReturnType<typeof setInterval> | undefined;

function clearTimers() {
  if (typeTimer !== undefined) clearTimeout(typeTimer);
  if (pauseTimer !== undefined) clearTimeout(pauseTimer);
  if (cursorTimer !== undefined) clearInterval(cursorTimer);
  typeTimer = pauseTimer = cursorTimer = undefined;
}

function schedulePauseThenRestart() {
  if (pauseTimer !== undefined) clearTimeout(pauseTimer);
  pauseTimer = window.setTimeout(() => {
    pauseTimer = undefined;
    displayed.value = "";
    runTypingLoop(0);
  }, 4200);
}

function runTypingLoop(index: number) {
  if (index > CODE.length) {
    schedulePauseThenRestart();
    return;
  }

  displayed.value = CODE.slice(0, index);

  if (index === CODE.length) {
    schedulePauseThenRestart();
    return;
  }

  const ch = CODE[index];
  const delay =
    ch === "\n"
      ? 280
      : ch === " "
        ? 42
        : 52 + Math.floor(Math.random() * 58);

  typeTimer = window.setTimeout(() => runTypingLoop(index + 1), delay);
}

onMounted(() => {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    displayed.value = CODE;
    cursorVisible.value = true;
    return;
  }

  cursorTimer = window.setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 640);

  runTypingLoop(0);
});

onUnmounted(() => {
  clearTimers();
});
</script>

<template>
  <div class="typer" aria-label="Example openFetch usage in TypeScript">
    <div class="typer-chrome">
      <span class="dots" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span class="typer-title">example.ts</span>
      <span class="typer-pill">TypeScript</span>
    </div>
    <div class="typer-body">
      <pre class="typer-pre"><code>{{ displayed }}<span
        class="typer-cursor"
        :data-on="cursorVisible ? 'true' : 'false'"
      ></span></code></pre>
    </div>
  </div>
</template>

<style scoped>
.typer {
  width: min(100%, 22.5rem);
  max-width: 100%;
  margin: 0.85rem auto 0;
  border-radius: 12px;
  border: 1px solid
    color-mix(in srgb, var(--vp-c-divider) 88%, var(--vp-c-brand-1) 12%);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 55%, var(--vp-c-bg));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-bg) 70%, transparent),
    0 12px 32px rgba(15, 23, 42, 0.07),
    0 2px 8px rgba(15, 23, 42, 0.04);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

:root.dark .typer {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 16px 48px rgba(0, 0, 0, 0.35);
}

.typer-chrome {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-alt) 35%, transparent);
}

.dots {
  display: inline-flex;
  gap: 5px;
}

.dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

.dots i:nth-child(1) {
  background: #ff5f57;
}
.dots i:nth-child(2) {
  background: #febc2e;
}
.dots i:nth-child(3) {
  background: #28c840;
}

.typer-title {
  flex: 1;
  min-width: 0;
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: 10px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  letter-spacing: 0.02em;
}

.typer-pill {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 7px;
  border-radius: 999px;
  color: color-mix(in srgb, var(--vp-c-brand-1) 92%, #fff);
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.typer-body {
  padding: 9px 11px 11px;
  min-height: 6.75rem;
}

.typer-pre {
  margin: 0;
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: 10.5px;
  line-height: 1.55;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-break: break-word;
  tab-size: 2;
}

.typer-cursor {
  display: inline-block;
  width: 0.55ch;
  height: 1.15em;
  margin-left: 1px;
  vertical-align: text-bottom;
  border-radius: 2px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 88%, transparent);
  animation: none;
}

.typer-cursor[data-on="false"] {
  opacity: 0.12;
}

@media (prefers-reduced-motion: reduce) {
  .typer-cursor {
    opacity: 0.35;
  }
}
</style>
