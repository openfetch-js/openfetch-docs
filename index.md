# openFetch

**@hamdymohamedak/openfetch** is a small, dependency-free HTTP client for any JavaScript runtime that exposes the standard [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API. It gives you instances with defaults, request/response **interceptors**, composable **middleware**, optional **retry** with backoff, **in-memory caching** for GET/HEAD, structured **errors**, and an optional **URL guard** for untrusted URLs — without tying you to React, `window`, or legacy XHR.

## Source & package

- **GitHub:** [openfetch-js/OpenFetch](https://github.com/openfetch-js/OpenFetch) — source code, issues, and contributions  
- **npm:** [@hamdymohamedak/openfetch](https://www.npmjs.com/package/@hamdymohamedak/openfetch) — install the published package  

## Design goals

- **One transport:** `fetch` only (Node 18+, Bun, Deno, Workers, browsers).
- **No required polyfills** on supported environments.
- **Server-safe:** suitable for SSR and React Server Components.

## Documentation

1. [Getting started](./getting-started.md) — install, default export, `createClient`, first requests  
2. [HTTP methods](./http-methods.md) — GET, POST, PUT, PATCH, DELETE, `request()`, bodies and query params  
3. [React & Vue](./framework-guides.md) — hooks, composables, shared clients, RSC notes  
4. [Configuration](./configuration.md) — full request config, `rawResponse`, merge rules, helper exports  
5. [Plugins & fluent API](./plugins-fluent.md) — `@hamdymohamedak/openfetch/plugins`, `@hamdymohamedak/openfetch/sugar`, stack order  
6. [Interceptors & middleware](./interceptors-middleware.md) — execution order, `dispatch` internals, `use()`, custom middleware  
7. [Architecture & internals](./architecture.md) — diagrams, Axios comparison, design notes, annotated `retry` / `cache` sources  
8. [Retry & cache](./retry-cache.md) — retry budgets, idempotency, `createCacheMiddleware`, TTL / SWR  
9. [Errors & security](./errors-security.md) — `OpenFetchError`, codes, safe logging, `assertSafeHttpUrl`  

## Public API (summary)

| Export | Role |
|--------|------|
| **default** | Pre-built `createClient()` instance |
| `createClient` / `create` | New client with optional `initialDefaults` |
| `createFluentClient` | Callable fluent URL chains (also from `/sugar` subpath) |
| `retry`, `timeout`, `hooks`, `debug`, `strictFetch` | Middleware plugins (from `/plugins` subpath) |
| `OpenFetchError`, `isOpenFetchError` | Typed errors + type guard |
| `InterceptorManager` | Low-level interceptor stack (usually via `client.interceptors`) |
| `createRetryMiddleware` | Retry middleware factory |
| `MemoryCacheStore`, `createCacheMiddleware`, `appendCacheKeyVaryHeaders` | In-memory cache |
| `maskHeaderValues`, `cloneResponse`, idempotency helpers | Logging and retry ergonomics |
| Types | `OpenFetchConfig`, `OpenFetchResponse`, `Middleware`, `OpenFetchClient`, etc. |
| `assertSafeHttpUrl` | Optional SSRF-style guard for literal IP/localhost in URLs |

## Requirements

**Node.js 18+** or any runtime with `fetch` and `AbortController`.

## Other languages

Browse [all translations](/languages/).
