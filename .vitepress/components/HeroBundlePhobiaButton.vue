<script setup lang="ts">
import { computed } from "vue";
import VPButton from "vitepress/dist/client/theme-default/components/VPButton.vue";
import { OPENFETCH_NPM_PACKAGE, OPENFETCH_VERSION } from "../openfetch-version";

const bundlephobiaHref = computed(
  () =>
    `https://bundlephobia.com/package/${OPENFETCH_NPM_PACKAGE}@${OPENFETCH_VERSION}`,
);
</script>

<template>
  <div class="of-hero-bundle-phobia">
    <VPButton
      tag="a"
      size="medium"
      theme="alt"
      text="Bundle Size"
      :href="bundlephobiaHref"
      target="_blank"
      rel="noopener noreferrer"
    />
  </div>
</template>

<style scoped>
.of-hero-bundle-phobia {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 2px;
}

.of-hero-bundle-phobia :deep(.VPButton) {
  min-height: 40px;
}
</style>
