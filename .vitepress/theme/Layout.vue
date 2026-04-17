<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, onUnmounted, watch } from "vue";
import HeroCodeTyper from "../components/HeroCodeTyper.vue";
import HeroBundlePhobiaButton from "../components/HeroBundlePhobiaButton.vue";
import HeroNpmDownloads from "../components/HeroNpmDownloads.vue";
import HomeAskAiButtons from "../components/HomeAskAiButtons.vue";

const { Layout } = DefaultTheme;
const { page } = useData();

/** Locale hub homes (e.g. `ar/index.md`) plus English `index.md` — not `languages/index.md`. */
const isLocaleHome = computed(() => {
  const p = page.value.relativePath;
  if (p === "index.md") return true;
  return /^[a-z]{2}\/index\.md$/.test(p);
});

watch(
  isLocaleHome,
  (v) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("of-docs-root-home", v);
  },
  { immediate: true }
);

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("of-docs-root-home");
  }
});
</script>

<template>
  <Layout>
    <template v-if="isLocaleHome" #home-hero-info-after>
      <HeroCodeTyper />
    </template>
    <template v-if="isLocaleHome" #home-hero-actions-after>
      <HomeAskAiButtons />
      <HeroBundlePhobiaButton />
      <HeroNpmDownloads />
    </template>
  </Layout>
</template>
