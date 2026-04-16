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
      <div class="typer-tabs" aria-hidden="true">
        <span class="typer-tab typer-tab-active">
          <span class="typer-tab-icon" />
          example.ts
        </span>
        <span class="typer-tab typer-tab-idle">openfetch</span>
      </div>
      <span class="typer-pill">TS</span>
    </div>
    <div class="typer-body">
      <div class="typer-gutter" aria-hidden="true">
        <span v-for="n in 4" :key="n" class="typer-ln">{{ n }}</span>
      </div>
      <div class="typer-code-wrap">
        <pre class="typer-pre"><code>{{ displayed }}<span
          class="typer-cursor"
          :data-on="cursorVisible ? 'true' : 'false'"
        ></span></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.typer {
  --typer-lh: 1.58;
  --typer-fs: clamp(11px, 2.1vw, 13px);
  width: min(100%, clamp(22rem, 92%, 40rem));
  max-width: 100%;
  margin: 1rem auto 0;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 82%, var(--vp-c-brand-1) 18%);
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--vp-c-bg-soft) 70%, var(--vp-c-bg)) 0%,
    color-mix(in srgb, var(--vp-c-bg) 96%, var(--vp-c-bg-alt)) 100%
  );
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-bg) 65%, transparent),
    0 4px 6px rgba(15, 23, 42, 0.03),
    0 20px 50px rgba(37, 99, 235, 0.07),
    0 1px 0 color-mix(in srgb, #fff 6%, transparent);
  backdrop-filter: blur(14px);
  overflow: hidden;
}

:root.dark .typer {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.07),
    0 24px 56px rgba(0, 0, 0, 0.45),
    0 0 80px rgba(59, 130, 246, 0.06);
}

.typer-chrome {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 0;
  background: color-mix(in srgb, var(--vp-c-bg-alt) 28%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 72%, transparent);
}

.dots {
  display: inline-flex;
  gap: 6px;
  flex-shrink: 0;
}

.dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--vp-c-text-1) 7%, transparent);
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

.typer-tabs {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: 11px;
  font-weight: 500;
}

.typer-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 8px;
  border-radius: 8px 8px 0 0;
  color: var(--vp-c-text-3);
  letter-spacing: 0.01em;
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.typer-tab-icon {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--vp-c-brand-1) 55%, #6366f1),
    color-mix(in srgb, var(--vp-c-brand-3) 70%, #8b5cf6)
  );
  opacity: 0.9;
  flex-shrink: 0;
}

.typer-tab-active {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, var(--vp-c-bg-soft));
  box-shadow:
    0 -1px 0 color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent) inset,
    0 1px 0 color-mix(in srgb, var(--vp-c-bg) 100%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 75%, transparent);
  border-bottom-color: transparent;
  margin-bottom: -1px;
  position: relative;
  z-index: 1;
}

.typer-tab-idle {
  padding-inline: 10px;
  opacity: 0.55;
  cursor: default;
}

.typer-pill {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  border-radius: 6px;
  color: color-mix(in srgb, var(--vp-c-brand-1) 95%, #fff);
  background: color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}

.typer-body {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 7.25rem;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, var(--vp-c-bg-alt));
  box-shadow: 3px 0 0 0 color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent) inset;
}

.typer-gutter {
  display: flex;
  flex-direction: column;
  padding: 12px 10px 14px 14px;
  text-align: right;
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: calc(var(--typer-fs) * 0.92);
  line-height: var(--typer-lh);
  color: color-mix(in srgb, var(--vp-c-text-3) 88%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-alt) 22%, transparent);
  border-right: 1px solid color-mix(in srgb, var(--vp-c-divider) 65%, transparent);
  user-select: none;
  font-variant-numeric: tabular-nums;
}

.typer-ln {
  display: block;
  min-height: calc(var(--typer-fs) * var(--typer-lh));
}

.typer-code-wrap {
  padding: 12px 14px 14px 12px;
  min-width: 0;
}

.typer-pre {
  margin: 0;
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: var(--typer-fs);
  line-height: var(--typer-lh);
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-break: break-word;
  tab-size: 2;
}

.typer-cursor {
  display: inline-block;
  width: 0.5ch;
  height: 1.12em;
  margin-left: 1px;
  vertical-align: text-bottom;
  border-radius: 2px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 85%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  animation: none;
}

.typer-cursor[data-on="false"] {
  opacity: 0.15;
}

@media (prefers-reduced-motion: reduce) {
  .typer-cursor {
    opacity: 0.38;
    box-shadow: none;
  }
}

@media (max-width: 420px) {
  .typer-tab-idle {
    display: none;
  }
}
</style>
