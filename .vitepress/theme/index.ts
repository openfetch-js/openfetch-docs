import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ComparisonMatrix from "../components/ComparisonMatrix.vue";
import LiveFetchBench from "../components/LiveFetchBench.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ComparisonMatrix", ComparisonMatrix);
    app.component("LiveFetchBench", LiveFetchBench);
  },
} satisfies Theme;
