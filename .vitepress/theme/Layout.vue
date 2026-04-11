<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, onUnmounted, watch } from "vue";
import HomeFetchAnimation from "../components/HomeFetchAnimation.vue";

const { Layout } = DefaultTheme;
const { page } = useData();

const isRootHome = computed(() => page.value.relativePath === "index.md");

watch(
  isRootHome,
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
    <template v-if="isRootHome" #home-hero-image>
      <HomeFetchAnimation />
    </template>
  </Layout>
</template>
