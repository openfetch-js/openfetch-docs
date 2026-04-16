<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import VPButton from "vitepress/dist/client/theme-default/components/VPButton.vue";
import { withBase } from "vitepress";
import { OPENFETCH_VERSION } from "../openfetch-version";

const DOCS = "https://openfetch-js.github.io/openfetch-docs/";
const LLMS = "https://openfetch-js.github.io/openfetch-docs/llms.txt";

/** Same-origin URL so `fetch` works with the configured VitePress `base`. */
const llmsFetchUrl = withBase("/llms.txt");

const copyLlmsStatus = ref<"idle" | "copied" | "error">("idle");
const copyLlmsBusy = ref(false);
let copyLlmsStatusTimer: ReturnType<typeof setTimeout> | undefined;

async function copyLlmsToClipboard() {
  if (copyLlmsBusy.value) return;
  copyLlmsBusy.value = true;
  copyLlmsStatus.value = "idle";
  if (copyLlmsStatusTimer !== undefined) clearTimeout(copyLlmsStatusTimer);

  try {
    const res = await fetch(llmsFetchUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    await navigator.clipboard.writeText(text);
    copyLlmsStatus.value = "copied";
  } catch {
    copyLlmsStatus.value = "error";
  } finally {
    copyLlmsBusy.value = false;
    copyLlmsStatusTimer = setTimeout(() => {
      copyLlmsStatus.value = "idle";
      copyLlmsStatusTimer = undefined;
    }, 2500);
  }
}

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

onUnmounted(() => {
  if (copyLlmsStatusTimer !== undefined) clearTimeout(copyLlmsStatusTimer);
});
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
      Pre-fills a prompt that points at the docs site and
      <button
        type="button"
        class="of-home-ask-ai-llms-copy"
        :disabled="copyLlmsBusy"
        title="Copy llms.txt contents to clipboard"
        @click="copyLlmsToClipboard"
      >
        <code>llms.txt</code>
      </button>. If the message box is empty, paste the prompt from the address bar or type it
      manually — URL prefill behavior depends on the product.
      <span
        v-if="copyLlmsStatus !== 'idle'"
        class="of-home-ask-ai-copy-feedback"
        role="status"
        aria-live="polite"
      >
        {{
          copyLlmsStatus === "copied"
            ? "Copied llms.txt to clipboard."
            : "Could not copy — try opening llms.txt in a new tab."
        }}
      </span>
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
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
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

.of-home-ask-ai-llms-copy {
  display: inline;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  vertical-align: baseline;
}

.of-home-ask-ai-llms-copy:disabled {
  cursor: wait;
  opacity: 0.75;
}

.of-home-ask-ai-llms-copy code {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  color: var(--vp-c-brand-1);
}

.of-home-ask-ai-llms-copy:hover:not(:disabled) code {
  color: var(--vp-c-brand-2);
}

.of-home-ask-ai-copy-feedback {
  display: block;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
</style>
