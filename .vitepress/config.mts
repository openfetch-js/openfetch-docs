import { defineConfig } from "vitepress";

type Lang = "en" | "es" | "fa" | "fr" | "hi" | "it" | "ja" | "kr" | "ku";

const LANGS: Lang[] = ["en", "es", "fa", "fr", "hi", "it", "ja", "kr", "ku"];

const LABELS: Record<
  Lang,
  {
    home: string;
    gettingStarted: string;
    configuration: string;
    interceptors: string;
    retryCache: string;
    errorsSecurity: string;
  }
> = {
  en: {
    home: "Overview",
    gettingStarted: "Getting started",
    configuration: "Configuration",
    interceptors: "Interceptors & middleware",
    retryCache: "Retry & cache",
    errorsSecurity: "Errors & security",
  },
  es: {
    home: "Resumen",
    gettingStarted: "Primeros pasos",
    configuration: "Configuración",
    interceptors: "Interceptores y middleware",
    retryCache: "Reintentos y caché",
    errorsSecurity: "Errores y seguridad",
  },
  fa: {
    home: "نمای کلی",
    gettingStarted: "شروع سریع",
    configuration: "پیکربندی",
    interceptors: "قطع‌کننده‌ها و میان‌افزار",
    retryCache: "تلاش مجدد و حافظهٔ نهان",
    errorsSecurity: "خطا و امنیت",
  },
  fr: {
    home: "Aperçu",
    gettingStarted: "Démarrage",
    configuration: "Configuration",
    interceptors: "Intercepteurs et middleware",
    retryCache: "Nouvelles tentatives et cache",
    errorsSecurity: "Erreurs et sécurité",
  },
  hi: {
    home: "अवलोकन",
    gettingStarted: "शुरुआत",
    configuration: "कॉन्फ़िगरेशन",
    interceptors: "इंटरसेप्टर और मिडलवेयर",
    retryCache: "रीट्राई और कैश",
    errorsSecurity: "त्रुटियाँ और सुरक्षा",
  },
  it: {
    home: "Panoramica",
    gettingStarted: "Introduzione",
    configuration: "Configurazione",
    interceptors: "Intercettori e middleware",
    retryCache: "Retry e cache",
    errorsSecurity: "Errori e sicurezza",
  },
  ja: {
    home: "概要",
    gettingStarted: "はじめに",
    configuration: "設定",
    interceptors: "インターセプターとミドルウェア",
    retryCache: "リトライとキャッシュ",
    errorsSecurity: "エラーとセキュリティ",
  },
  kr: {
    home: "개요",
    gettingStarted: "시작하기",
    configuration: "설정",
    interceptors: "인터셉터와 미들웨어",
    retryCache: "재시도와 캐시",
    errorsSecurity: "오류와 보안",
  },
  ku: {
    home: "Kurtebînî",
    gettingStarted: "Destpêk",
    configuration: "Veavakirin",
    interceptors: "Interceptors û middleware",
    retryCache: "Retry û cache",
    errorsSecurity: "Çewtî û ewlehî",
  },
};

const LANG_HOME_LABEL: Record<Lang, string> = {
  en: "Languages",
  es: "Idiomas",
  fa: "زبان‌ها",
  fr: "Langues",
  hi: "भाषाएँ",
  it: "Lingue",
  ja: "言語",
  kr: "언어",
  ku: "Ziman",
};

function sidebarFor(lang: Lang) {
  const L = LABELS[lang];
  const p = `/${lang}`;
  return [
    {
      text: "openFetch",
      items: [
        { text: LANG_HOME_LABEL[lang], link: "/" },
        { text: L.home, link: `${p}/` },
        { text: L.gettingStarted, link: `${p}/getting-started` },
        { text: L.configuration, link: `${p}/configuration` },
        { text: L.interceptors, link: `${p}/interceptors-middleware` },
        { text: L.retryCache, link: `${p}/retry-cache` },
        { text: L.errorsSecurity, link: `${p}/errors-security` },
      ],
    },
  ];
}

const localeConfigs = Object.fromEntries(
  LANGS.map((code) => {
    const langAttr =
      code === "kr" ? "ko" : code === "ku" ? "ku" : code;
    const label =
      code === "en"
        ? "English"
        : code === "es"
          ? "Español"
          : code === "fa"
            ? "فارسی"
            : code === "fr"
              ? "Français"
              : code === "hi"
                ? "हिन्दी"
                : code === "it"
                  ? "Italiano"
                  : code === "ja"
                    ? "日本語"
                    : code === "kr"
                      ? "한국어 (kr)"
                      : "Kurdî";
    const entry: {
      label: string;
      lang: string;
      link: string;
      dir?: "ltr" | "rtl";
      themeConfig: { sidebar: ReturnType<typeof sidebarFor>; outline: { level: [number, number] } };
    } = {
      label,
      lang: langAttr,
      link: `/${code}/`,
      themeConfig: {
        sidebar: sidebarFor(code),
        outline: { level: [2, 3] },
      },
    };
    if (code === "fa") entry.dir = "rtl";
    return [code, entry];
  })
) as Record<string, { label: string; lang: string; link: string; themeConfig: object }>;

export default defineConfig({
  title: "openFetch",
  description:
    "Documentation for @hamdymohamedak/openfetch — fetch-based HTTP client with interceptors, middleware, retry, and cache.",
  srcExclude: ["README.md"],
  lastUpdated: true,
  themeConfig: {
    search: { provider: "local" },
    socialLinks: [],
    footer: {
      message: "MIT · @hamdymohamedak/openfetch",
    },
  },
  locales: {
    root: {
      label: "Languages",
      lang: "en",
      themeConfig: {
        nav: [{ text: "Docs", link: "/en/" }],
        sidebar: [
          {
            text: "Documentation",
            items: LANGS.map((code) => ({
              text: localeConfigs[code].label,
              link: `/${code}/`,
            })),
          },
        ],
      },
    },
    ...localeConfigs,
  },
});
