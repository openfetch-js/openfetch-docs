---
layout: home
title: openFetch — HTTP client for the fetch era
titleTemplate: false
description: Interceptors, middleware, retry, and in-memory cache on standard fetch. For Node 18+, Bun, Deno, Workers, modern browsers, and the edge — without XHR.
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://openfetch-js.github.io/openfetch-docs/
  - - meta
    - property: og:locale
      content: en_US
  - - meta
    - property: og:title
      content: openFetch — HTTP client for the fetch era
  - - meta
    - property: og:description
      content: Interceptors, middleware, retry, and in-memory cache on standard fetch. Node 18+, browsers, and edge — no XHR dependency.
  - - meta
    - name: twitter:title
      content: openFetch — HTTP client for the fetch era
  - - meta
    - name: twitter:description
      content: Interceptors, middleware, retry, and cache on fetch. Node 18+, browsers, edge.

hero:
  name: openFetch
  text: HTTP client for the fetch era
  tagline: Interceptors, middleware, retry, and memory cache — zero hard dependency on XHR, built for Node 18+, browsers, and the edge.
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/@hamdymohamedak/openfetch
    - theme: alt
      text: GitHub
      link: https://github.com/openfetch-js/OpenFetch

features:
  - title: Fetch-only transport
    details: One code path on top of standard fetch — Node, Bun, Deno, Workers, and modern browsers without mandatory polyfills.
  - title: Interceptors & middleware
    details: Request/response interceptors plus composable middleware for auth, logging, retries, and caching in a predictable order.
  - title: Retry & in-memory cache
    details: Optional retry with backoff and GET/HEAD memory cache with TTL / SWR-style patterns when you opt in.
  - title: Structured errors & safety hooks
    details: OpenFetchError with stable codes, optional URL guard for untrusted URLs, and helpers for safe logging.
  - title: Tree-shakable entrypoints
    details: Import the core client or add plugins and the fluent sugar API from dedicated subpaths.
  - title: Server components friendly
    details: No window assumption — suitable for SSR, APIs, and React Server Components patterns.
---

## At a glance

<ComparisonMatrix />

## Same request — three HTTP clients

The [EscuelaJS categories API](https://api.escuelajs.co/api/v1/categories) returns a JSON array. Below: **openFetch**, **Axios**, and **ky**.

**openFetch** — shared defaults, structured response, and room for interceptors/middleware:

```ts
import openFetch from "@hamdymohamedak/openfetch";

const res = await openFetch.get(
  "https://api.escuelajs.co/api/v1/categories"
);
// res.data, res.status, res.headers, res.config
```

**Axios** — familiar API; different transport defaults in the browser:

```ts
import axios from "axios";

const res = await axios.get(
  "https://api.escuelajs.co/api/v1/categories"
);
// res.data, res.status, res.headers, res.config
```

**ky** — minimal API on top of `fetch`:

```ts
import ky from "ky";

const data = await ky
  .get("https://api.escuelajs.co/api/v1/categories")
  .json();
```

## Why developers reach for a client layer

- **Shared configuration** — `baseURL`, headers, timeouts, and `unwrapResponse` once per `createClient` instance.
- **Cross-cutting behavior** — attach auth, tracing, feature flags, and error normalization via interceptors and middleware.
- **Resilience** — retry policies and caching strategies without rewriting every call site.
- **Predictable errors** — map HTTP and network failures to typed errors instead of ad-hoc `try/catch` parsing.

openFetch targets teams that want those benefits **while staying on fetch** everywhere the platform already provides it.

## Documentation

1. [Getting started](./getting-started.md) — install, default export, `createClient`, first requests  
2. [HTTP methods](./http-methods.md) — GET, POST, PUT, PATCH, DELETE, `request()`, bodies and query params  
3. [React & Vue](./framework-guides.md) — hooks, composables, shared clients, RSC notes  
4. [Configuration](./configuration.md) — full request config, `rawResponse`, merge rules, helper exports  
5. [Plugins & fluent API](./getting-started.md#subpath-imports-tree-shaking) — `@hamdymohamedak/openfetch/plugins`, `@hamdymohamedak/openfetch/sugar`  
6. [Interceptors & middleware](./interceptors-middleware.md) — execution order, `dispatch` internals, `use()`, custom middleware  
7. [Retry & cache](./retry-cache.md) — retry budgets, idempotency, `createCacheMiddleware`, TTL / SWR  
8. [Errors & security](./errors-security.md) — `OpenFetchError`, codes, safe logging, `assertSafeHttpUrl`  

## Public API (summary)

| Export | Role |
|--------|------|
| **default** | Pre-built `createClient()` instance |
| `createClient` / `create` | New client with optional `initialDefaults` |
| `createFluentClient` | Callable fluent URL chains (from `/sugar`) |
| `retry`, `timeout`, `hooks`, `debug`, `strictFetch` | Middleware plugins (from `/plugins`) |
| `OpenFetchError`, `isOpenFetchError` | Typed errors + type guard |
| `InterceptorManager` | Low-level interceptor stack |
| `createRetryMiddleware` | Retry middleware factory |
| `MemoryCacheStore`, `createCacheMiddleware`, `appendCacheKeyVaryHeaders` | In-memory cache |
| `maskHeaderValues`, `cloneResponse`, idempotency helpers | Logging and retry ergonomics |
| Types | `OpenFetchConfig`, `OpenFetchResponse`, `Middleware`, `OpenFetchClient`, etc. |
| `assertSafeHttpUrl` | Optional SSRF-style guard for literal IP/localhost in URLs |

## Requirements

**Node.js 18+** or any runtime with `fetch` and `AbortController`.

## Source & package

- **GitHub:** [openfetch-js/OpenFetch](https://github.com/openfetch-js/OpenFetch)  
- **npm:** [@hamdymohamedak/openfetch](https://www.npmjs.com/package/@hamdymohamedak/openfetch)  

## Other languages

Browse [all translations](/languages/).
