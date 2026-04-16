<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { OPENFETCH_NPM_PACKAGE } from "../openfetch-version";

const NPM_API = `https://api.npmjs.org/downloads/point/last-year/${encodeURIComponent(OPENFETCH_NPM_PACKAGE)}`;
const NPM_PAGE = `https://www.npmjs.com/package/${encodeURIComponent(OPENFETCH_NPM_PACKAGE)}`;

const downloads = ref<number | null>(null);
const periodStart = ref<string | null>(null);
const periodEnd = ref<string | null>(null);

let cancelled = false;

onUnmounted(() => {
  cancelled = true;
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
      downloads.value = data.downloads;
      if (typeof data.start === "string") periodStart.value = data.start;
      if (typeof data.end === "string") periodEnd.value = data.end;
    } catch {
      /* silent: leave downloads null — render nothing */
    }
  })();
});

function formatCount(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

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
      <span class="of-hero-npm-dl-accent" aria-hidden="true" />
      <span class="of-hero-npm-dl-inner">
        <span class="of-hero-npm-dl-kicker">
          <span class="of-hero-npm-dl-mark">npm</span>
          <span class="of-hero-npm-dl-kicker-text">Package installs</span>
        </span>
        <span class="of-hero-npm-dl-stat">
          <strong class="of-hero-npm-dl-num">{{ formatCount(downloads) }}</strong>
          <span class="of-hero-npm-dl-label">last 12 months · registry</span>
        </span>
      </span>
      <span class="of-hero-npm-dl-chevron" aria-hidden="true">→</span>
    </a>
  </div>
</template>

<style scoped>
.of-hero-npm-dl {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0.5rem auto 0;
}

.of-hero-npm-dl-link {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  max-width: min(100%, 22rem);
  padding: 0;
  border-radius: 14px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--vp-c-bg-soft) 65%, var(--vp-c-bg)) 0%,
    color-mix(in srgb, var(--vp-c-bg) 94%, var(--vp-c-bg-alt)) 100%
  );
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 78%, var(--vp-c-brand-1) 12%);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-bg) 72%, transparent),
    0 10px 28px rgba(15, 23, 42, 0.06),
    0 2px 8px rgba(37, 99, 235, 0.04);
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.of-hero-npm-dl-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-divider) 62%, var(--vp-c-brand-1) 26%);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent),
    0 16px 40px rgba(37, 99, 235, 0.1),
    0 4px 12px rgba(15, 23, 42, 0.06);
}

.of-hero-npm-dl-link:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--vp-c-bg),
    0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent),
    0 10px 28px rgba(15, 23, 42, 0.06);
}

:root.dark .of-hero-npm-dl-link {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 14px 40px rgba(0, 0, 0, 0.35);
}

:root.dark .of-hero-npm-dl-link:hover {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent),
    0 18px 48px rgba(0, 0, 0, 0.45);
}

.of-hero-npm-dl-accent {
  width: 4px;
  flex-shrink: 0;
  background: linear-gradient(
    180deg,
    #cb3837 0%,
    color-mix(in srgb, #cb3837 70%, var(--vp-c-brand-1)) 55%,
    var(--vp-c-brand-3) 100%
  );
  opacity: 0.95;
}

.of-hero-npm-dl-inner {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 11px 10px 11px 12px;
  text-align: start;
}

.of-hero-npm-dl-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.of-hero-npm-dl-mark {
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 7px;
  border-radius: 6px;
  color: #fff;
  background: linear-gradient(135deg, #cb3837 0%, #c92a2a 100%);
  box-shadow: 0 1px 2px rgba(203, 56, 55, 0.35);
}

.of-hero-npm-dl-kicker-text {
  font-family: var(--of-font-display, var(--vp-font-family-base));
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-3);
  text-transform: none;
}

.of-hero-npm-dl-stat {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem 0.65rem;
  min-width: 0;
}

.of-hero-npm-dl-num {
  font-family: var(--of-font-mono, var(--vp-font-family-mono));
  font-size: clamp(1.05rem, 2.8vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  background: linear-gradient(
    100deg,
    var(--vp-c-text-1) 0%,
    color-mix(in srgb, var(--vp-c-text-1) 88%, var(--vp-c-brand-1)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

:root.dark .of-hero-npm-dl-num {
  background: linear-gradient(
    100deg,
    var(--vp-c-text-1) 0%,
    color-mix(in srgb, var(--vp-c-text-1) 82%, var(--vp-c-brand-3)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.of-hero-npm-dl-label {
  font-family: var(--of-font-display, var(--vp-font-family-base));
  font-size: 11px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--vp-c-text-3);
  letter-spacing: 0.01em;
}

.of-hero-npm-dl-chevron {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 12px 0 4px;
  font-size: 1rem;
  font-weight: 500;
  color: color-mix(in srgb, var(--vp-c-text-3) 70%, var(--vp-c-brand-1));
  opacity: 0.85;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.of-hero-npm-dl-link:hover .of-hero-npm-dl-chevron {
  transform: translateX(3px);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .of-hero-npm-dl-link,
  .of-hero-npm-dl-link:hover,
  .of-hero-npm-dl-chevron,
  .of-hero-npm-dl-link:hover .of-hero-npm-dl-chevron {
    transition: none;
    transform: none;
  }
}
</style>
