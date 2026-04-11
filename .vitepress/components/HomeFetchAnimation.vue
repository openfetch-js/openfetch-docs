<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

type Phase = "idle" | "fetching" | "success";

const phase = ref<Phase>("idle");
const tick = ref(0);
const displayedMs = ref(0);

let cycleTimer: ReturnType<typeof setInterval> | undefined;
let msTimer: ReturnType<typeof setInterval> | undefined;
let lineTimer: ReturnType<typeof setInterval> | undefined;

const url = "https://api.example.com/v1/categories";

const jsonLines = [
  '{ "ok": true,',
  '  "items": [',
  '    { "id": 12, "name": "Audio" },',
  '    { "id": 7, "name": "Shoes" }',
  "  ]",
  "}",
];

const visibleLineCount = computed(() => {
  if (phase.value !== "success") return 0;
  return Math.min(tick.value, jsonLines.length);
});

function startMsRamp(target: number, durationMs: number) {
  const start = performance.now();
  displayedMs.value = 0;
  if (msTimer) clearInterval(msTimer);
  const id = window.setInterval(() => {
    const t = (performance.now() - start) / durationMs;
    displayedMs.value = Math.round(Math.min(1, t) * target);
    if (t >= 1) {
      clearInterval(id);
      msTimer = undefined;
    }
  }, 16);
  msTimer = id;
}

function setPhase(next: Phase) {
  if (msTimer) {
    clearInterval(msTimer);
    msTimer = undefined;
  }
  phase.value = next;
  tick.value = 0;
  if (next === "success") startMsRamp(38 + Math.floor(Math.random() * 24), 420);
}

function bumpTick() {
  tick.value += 1;
}

onMounted(() => {
  const runCycle = () => {
    setPhase("idle");
    window.setTimeout(() => setPhase("fetching"), 500);
    window.setTimeout(() => setPhase("success"), 500 + 1100);
  };

  runCycle();
  cycleTimer = window.setInterval(runCycle, 5200);

  lineTimer = window.setInterval(() => {
    if (phase.value !== "success") return;
    if (tick.value < jsonLines.length) bumpTick();
  }, 95);
});

onUnmounted(() => {
  if (cycleTimer) clearInterval(cycleTimer);
  if (msTimer) clearInterval(msTimer);
  if (lineTimer) clearInterval(lineTimer);
});
</script>

<template>
  <div class="dock" aria-hidden="true">
    <div class="glow" />
    <div class="card">
      <div class="card-top">
        <span class="method" :class="{ pulse: phase === 'fetching' }">GET</span>
        <div class="url-wrap">
          <span class="url">{{ url }}</span>
        </div>
      </div>

      <div class="divider" />

      <div class="body">
        <div v-if="phase === 'idle'" class="hint">Ready to send…</div>

        <div v-else-if="phase === 'fetching'" class="fetching">
          <div class="row skeleton" />
          <div class="row skeleton short" />
          <div class="row skeleton tiny" />
          <div class="spinner" />
          <p class="status-line">Awaiting <code>fetch</code> + interceptors…</p>
        </div>

        <div v-else class="response">
          <pre class="json"><code><span
            v-for="(line, i) in jsonLines"
            :key="i"
            class="json-line"
            :data-visible="i < visibleLineCount ? 'true' : 'false'"
          >{{ line }}<br></span></code></pre>
        </div>
      </div>

      <div class="card-foot">
        <span
          class="chip"
          :data-state="
            phase === 'idle' ? 'idle' : phase === 'fetching' ? 'pending' : 'ok'
          "
        >
          {{
            phase === "idle"
              ? "idle"
              : phase === "fetching"
                ? "in flight"
                : "200 OK"
          }}
        </span>
        <span class="timing">
          {{
            phase === "success"
              ? `~${displayedMs} ms`
              : phase === "fetching"
                ? "…"
                : "—"
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dock {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 8px 0 24px;
}

@media (max-width: 959px) {
  .dock {
    padding: 12px clamp(8px, 3.5vw, 18px) 22px;
    max-width: min(100%, 400px);
  }
}

@media (min-width: 960px) {
  .dock {
    padding: 0;
    max-width: 100%;
  }
}

.glow {
  position: absolute;
  inset: -18% -8% auto;
  height: 72%;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, var(--vp-c-brand-1) 38%, transparent),
    transparent 72%
  );
  filter: blur(36px);
  opacity: 0.85;
  pointer-events: none;
  animation: glow-breathe 5.2s ease-in-out infinite;
}

.card {
  position: relative;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 85%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 92%, var(--vp-c-bg) 8%);
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--vp-c-bg) 40%, transparent),
    0 24px 64px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

:root.dark .card {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04),
    0 28px 80px rgba(0, 0, 0, 0.45);
}

.card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  padding: 14px 16px 12px;
}

.method {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 6px 10px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--vp-c-brand-1),
    color-mix(in srgb, var(--vp-c-brand-3) 70%, #6366f1)
  );
  box-shadow: 0 8px 22px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.method.pulse {
  animation: method-pop 1.1s ease-in-out infinite;
}

.url-wrap {
  flex: 1 1 160px;
  min-width: 0;
  border-radius: 10px;
  padding: 8px 10px;
  background: color-mix(in srgb, var(--vp-c-bg-alt) 55%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  overflow: hidden;
}

.url {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: linear-gradient(
    90deg,
    var(--vp-c-text-2) 0%,
    var(--vp-c-text-1) 50%,
    var(--vp-c-text-2) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: url-shimmer 3.2s linear infinite;
}

.divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-divider)),
    transparent
  );
}

.body {
  min-height: 168px;
  padding: 14px 16px 12px;
  position: relative;
}

.hint {
  font-size: 13px;
  color: var(--vp-c-text-3);
  padding: 8px 0;
  animation: fade-in 0.5s ease both;
}

.fetching {
  position: relative;
}

.row {
  height: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--vp-c-divider) 55%, transparent) 0%,
    color-mix(in srgb, var(--vp-c-brand-soft) 95%, transparent) 50%,
    color-mix(in srgb, var(--vp-c-divider) 55%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: skel 1.1s ease-in-out infinite;
}

.row.short {
  width: 72%;
}

.row.tiny {
  width: 44%;
  height: 8px;
}

.spinner {
  position: absolute;
  inset-inline-end: 8px;
  top: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  border-top-color: var(--vp-c-brand-1);
  animation: spin 0.7s linear infinite;
}

.status-line {
  margin-top: 14px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.status-line code {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
}

.json {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.json-line {
  display: block;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.json-line[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px 14px;
  border-top: 1px solid color-mix(in srgb, var(--vp-c-divider) 65%, transparent);
  font-size: 12px;
}

.chip {
  font-weight: 650;
  letter-spacing: 0.02em;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  transition:
    border-color 0.35s ease,
    color 0.35s ease,
    box-shadow 0.35s ease;
}

.chip[data-state="pending"] {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-divider));
  color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.chip[data-state="ok"] {
  border-color: color-mix(in srgb, #22c55e 45%, var(--vp-c-divider));
  color: #16a34a;
}

:root.dark .chip[data-state="ok"] {
  color: #4ade80;
}

.timing {
  font-variant-numeric: tabular-nums;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  font-size: 11px;
}

@keyframes skel {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes url-shimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

@keyframes method-pop {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
}

@keyframes glow-breathe {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.03);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 639px) {
  .dock {
    padding-top: 6px;
    padding-bottom: 16px;
    padding-inline: clamp(6px, 3.5vw, 16px);
    max-width: 100%;
  }

  .card {
    border-radius: 14px;
  }

  .card-top {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 14px 10px;
  }

  .method {
    align-self: flex-start;
  }

  .url-wrap {
    flex: 1 1 auto;
    min-width: 0;
  }

  .url {
    font-size: 10px;
  }

  .body {
    min-height: 140px;
    padding: 12px 14px 10px;
  }

  .json {
    font-size: 10px;
    line-height: 1.5;
  }

  .status-line {
    font-size: 11px;
    padding-inline-end: 28px;
  }

  .card-foot {
    flex-wrap: wrap;
    padding: 10px 14px 12px;
  }
}

@media (max-width: 400px) {
  .glow {
    opacity: 0.7;
    filter: blur(28px);
  }

  .body {
    min-height: 128px;
  }

  .card-top {
    padding-inline: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .method.pulse,
  .url,
  .row,
  .spinner {
    animation: none !important;
  }

  .json-line {
    opacity: 1 !important;
    transform: none !important;
  }

  .method.pulse {
    transform: none;
  }
}
</style>
