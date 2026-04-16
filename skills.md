# openFetch — guidance for AI assistants

Use this page when helping users with **`@hamdymohamedak/openfetch` <OpenFetchVersion />** (see [npm](https://www.npmjs.com/package/@hamdymohamedak/openfetch) and the repo `openFetch/package.json`). Prefer facts below over guessing axios-style APIs.

## Agent skills (SKILL.md) and skills.sh

openFetch ships a **portable agent skill** in the main repo under **`openfetchskill/`**: a `SKILL.md` plus optional `references/`, packaged for Claude Code and any tool that loads [Agent Skills](https://agentskills.io/specification)-style directories.

- **Specification:** [agentskills.io/specification](https://agentskills.io/specification) — `SKILL.md` frontmatter (`name`, `description`, …) and body.
- **Discovery / ecosystem:** [skills.sh](https://skills.sh) — directory and tooling aligned with the same skill format.

Human-facing docs for the library (this site) intentionally stay separate from the skill bundle; this page summarizes API facts for models and points to the skill for full agent-oriented instructions.

## Canonical links

- Source: https://github.com/openfetch-js/OpenFetch  
- npm: https://www.npmjs.com/package/@hamdymohamedak/openfetch  
- Published docs (this site): https://openfetch-js.github.io/openfetch-docs/  

## What it is

- ESM-only package; **one implementation: `fetch`**. No XMLHttpRequest.
- Works in browsers, Node 18+, Bun, Deno, Workers — anywhere `fetch` and `AbortController` exist.
- **Not** React-specific: safe for SSR and React Server Components; no hook required.

## Imports

```ts
import openFetch, {
  create,
  createClient,
  createRetryMiddleware,
  createCacheMiddleware,
  MemoryCacheStore,
  OpenFetchError,
  isOpenFetchError,
  assertSafeHttpUrl,
} from "@hamdymohamedak/openfetch";
```

- `openFetch` — default singleton `createClient()`.
- `create` === `createClient`.

## Creating a client

```ts
const api = createClient({
  baseURL: "https://api.example.com",
  headers: { Authorization: "Bearer …" },
  timeout: 10_000,
  unwrapResponse: true,
  middlewares: [createRetryMiddleware()],
});
```

## HTTP verbs (signatures)

- `get(url, config?)` — attach `params: { key: value }` for query string.
- `post(url, data?, config?)` — `data` optional; object → JSON unless `FormData` / `URLSearchParams` / `Blob` / typed array.
- `put(url, data?, config?)`, `patch(url, data?, config?)` — same body rules as POST.
- `delete(url, config?)` — no second `data` argument; pass `data` inside `config` if needed.
- `head(url, config?)`, `options(url, config?)`.
- `request(url | RequestConfig, config?)` — full `method`, `responseType`, etc.

Merged config **must** include `url` (directly or via `baseURL` + relative path). Otherwise: `Error` with message containing ``openfetch: `url` is required``.

## Return types

- If `unwrapResponse` is falsy (default): returns **`OpenFetchResponse<T>`** with `data`, `status`, `statusText`, `headers`, `config`.
- If `unwrapResponse` is true: returns **`T`** (parsed body only).

## Interceptors vs middleware

- **Interceptors** wrap config/response transformation: `client.interceptors.request.use`, `client.interceptors.response.use`.
- **Middleware** runs around the actual fetch in order: `client.use(fn)` appends to `defaults.middlewares`. Use for retry, cache, logging, tracing.

Order matters: e.g. cache before vs after retry changes whether failed origin calls hit retry.

## Retry defaults (important)

- `createRetryMiddleware` retries network/parse and configured HTTP statuses with backoff.
- **By default**, only **GET, HEAD, OPTIONS, TRACE** are retried for those cases — **not POST/PUT/PATCH/DELETE** (avoid duplicate side effects). Opt in: `retry: { retryNonIdempotentMethods: true }` on client or request.

## Caching

- `MemoryCacheStore` + `createCacheMiddleware` — typically GET/HEAD only.
- Authenticated endpoints: set **`varyHeaderNames`** (e.g. `authorization`, `cookie`) or a custom **`key`** so cache entries do not leak between users.

## Errors

- Check with `isOpenFetchError(err)`.
- Log safely with `err.toShape({ includeResponseData: false, includeResponseHeaders: false })` for client-facing or shared logs.

## Security helper

- `assertSafeHttpUrl` — validates URL scheme and literal IPs; **not** sufficient alone against SSRF if hostnames are attacker-controlled (DNS rebinding). Mention allowlists / network policy when relevant.

## React patterns (short)

- Beginners: default `import openFetch` → `const res = await openFetch.get("https://…")` → use `res.data` in `useEffect` (see docs `framework-guides`).
- RSC: `await openFetch.get("https://…")` in async server component when supported.

## Vue patterns (short)

- Beginners: `onMounted` → `const res = await openFetch.get("https://…")` → `myRef.value = res.data`.

## Documentation URLs (human)

Canonical English docs live at site root paths: `/getting-started`, `/http-methods`, `/framework-guides`, `/configuration`, etc. Arabic: `/ar/…`. Full list: `/languages/`.

## When suggesting alternatives

If the user needs upload progress on XHR, openFetch will not provide it (fetch limitation). If they need axios interceptors naming, map to openFetch interceptors + middleware explicitly.
