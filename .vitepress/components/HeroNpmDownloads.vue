<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { OPENFETCH_NPM_PACKAGE } from "../openfetch-version";

const NPM_API = `https://api.npmjs.org/downloads/point/last-year/${encodeURIComponent(OPENFETCH_NPM_PACKAGE)}`;
const NPM_PAGE = `https://www.npmjs.com/package/${encodeURIComponent(OPENFETCH_NPM_PACKAGE)}`;

const downloads = ref<number | null>(null);
const displayedCount = ref(0);
const counting = ref(false);
const periodStart = ref<string | null>(null);
const periodEnd = ref<string | null>(null);

let cancelled = false;
let rafId = 0;

function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
}

function cancelCountUp() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  counting.value = false;
}

/** Duration scales slightly with magnitude so large numbers don’t feel rushed. */
function countUpDurationMs(target: number) {
  const base = 2400;
  const scale = 520 * Math.log10(target + 10);
  return Math.min(6000, Math.max(1800, base + scale));
}

function runCountUp(target: number) {
  cancelCountUp();
  displayedCount.value = 0;

  if (typeof window === "undefined") {
    displayedCount.value = target;
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    displayedCount.value = target;
    return;
  }

  counting.value = true;
  const duration = countUpDurationMs(target);
  const t0 = performance.now();

  function tick(now: number) {
    if (cancelled) {
      cancelCountUp();
      return;
    }
    const elapsed = now - t0;
    const t = Math.min(1, elapsed / duration);
    displayedCount.value = Math.round(easeOutQuart(t) * target);
    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      displayedCount.value = target;
      counting.value = false;
      rafId = 0;
    }
  }

  rafId = requestAnimationFrame(tick);
}

onUnmounted(() => {
  cancelled = true;
  cancelCountUp();
});

onMounted(() => {
  (async () => {
    try {
      const res = await fetch(NPM_API);
      if (!res.ok) return;
      const data = (await res.json()) as {
        downloads?: unknown;
        start?: unknown;
        end?: unknown;
      };
      if (typeof data.downloads !== "number" || !Number.isFinite(data.downloads)) return;
      if (cancelled) return;
      const n = data.downloads;
      downloads.value = n;
      if (typeof data.start === "string") periodStart.value = data.start;
      if (typeof data.end === "string") periodEnd.value = data.end;
      runCountUp(n);
    } catch {
      /* silent */
    }
  })();
});

function formatCount(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

const counterMinWidth = computed(() => {
  const v = downloads.value;
  if (v === null) return undefined;
  const chars = formatCount(v).length;
  return `${Math.max(6, chars + 1)}ch`;
});

const periodTitle = computed(() => {
  if (!periodStart.value || !periodEnd.value) return undefined;
  return `npm downloads for ${periodStart.value} → ${periodEnd.value} (registry window)`;
});
</script>

<template>
  <div v-if="downloads !== null" class="of-hero-npm-dl">
    <a
      class="of-hero-npm-dl-link"
      :href="NPM_PAGE"
      target="_blank"
      rel="noopener noreferrer"
      :title="periodTitle"
    >
      <p class="of-hero-npm-dl-eyebrow">npm · package installs</p>
      <p
        class="of-hero-npm-dl-title-wrap"
        :style="counterMinWidth ? { minWidth: counterMinWidth, marginInline: 'auto' } : undefined"
      >
        <span
          class="of-hero-npm-dl-title"
          :class="{ 'of-hero-npm-dl-title--counting': counting }"
        >{{ formatCount(displayedCount) }}</span>
      </p>
      <p class="of-hero-npm-dl-sub">last 12 months · registry</p>
    </a>
  </div>
</template>

<style scoped>
.of-hero-npm-dl {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0.45rem auto 0;
}

.of-hero-npm-dl-link {
  display: block;
  max-width: min(100%, 22rem);
  margin-inline: auto;
  padding: 0;
  text-align: center;
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  box-shadow: none;
  border-radius: 0;
  transition: color 0.2s ease;
}

.of-hero-npm-dl-link:hover {
  color: inherit;
}

.of-hero-npm-dl-link:hover .of-hero-npm-dl-title {
  color: var(--vp-c-brand-1);
}

.of-hero-npm-dl-link:hover .of-hero-npm-dl-sub {
  color: var(--vp-c-text-2);
}

.of-hero-npm-dl-link:focus-visible {
  outline: none;
  border-radius: 6px;
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
}

.of-hero-npm-dl-eyebrow {
  margin: 0 0 0.2rem;
  font-family: var(--of-font-display, var(--vp-font-family-base));
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  line-height: 1.3;
}

.of-hero-npm-dl-title-wrap {
  margin: 0 auto 0.15rem;
}

.of-hero-npm-dl-title {
  display: inline-block;
  font-family: var(--of-font-display, var(--vp-font-family-base));
  font-size: clamp(1.65rem, 5vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease, opacity 0.2s ease;
}

.of-hero-npm-dl-title--counting {
  color: color-mix(in srgb, var(--vp-c-text-1) 88%, var(--vp-c-brand-1));
}

.of-hero-npm-dl-sub {
  margin: 0;
  font-family: var(--of-font-display, var(--vp-font-family-base));
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .of-hero-npm-dl-link,
  .of-hero-npm-dl-title {
    transition: none;
  }

  .of-hero-npm-dl-title--counting {
    color: var(--vp-c-text-1);
  }
}
</style>
