<script setup lang="ts">
import { computed } from "vue";
import VPButton from "vitepress/dist/client/theme-default/components/VPButton.vue";
import { OPENFETCH_VERSION } from "../openfetch-version";

const DOCS = "https://openfetch-js.github.io/openfetch-docs/";
const LLMS = "https://openfetch-js.github.io/openfetch-docs/llms.txt";

function buildPrompt(who: "ChatGPT" | "Claude") {
  const hi = who === "ChatGPT" ? "Hi ChatGPT!" : "Hi Claude!";
  return `${hi} Can you please read [the openFetch documentation](${DOCS}) and [the LLM context file (llms.txt)](${LLMS}), then prepare to answer questions about @hamdymohamedak/openfetch v${OPENFETCH_VERSION}?`;
}

const chatgptHref = computed(
  () => `https://chatgpt.com/?q=${encodeURIComponent(buildPrompt("ChatGPT"))}`,
);

const claudeHref = computed(
  () => `https://claude.ai/new?q=${encodeURIComponent(buildPrompt("Claude"))}`,
);
</script>

<template>
  <div class="of-home-ask-ai">
    <p class="of-home-ask-ai-label">Open in your assistant</p>
    <div class="actions">
      <div class="action">
        <VPButton
          tag="a"
          size="medium"
          theme="alt"
          text="Ask ChatGPT"
          :href="chatgptHref"
        />
      </div>
      <div class="action">
        <VPButton
          tag="a"
          size="medium"
          theme="alt"
          text="Ask Claude"
          :href="claudeHref"
        />
      </div>
    </div>
    <p class="of-home-ask-ai-hint">
      Pre-fills a prompt that points at the docs site and <code>llms.txt</code>. If the
      message box is empty, paste the prompt from the address bar or type it manually —
      URL prefill behavior depends on the product.
    </p>
  </div>
</template>

<style scoped>
.of-home-ask-ai {
  margin-top: 4px;
  max-width: 576px;
}

.of-home-ask-ai-label {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
}

.action {
  flex-shrink: 0;
  padding: 6px;
}

.of-home-ask-ai-hint {
  margin: 8px 6px 0;
  max-width: 42rem;
  font-size: 12px;
  line-height: 1.45;
  color: var(--vp-c-text-3);
}

.of-home-ask-ai-hint code {
  font-size: 0.92em;
}
</style>
