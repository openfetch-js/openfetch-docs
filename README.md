# openFetch documentation

Multilingual documentation for **`@hamdymohamedak/openfetch`** (fetch-only HTTP client: interceptors, middleware, retry, memory cache, RSC-friendly).

**Package source:** `../openFetch` (sibling folder in this workspace).

## Documentation website (VitePress)

This folder is a **[VitePress](https://vitepress.dev/)** site. Markdown sources live in locale directories (`en/`, `es/`, …); the home page is [`index.md`](./index.md).

### Commands

```bash
cd openFetchDocs
npm install
npm run dev      # local dev server (default http://localhost:5173)
npm run build    # static output → .vitepress/dist
npm run preview  # serve the production build locally
```

### Deploying the static site

After `npm run build`, upload **`.vitepress/dist`** to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).

If the site is served from a **subpath** (for example `https://example.com/openfetch/`), set `base` in [`.vitepress/config.mts`](./.vitepress/config.mts):

```ts
export default defineConfig({
  base: "/openfetch/",
  // ...
});
```

### Locales

| Path prefix | Language |
|-------------|----------|
| `/en/` | English |
| `/es/` | Spanish |
| `/fa/` | Persian (Farsi), RTL |
| `/fr/` | French |
| `/hi/` | Hindi |
| `/it/` | Italian |
| `/ja/` | Japanese |
| `/kr/` | Korean (HTML `lang` is `ko`) |
| `/ku/` | Kurdish |

The **root** `/` page is a language hub. Each locale sidebar includes a link back to that hub.

### Source layout (every locale)

1. **`index.md`** — Overview and reading order  
2. **`getting-started.md`** — Install, default client, `createClient`, quick examples  
3. **`configuration.md`** — `OpenFetchConfig`, URL building, body/headers, `RequestInit`, merging  
4. **`interceptors-middleware.md`** — Request/response interceptors, `use()`, middleware chain  
5. **`retry-cache.md`** — `createRetryMiddleware`, `MemoryCacheStore`, `createCacheMiddleware`, cache keys  
6. **`errors-security.md`** — `OpenFetchError`, error codes, `toShape` / logging, `assertSafeHttpUrl`  

### Package version

Docs are aligned with the library’s public API as of **v0.2.x**. For runtime behavior details and file-level architecture, see `openFetch/docs/PROJECT_FLOW.md`.
