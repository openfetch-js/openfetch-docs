<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import openFetch from "@hamdymohamedak/openfetch";
import axios from "axios";
import ky from "ky";

const props = withDefaults(
  defineProps<{
    locale?: "en" | "ar";
  }>(),
  { locale: "en" }
);

const API = "https://api.escuelajs.co/api/v1/categories" as const;
const ROUNDS = 5;

type RowId = "openfetch" | "axios" | "ky";

type RowState = {
  status: "idle" | "loading" | "ok" | "error";
  ms: number | null;
  history: number[];
  detail: string;
  error: string;
};

const ORDER: RowId[] = ["openfetch", "axios", "ky"];

const rows = reactive<Record<RowId, RowState>>({
  openfetch: { status: "idle", ms: null, history: [], detail: "", error: "" },
  axios: { status: "idle", ms: null, history: [], detail: "", error: "" },
  ky: { status: "idle", ms: null, history: [], detail: "", error: "" },
});

const running = ref(false);
const roundIndex = ref(0);
const completedRounds = ref(0);

const copy = computed(() => {
  if (props.locale === "ar") {
    return {
      title: "قياس حي — نفس الـ API",
      subtitle:
        "خمس جولات؛ في كل جولة ثلاثة طلبات متوازية مع تعطيل التخزين المؤقت قدر الإمكان. نعرض المتوسط والحدود لكل عميل في جلستك الحالية.",
      run: "تشغيل القياس (٥ جولات)",
      running: "جارٍ القياس…",
      reset: "إعادة ضبط",
      idle: "لم يبدأ",
      loading: "جارٍ الجلب",
      ok: "نجاح",
      error: "خطأ",
      ms: "مللي ثانية",
      categories: "فئات",
      round: "الجولة",
      of: "من",
      statsTitle: "إحصائيات الجلسة",
      avg: "المتوسط",
      min: "الأدنى",
      max: "الأعلى",
      last: "آخر قياس",
      rankByAvg: "حسب متوسط الزمن (الأقل أسرع)",
      leader: "الأسرع في هذه الجلسة",
      openfetchNote: "fetch + استجابة موحّدة + معترضات/وسيط",
      axiosNote: "XHR افتراضي في المتصفح",
      kyNote: "غلاف صغير فوق fetch",
      footnote:
        "الزمن = شبكة + تحليل JSON في المتصفح؛ لا يقيس «جودة المكتبة» وحدها. استخدم النتائج كمؤشر إحساسي وليس معياراً معملياً.",
      resultLabel: "النتيجة",
      chartCaption: "متوسط الزمن النسبي (أطول شريط = أبطأ في المتوسط)",
      allComplete: "مكتملة",
    };
  }
  return {
    title: "Live benchmark — same API",
    subtitle:
      "Five rounds; each round fires three parallel GETs with cache-busting and no-store where supported. Averages and spread are from your current browser session only.",
    run: "Run 5-round benchmark",
    running: "Benchmarking…",
    reset: "Reset",
    idle: "Not run",
    loading: "Fetching",
    ok: "OK",
    error: "Error",
    ms: "ms",
    categories: "categories",
    round: "Round",
    of: "of",
    statsTitle: "Session statistics",
    avg: "Avg",
    min: "Min",
    max: "Max",
    last: "Last",
    rankByAvg: "By mean latency (lower is faster)",
    leader: "Fastest this session",
    openfetchNote: "fetch + unified response + interceptors / middleware",
    axiosNote: "default XHR adapter in browsers",
    kyNote: "tiny fetch wrapper",
    footnote:
      "Latency = network + JSON parse in the browser; it is not a pure library benchmark. Treat results as a feel check, not a lab score.",
    resultLabel: "Result",
    chartCaption: "Relative mean time (longer bar = slower on average)",
    allComplete: "complete",
  };
});

const rowLabels = computed(() => ({
  openfetch: { name: "openFetch", badge: "openFetch", brand: true },
  axios: { name: "Axios", badge: "Axios" },
  ky: { name: "ky", badge: "ky" },
}));

function bustUrl(round: number, id: RowId): string {
  const sep = API.includes("?") ? "&" : "?";
  return `${API}${sep}_bench=${round}-${id}-${Math.random().toString(36).slice(2)}`;
}

function resetRows() {
  for (const k of ORDER) {
    rows[k] = {
      status: "idle",
      ms: null,
      history: [],
      detail: "",
      error: "",
    };
  }
  roundIndex.value = 0;
  completedRounds.value = 0;
}

function summarizePayload(data: unknown): string {
  if (Array.isArray(data)) {
    return `${data.length} ${copy.value.categories}`;
  }
  if (data && typeof data === "object") {
    return `object (${Object.keys(data as object).length} keys)`;
  }
  return typeof data;
}

async function runOpenFetch(url: string): Promise<unknown> {
  const res = await openFetch.get(url, { cache: "no-store" });
  if (typeof res === "object" && res !== null && "data" in res) {
    return (res as { data: unknown }).data;
  }
  return res;
}

async function runAxios(url: string): Promise<unknown> {
  const res = await axios.get(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data;
}

async function runKy(url: string): Promise<unknown> {
  return ky.get(url, { cache: "no-store" }).json();
}

const runners: Record<RowId, (u: string) => Promise<unknown>> = {
  openfetch: runOpenFetch,
  axios: runAxios,
  ky: runKy,
};

async function measureOne(id: RowId, url: string) {
  rows[id].status = "loading";
  rows[id].error = "";
  const t0 = performance.now();
  try {
    const data = await runners[id](url);
    const t1 = performance.now();
    const ms = Math.round(t1 - t0);
    rows[id].ms = ms;
    rows[id].history.push(ms);
    rows[id].detail = summarizePayload(data);
    rows[id].status = "ok";
  } catch (e) {
    rows[id].status = "error";
    rows[id].error =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
  }
}

async function runAll() {
  if (running.value) return;
  running.value = true;
  resetRows();
  for (let r = 0; r < ROUNDS; r++) {
    roundIndex.value = r + 1;
    await Promise.all(ORDER.map((id) => measureOne(id, bustUrl(r, id))));
    completedRounds.value = r + 1;
  }
  running.value = false;
}

function statsFor(id: RowId) {
  const h = rows[id].history;
  if (!h.length) {
    return {
      avg: null as number | null,
      min: null as number | null,
      max: null as number | null,
    };
  }
  const sum = h.reduce((a, b) => a + b, 0);
  return {
    avg: Math.round(sum / h.length),
    min: Math.min(...h),
    max: Math.max(...h),
  };
}

const ranking = computed(() => {
  type Entry = { id: RowId; avg: number };
  const list: Entry[] = [];
  for (const id of ORDER) {
    if (rows[id].history.length !== ROUNDS) continue;
    const s = statsFor(id);
    if (s.avg == null) continue;
    list.push({ id, avg: s.avg });
  }
  list.sort((a, b) => a.avg - b.avg);
  let prev: number | null = null;
  let currentRank = 0;
  return list.map((e, i) => {
    if (prev === null || e.avg !== prev) {
      currentRank = i + 1;
      prev = e.avg;
    }
    return { ...e, rank: currentRank };
  });
});

const maxAvg = computed(() => {
  const avgs = ranking.value.map((r) => r.avg);
  if (!avgs.length) return 1;
  return Math.max(...avgs, 1);
});

const leaderId = computed(() => ranking.value[0]?.id ?? null);

const leaderIsTie = computed(() => {
  const r = ranking.value;
  if (r.length < 2) return false;
  return r[0].avg === r[1].avg;
});
</script>

<template>
  <div class="live-bench" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="live-bench__head">
      <h3 class="live-bench__title">{{ copy.title }}</h3>
      <p class="live-bench__sub">{{ copy.subtitle }}</p>
      <p class="live-bench__api">
        <a :href="API" target="_blank" rel="noreferrer noopener">{{ API }}</a>
      </p>
      <div class="live-bench__actions">
        <button
          type="button"
          class="live-bench__btn live-bench__btn--primary"
          :disabled="running"
          @click="runAll"
        >
          {{ running ? copy.running : copy.run }}
        </button>
        <button
          type="button"
          class="live-bench__btn"
          :disabled="running"
          @click="resetRows"
        >
          {{ copy.reset }}
        </button>
      </div>
      <div
        v-if="running || completedRounds > 0"
        class="live-bench__round"
        aria-live="polite"
      >
        <span class="live-bench__round-label">
          {{
            running
              ? `${copy.round} ${roundIndex} ${copy.of} ${ROUNDS}`
              : `${completedRounds} ${copy.of} ${ROUNDS} ${copy.allComplete}`
          }}
        </span>
        <div class="live-bench__round-track">
          <div
            class="live-bench__round-fill"
            :style="{ width: `${(completedRounds / ROUNDS) * 100}%` }"
          />
        </div>
      </div>
    </div>

    <div class="live-bench__grid">
      <article
        v-for="id in ORDER"
        :key="id"
        class="live-bench__card"
        :class="{
          'live-bench__card--highlight': rowLabels[id].brand,
          'live-bench__card--loading': rows[id].status === 'loading',
          'live-bench__card--ok': rows[id].status === 'ok',
          'live-bench__card--err': rows[id].status === 'error',
          'live-bench__card--leader':
            !running &&
            leaderId === id &&
            !leaderIsTie &&
            rows[id].history.length === ROUNDS,
        }"
      >
        <div class="live-bench__card-top">
          <span
            class="live-bench__badge"
            :class="{ 'live-bench__badge--brand': rowLabels[id].brand }"
            >{{ rowLabels[id].badge }}</span
          >
          <span class="live-bench__status" :data-state="rows[id].status">
            {{
              rows[id].status === "idle"
                ? copy.idle
                : rows[id].status === "loading"
                  ? copy.loading
                  : rows[id].status === "ok"
                    ? copy.ok
                    : copy.error
            }}
          </span>
        </div>
        <div
          v-if="
            leaderId === id &&
            !leaderIsTie &&
            rows[id].history.length === ROUNDS &&
            !running
          "
          class="live-bench__ribbon"
        >
          {{ copy.leader }}
        </div>
        <h4 class="live-bench__name">{{ rowLabels[id].name }}</h4>
        <p class="live-bench__note">
          {{
            id === "openfetch"
              ? copy.openfetchNote
              : id === "axios"
                ? copy.axiosNote
                : copy.kyNote
          }}
        </p>
        <div class="live-bench__meter" aria-hidden="true">
          <div
            class="live-bench__meter-bar"
            :class="{ active: rows[id].status === 'loading' }"
          />
        </div>
        <dl class="live-bench__meta">
          <div>
            <dt>{{ copy.last }}</dt>
            <dd>{{ rows[id].ms != null ? rows[id].ms : "—" }}</dd>
          </div>
          <div>
            <dt>{{ copy.avg }}</dt>
            <dd>{{ statsFor(id).avg != null ? statsFor(id).avg : "—" }}</dd>
          </div>
          <div>
            <dt>{{ copy.min }} / {{ copy.max }}</dt>
            <dd>
              {{
                statsFor(id).min != null
                  ? `${statsFor(id).min} · ${statsFor(id).max}`
                  : "—"
              }}
            </dd>
          </div>
          <div>
            <dt>{{ copy.resultLabel }}</dt>
            <dd>{{ rows[id].detail || "—" }}</dd>
          </div>
        </dl>
        <p v-if="rows[id].error" class="live-bench__err">{{ rows[id].error }}</p>
      </article>
    </div>

    <section
      v-if="ranking.length && !running"
      class="live-bench__stats"
      aria-labelledby="bench-stats-title"
    >
      <h4 id="bench-stats-title" class="live-bench__stats-title">
        {{ copy.statsTitle }}
      </h4>
      <p class="live-bench__stats-hint">{{ copy.rankByAvg }}</p>
      <ul class="live-bench__rank-list">
        <li v-for="r in ranking" :key="r.id" class="live-bench__rank-row">
          <span class="live-bench__rank-num">#{{ r.rank }}</span>
          <span class="live-bench__rank-name">{{ rowLabels[r.id].name }}</span>
          <span class="live-bench__rank-avg">{{ r.avg }} {{ copy.ms }}</span>
          <div class="live-bench__bar-wrap">
            <div
              class="live-bench__bar"
              :class="{ 'live-bench__bar--brand': rowLabels[r.id].brand }"
              :style="{ width: `${Math.max(8, (r.avg / maxAvg) * 100)}%` }"
            />
          </div>
        </li>
      </ul>
      <p class="live-bench__chart-cap">{{ copy.chartCaption }}</p>
    </section>

    <p class="live-bench__foot">{{ copy.footnote }}</p>
  </div>
</template>

<style scoped>
.live-bench {
  margin: 2rem 0;
  padding: 1.5rem 1.25rem 1.25rem;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: linear-gradient(
    145deg,
    var(--vp-c-bg-soft) 0%,
    var(--vp-c-bg) 100%
  );
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06);
}

.dark .live-bench {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.live-bench__head {
  margin-bottom: 1.25rem;
}

.live-bench__title {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.live-bench__sub {
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.55;
}

.live-bench__api {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  word-break: break-all;
}

.live-bench__api a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.live-bench__api a:hover {
  text-decoration: underline;
}

.live-bench__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.live-bench__round {
  display: grid;
  gap: 0.35rem;
}

.live-bench__round-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.live-bench__round-track {
  height: 6px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.live-bench__round-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand-3),
    var(--vp-c-brand-1)
  );
  transition: width 0.35s ease;
}

.live-bench__btn {
  appearance: none;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.15s ease;
}

.live-bench__btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.live-bench__btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.live-bench__btn--primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.live-bench__btn--primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.live-bench__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.live-bench__card {
  position: relative;
  padding: 1rem 1rem 0.85rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
  transition:
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    transform 0.35s ease;
}

.live-bench__card--highlight {
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1);
}

.live-bench__card--leader {
  border-color: rgba(22, 163, 74, 0.55);
  box-shadow: 0 10px 32px rgba(22, 163, 74, 0.12);
}

.live-bench__card--loading {
  border-color: var(--vp-c-brand-3);
  box-shadow: 0 8px 28px rgba(37, 99, 235, 0.12);
  transform: translateY(-2px);
}

.live-bench__card--ok {
  border-color: rgba(22, 163, 74, 0.35);
}

.live-bench__card--err {
  border-color: rgba(220, 38, 38, 0.5);
}

.live-bench__ribbon {
  position: absolute;
  top: 0.65rem;
  inset-inline-end: -2.25rem;
  transform: rotate(42deg);
  transform-origin: center;
  background: linear-gradient(90deg, #16a34a, #22c55e);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 2.5rem;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.35);
  pointer-events: none;
}

[dir="rtl"] .live-bench__ribbon {
  transform: rotate(-42deg);
  inset-inline-end: auto;
  inset-inline-start: -2.25rem;
}

.live-bench__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.live-bench__badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.live-bench__badge--brand {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.live-bench__status {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.live-bench__status[data-state="loading"] {
  color: var(--vp-c-brand-1);
  animation: live-bench-pulse 1.1s ease-in-out infinite;
}

.live-bench__status[data-state="ok"] {
  color: #16a34a;
}

.live-bench__status[data-state="error"] {
  color: #dc2626;
}

@keyframes live-bench-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

.live-bench__name {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 700;
}

.live-bench__note {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  line-height: 1.45;
  min-height: 2.8em;
}

.live-bench__meter {
  height: 4px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.live-bench__meter-bar {
  height: 100%;
  width: 0%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand-3),
    var(--vp-c-brand-1)
  );
  transition: width 0.25s ease;
}

.live-bench__meter-bar.active {
  width: 42%;
  animation: live-bench-indeterminate 1.05s ease-in-out infinite;
}

@keyframes live-bench-indeterminate {
  0% {
    transform: translateX(-240%);
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(240%);
    opacity: 0.65;
  }
}

.live-bench__meta {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.78rem;
}

.live-bench__meta div {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.live-bench__meta dt {
  margin: 0;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.live-bench__meta dd {
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: end;
}

.live-bench__err {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #dc2626;
  line-height: 1.4;
}

.live-bench__stats {
  margin-top: 1.5rem;
  padding: 1.1rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.live-bench__stats-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
}

.live-bench__stats-hint {
  margin: 0 0 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.live-bench__rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.live-bench__rank-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.25rem 0.65rem;
  align-items: center;
}

.live-bench__rank-num {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}

.live-bench__rank-name {
  font-weight: 600;
  font-size: 0.88rem;
}

.live-bench__rank-avg {
  font-size: 0.82rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
}

.live-bench__bar-wrap {
  grid-column: 1 / -1;
  height: 8px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.live-bench__bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #64748b, #94a3b8);
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.live-bench__bar--brand {
  background: linear-gradient(
    90deg,
    var(--vp-c-brand-3),
    var(--vp-c-brand-1)
  );
}

.live-bench__chart-cap {
  margin: 0.85rem 0 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.live-bench__foot {
  margin: 1.25rem 0 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>
