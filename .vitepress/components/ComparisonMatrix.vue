<script setup lang="ts">
import { computed } from "vue";

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
          tag: "This library",
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
</script>

<template>
  <div
    class="cmp-matrix"
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
.cmp-matrix {
  margin: 1.5rem 0 2.25rem;
}

.cmp-matrix__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: linear-gradient(
    180deg,
    var(--vp-c-bg-soft) 0%,
    var(--vp-c-bg) 48%
  );
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 20px 50px -24px rgba(15, 23, 42, 0.2);
}

.dark .cmp-matrix__scroll {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04) inset,
    0 24px 60px -20px rgba(0, 0, 0, 0.55);
}

.cmp-matrix__table {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.cmp-matrix__corner {
  width: 26%;
  min-width: 140px;
  padding: 0.85rem 1rem;
  text-align: start;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: bottom;
  background: var(--vp-c-bg);
}

.cmp-matrix__col-head {
  padding: 0.85rem 0.75rem 0.75rem;
  text-align: center;
  font-weight: 700;
  border-bottom: 1px solid var(--vp-c-divider);
  border-inline-start: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  vertical-align: bottom;
}

.cmp-matrix__col-head--brand {
  background: linear-gradient(
    180deg,
    rgba(37, 99, 235, 0.12) 0%,
    var(--vp-c-bg) 100%
  );
}

.cmp-matrix__col-title {
  display: block;
  font-size: 0.95rem;
  letter-spacing: -0.02em;
}

.cmp-matrix__col-tag {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.cmp-matrix__row-label {
  padding: 0.65rem 1rem;
  text-align: start;
  font-weight: 600;
  font-size: 0.82rem;
  line-height: 1.35;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.cmp-matrix__cell {
  padding: 0.55rem 0.65rem;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid var(--vp-c-divider);
  border-inline-start: 1px solid var(--vp-c-divider);
}

.cmp-matrix__table tbody tr:last-child .cmp-matrix__row-label,
.cmp-matrix__table tbody tr:last-child .cmp-matrix__cell {
  border-bottom: none;
}

.cmp-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  max-width: 100%;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.2;
}

.cmp-pill__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cmp-pill--yes {
  background: rgba(22, 163, 74, 0.12);
  color: #15803d;
}

.cmp-pill--yes .cmp-pill__dot {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
}

.dark .cmp-pill--yes {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.cmp-pill--partial {
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
}

.cmp-pill--partial .cmp-pill__dot {
  background: #f59e0b;
}

.dark .cmp-pill--partial {
  background: rgba(245, 158, 11, 0.18);
  color: #fbbf24;
}

.cmp-pill--no {
  color: var(--vp-c-text-3);
  font-weight: 500;
  padding: 0.2rem 0.4rem;
}

.cmp-text {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  line-height: 1.35;
}

.cmp-matrix__foot {
  margin: 0.85rem 0 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--vp-c-text-3);
  max-width: 52rem;
}

@media (max-width: 639px) {
  .cmp-matrix__scroll {
    border-radius: 12px;
    margin-inline: 0;
  }

  .cmp-matrix__table {
    min-width: 480px;
    font-size: 0.8125rem;
  }

  .cmp-matrix__corner,
  .cmp-matrix__col-head {
    padding: 0.65rem 0.55rem;
  }

  .cmp-matrix__row-label {
    padding: 0.55rem 0.65rem;
    font-size: 0.78rem;
  }

  .cmp-pill {
    font-size: 0.72rem;
    padding: 0.22rem 0.45rem;
  }
}
</style>
