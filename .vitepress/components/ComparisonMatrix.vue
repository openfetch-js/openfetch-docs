<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    locale?: "en" | "ar";
  }>(),
  { locale: "en" }
);

type Row = {
  key: string;
  labelEn: string;
  labelAr: string;
  cells: Record<
    "openfetch" | "axios" | "ky",
    { kind: "yes" | "partial" | "no" | "text"; en: string; ar?: string }
  >;
};

const rows: Row[] = [
  {
    key: "transport",
    labelEn: "Transport",
    labelAr: "طبقة النقل",
    cells: {
      openfetch: { kind: "text", en: "fetch", ar: "fetch" },
      axios: {
        kind: "text",
        en: "XHR (default in browsers)",
        ar: "XHR (افتراضي في المتصفح)",
      },
      ky: { kind: "text", en: "fetch", ar: "fetch" },
    },
  },
  {
    key: "deps",
    labelEn: "Runtime deps",
    labelAr: "تبعيات وقت التشغيل",
    cells: {
      openfetch: { kind: "text", en: "Zero", ar: "صفر" },
      axios: { kind: "text", en: "Own stack", ar: "مجموعة خاصة" },
      ky: { kind: "text", en: "Zero", ar: "صفر" },
    },
  },
  {
    key: "instance",
    labelEn: "Instance & defaults",
    labelAr: "مثيل وإعدادات افتراضية",
    cells: {
      openfetch: { kind: "yes", en: "createClient", ar: "createClient" },
      axios: { kind: "yes", en: "axios.create", ar: "axios.create" },
      ky: { kind: "yes", en: "ky.create", ar: "ky.create" },
    },
  },
  {
    key: "interceptors",
    labelEn: "Request / response interceptors",
    labelAr: "معترضات الطلب والاستجابة",
    cells: {
      openfetch: { kind: "yes", en: "Both", ar: "الاثنان" },
      axios: { kind: "yes", en: "Both", ar: "الاثنان" },
      ky: { kind: "partial", en: "Hooks only", ar: "خطافات فقط" },
    },
  },
  {
    key: "middleware",
    labelEn: "Composable middleware",
    labelAr: "وسيط قابل للتجميع",
    cells: {
      openfetch: { kind: "yes", en: "use()", ar: "use()" },
      axios: { kind: "no", en: "—", ar: "—" },
      ky: { kind: "no", en: "—", ar: "—" },
    },
  },
  {
    key: "retry",
    labelEn: "Retry & memory cache (opt-in)",
    labelAr: "إعادة محاولة وتخزين مؤقت (اختياري)",
    cells: {
      openfetch: { kind: "yes", en: "Plugins", ar: "إضافات" },
      axios: { kind: "partial", en: "Separate", ar: "منفصل" },
      ky: { kind: "partial", en: "Retry only", ar: "إعادة محاولة فقط" },
    },
  },
  {
    key: "response",
    labelEn: "Uniform client response",
    labelAr: "استجابة موحّدة للعميل",
    cells: {
      openfetch: {
        kind: "yes",
        en: "OpenFetchResponse",
        ar: "OpenFetchResponse",
      },
      axios: { kind: "yes", en: "AxiosResponse", ar: "AxiosResponse" },
      ky: {
        kind: "partial",
        en: "Response / parsed",
        ar: "Response / مُحلّى",
      },
    },
  },
  {
    key: "edge",
    labelEn: "Edge & RSC friendly",
    labelAr: "مناسب للحافة و RSC",
    cells: {
      openfetch: { kind: "yes", en: "Uses fetch", ar: "يستخدم fetch" },
      axios: { kind: "partial", en: "Adapters", ar: "محوّلات" },
      ky: { kind: "yes", en: "fetch", ar: "fetch" },
    },
  },
];

const cols = computed(() =>
  props.locale === "ar"
    ? [
        {
          id: "openfetch" as const,
          title: "openFetch",
          tag: "مكتبتك",
          brand: true,
        },
        { id: "axios" as const, title: "Axios", tag: null, brand: false },
        { id: "ky" as const, title: "ky", tag: null, brand: false },
      ]
    : [
        {
          id: "openfetch" as const,
          title: "openFetch",
          brand: true,
        },
        { id: "axios" as const, title: "Axios", tag: null, brand: false },
        { id: "ky" as const, title: "ky", tag: null, brand: false },
      ]
);

const foot = computed(() =>
  props.locale === "ar"
    ? "الحجم الفعلي يعتمد على الدمج والمسارات المستوردة. الفارق الجوهري: openFetch يضيف طبقة عميل فوق fetch دون الانتقال إلى XHR."
    : "Bundle size depends on your toolchain and imports. The core idea: openFetch layers ergonomics on native fetch without switching transports."
);

function cellText(row: Row, colId: keyof Row["cells"]) {
  const c = row.cells[colId];
  const ar = c.ar ?? c.en;
  return props.locale === "ar" ? ar : c.en;
}

const rootEl = ref<HTMLElement | null>(null);
const inView = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  const el = rootEl.value;
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    inView.value = true;
    return;
  }

  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < vh * 0.94 && rect.bottom > 24) {
    inView.value = true;
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          inView.value = true;
          observer?.disconnect();
          observer = null;
          break;
        }
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );
  observer.observe(el);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="rootEl"
    class="cmp-matrix"
    :class="{ 'cmp-matrix--in-view': inView }"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
    role="region"
    :aria-label="locale === 'ar' ? 'مقارنة سريعة' : 'At a glance comparison'"
  >
    <div class="cmp-matrix__scroll">
      <table class="cmp-matrix__table">
        <thead>
          <tr>
            <th class="cmp-matrix__corner" scope="col">
              {{ locale === "ar" ? "المعيار" : "Capability" }}
            </th>
            <th
              v-for="c in cols"
              :key="c.id"
              scope="col"
              class="cmp-matrix__col-head"
              :class="{ 'cmp-matrix__col-head--brand': c.brand }"
            >
              <span class="cmp-matrix__col-title">{{ c.title }}</span>
              <span v-if="c.tag" class="cmp-matrix__col-tag">{{ c.tag }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.key">
            <th class="cmp-matrix__row-label" scope="row">
              {{ locale === "ar" ? row.labelAr : row.labelEn }}
            </th>
            <td
              v-for="c in cols"
              :key="row.key + c.id"
              class="cmp-matrix__cell"
            >
              <span
                v-if="row.cells[c.id].kind === 'yes'"
                class="cmp-pill cmp-pill--yes"
              >
                <span class="cmp-pill__dot" aria-hidden="true" />
                {{ cellText(row, c.id) }}
              </span>
              <span
                v-else-if="row.cells[c.id].kind === 'partial'"
                class="cmp-pill cmp-pill--partial"
              >
                <span class="cmp-pill__dot" aria-hidden="true" />
                {{ cellText(row, c.id) }}
              </span>
              <span
                v-else-if="row.cells[c.id].kind === 'no'"
                class="cmp-pill cmp-pill--no"
              >
                {{ cellText(row, c.id) }}
              </span>
              <span v-else class="cmp-text">{{ cellText(row, c.id) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="cmp-matrix__foot">{{ foot }}</p>
  </div>
</template>

<style scoped>
@keyframes cmp-head-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cmp-row-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cmp-foot-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cmp-sheen {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.55;
  }
}

@keyframes cmp-dot-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  55% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.cmp-matrix {
  --cmp-max: min(56rem, calc(100vw - 2 * var(--of-content-pad-inline, 20px)));
  box-sizing: border-box;
  width: min(100%, var(--cmp-max));
  max-width: var(--cmp-max);
  margin-inline: auto;
  margin-block: 1.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.cmp-matrix__scroll {
  position: relative;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  margin-inline: auto;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 78%, transparent);
  background:
    radial-gradient(
      130% 90% at 50% -20%,
      color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent),
      transparent 52%
    ),
    radial-gradient(
      80% 55% at 100% 100%,
      color-mix(in srgb, var(--vp-c-brand-3) 8%, transparent),
      transparent 45%
    ),
    linear-gradient(
      168deg,
      color-mix(in srgb, var(--vp-c-bg-soft) 92%, transparent) 0%,
      var(--vp-c-bg) 38%,
      color-mix(in srgb, var(--vp-c-bg) 88%, var(--vp-c-bg-soft)) 100%
    );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--vp-c-bg) 35%, #fff) inset,
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
    0 28px 64px -32px rgba(15, 23, 42, 0.28);
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
}

.cmp-matrix__scroll::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 40%,
    color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  opacity: 0;
}

.cmp-matrix--in-view .cmp-matrix__scroll::after {
  animation: cmp-sheen 6s ease-in-out infinite;
}

.dark .cmp-matrix__scroll {
  border-color: color-mix(in srgb, var(--vp-c-divider) 82%, transparent);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent),
    0 32px 72px -28px rgba(0, 0, 0, 0.58);
}

/* VitePress `.vp-doc table { display: block; overflow-x: auto }` — block tables
   shrink to content width, so the grid sat left inside the card. Restore table layout. */
.cmp-matrix__table {
  position: relative;
  z-index: 1;
  display: table !important;
  width: 100% !important;
  min-width: min(100%, 520px);
  margin: 0 !important;
  overflow: visible !important;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.cmp-matrix__table :where(thead, tbody) tr {
  background-color: transparent;
  border-top: none;
}

.cmp-matrix__table thead th {
  opacity: 0;
}

.cmp-matrix--in-view .cmp-matrix__table thead th {
  animation: cmp-head-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.cmp-matrix--in-view .cmp-matrix__table thead th:nth-child(1) {
  animation-delay: 0.02s;
}
.cmp-matrix--in-view .cmp-matrix__table thead th:nth-child(2) {
  animation-delay: 0.08s;
}
.cmp-matrix--in-view .cmp-matrix__table thead th:nth-child(3) {
  animation-delay: 0.14s;
}
.cmp-matrix--in-view .cmp-matrix__table thead th:nth-child(4) {
  animation-delay: 0.2s;
}

.cmp-matrix__table tbody tr {
  opacity: 0;
}

.cmp-matrix--in-view .cmp-matrix__table tbody tr {
  animation: cmp-row-in 0.52s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(1) {
  animation-delay: 0.18s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(2) {
  animation-delay: 0.24s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(3) {
  animation-delay: 0.3s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(4) {
  animation-delay: 0.36s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(5) {
  animation-delay: 0.42s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(6) {
  animation-delay: 0.48s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(7) {
  animation-delay: 0.54s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(8) {
  animation-delay: 0.6s;
}
.cmp-matrix--in-view .cmp-matrix__table tbody tr:nth-child(9) {
  animation-delay: 0.66s;
}

.cmp-matrix__table tbody tr {
  transition: background-color 0.22s ease;
}

.cmp-matrix__table tbody tr:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent);
}

.cmp-matrix__corner {
  width: 30%;
  min-width: 0;
  padding: 1rem 1.1rem;
  text-align: start;
  font-size: 0.68rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 85%, transparent);
  vertical-align: bottom;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, var(--vp-c-bg-soft));
}

.cmp-matrix__col-head {
  width: calc(70% / 3);
  padding: 1rem 0.65rem 0.85rem;
  text-align: center;
  font-weight: 750;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 85%, transparent);
  border-inline-start: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  vertical-align: bottom;
}

.cmp-matrix__col-head--brand {
  background: linear-gradient(
    195deg,
    color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent) 0%,
    color-mix(in srgb, var(--vp-c-bg) 90%, var(--vp-c-bg-soft)) 72%,
    color-mix(in srgb, var(--vp-c-bg) 95%, transparent) 100%
  );
}

.cmp-matrix__col-title {
  display: block;
  font-size: 0.98rem;
  letter-spacing: -0.025em;
}

.cmp-matrix__col-tag {
  display: inline-block;
  margin-top: 0.38rem;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  transition: transform 0.2s ease;
}

.cmp-matrix__col-head--brand:hover .cmp-matrix__col-tag {
  transform: scale(1.04);
}

.cmp-matrix__row-label {
  padding: 0.72rem 1.1rem;
  text-align: start;
  font-weight: 600;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 48%, var(--vp-c-bg));
  transition: background-color 0.22s ease, color 0.22s ease;
}

.cmp-matrix__table tbody tr:hover .cmp-matrix__row-label {
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-bg-soft));
}

.cmp-matrix__cell {
  padding: 0.6rem 0.55rem;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  border-inline-start: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  transition: background-color 0.22s ease;
}

.cmp-matrix__table tbody tr:hover .cmp-matrix__cell {
  background: color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent);
}

.cmp-matrix__table tbody tr:last-child .cmp-matrix__row-label,
.cmp-matrix__table tbody tr:last-child .cmp-matrix__cell {
  border-bottom: none;
}

.cmp-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.38rem;
  max-width: 100%;
  padding: 0.3rem 0.58rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.2;
  transition:
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s ease;
}

.cmp-pill:hover {
  transform: translateY(-1px) scale(1.02);
}

.cmp-pill__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cmp-matrix--in-view .cmp-pill--yes .cmp-pill__dot,
.cmp-matrix--in-view .cmp-pill--partial .cmp-pill__dot {
  animation: cmp-dot-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.cmp-matrix--in-view .cmp-pill--partial .cmp-pill__dot {
  animation-delay: 0.08s;
}

.cmp-pill--yes {
  background: color-mix(in srgb, #22c55e 14%, transparent);
  color: #15803d;
  border: 1px solid color-mix(in srgb, #22c55e 22%, transparent);
  box-shadow: 0 1px 0 color-mix(in srgb, #fff 18%, transparent) inset;
}

.cmp-pill--yes .cmp-pill__dot {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.28);
}

.dark .cmp-pill--yes {
  background: color-mix(in srgb, #4ade80 16%, transparent);
  color: #86efac;
  border-color: color-mix(in srgb, #4ade80 28%, transparent);
}

.cmp-pill--partial {
  background: color-mix(in srgb, #f59e0b 16%, transparent);
  color: #b45309;
  border: 1px solid color-mix(in srgb, #f59e0b 26%, transparent);
  box-shadow: 0 1px 0 color-mix(in srgb, #fff 12%, transparent) inset;
}

.cmp-pill--partial .cmp-pill__dot {
  background: #f59e0b;
}

.dark .cmp-pill--partial {
  background: color-mix(in srgb, #fbbf24 18%, transparent);
  color: #fcd34d;
  border-color: color-mix(in srgb, #fbbf24 32%, transparent);
}

.cmp-pill--no {
  color: var(--vp-c-text-3);
  font-weight: 500;
  padding: 0.2rem 0.4rem;
}

.cmp-text {
  display: inline-block;
  max-width: 100%;
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  text-wrap: balance;
}

.cmp-matrix__foot {
  margin: 1.05rem 0 0;
  padding-inline: clamp(0.25rem, 2vw, 1rem);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  text-align: center;
  text-wrap: balance;
  width: 100%;
  max-width: var(--cmp-max);
  align-self: center;
  box-sizing: border-box;
  opacity: 0;
}

.cmp-matrix--in-view .cmp-matrix__foot {
  animation: cmp-foot-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.72s forwards;
}

@media (prefers-reduced-motion: reduce) {
  .cmp-matrix__scroll::after {
    animation: none;
    opacity: 0;
  }

  .cmp-matrix__table thead th,
  .cmp-matrix__table tbody tr,
  .cmp-matrix__foot {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .cmp-matrix--in-view .cmp-pill--yes .cmp-pill__dot,
  .cmp-matrix--in-view .cmp-pill--partial .cmp-pill__dot {
    animation: none;
  }

  .cmp-pill:hover {
    transform: none;
  }
}

@media (max-width: 639px) {
  .cmp-matrix {
    --cmp-max: min(100%, calc(100vw - 2 * var(--of-content-pad-inline, 18px)));
  }

  .cmp-matrix__scroll {
    border-radius: 16px;
  }

  .cmp-matrix__table {
    min-width: 480px;
    font-size: 0.8125rem;
  }

  .cmp-matrix__corner,
  .cmp-matrix__col-head {
    padding: 0.7rem 0.6rem;
  }

  .cmp-matrix__row-label {
    padding: 0.58rem 0.7rem;
    font-size: 0.78rem;
  }

  .cmp-pill {
    font-size: 0.72rem;
    padding: 0.24rem 0.48rem;
  }
}
</style>
