# Plugins & fluent API

openFetch ships two **optional entrypoints** besides the main package:

| Import path | Purpose |
|-------------|---------|
| `@hamdymohamedak/openfetch` | Default client, `createClient`, errors, retry/cache factories, helpers |
| `@hamdymohamedak/openfetch/plugins` | Small **middleware plugins**: `retry`, `timeout`, `hooks`, `debug`, `strictFetch` |
| `@hamdymohamedak/openfetch/sugar` | **`createFluentClient`** — lazy chain API (Wretch-style) |

All paths are declared in the package **`exports`** map, so bundlers can **tree-shake** unused code when you import only what you need.

---

## Plugins (`@hamdymohamedak/openfetch/plugins`)

Each plugin is a function that returns a **`Middleware`**. Register with **`client.use()`** (or `createFluentClient(...).use(...)`).

### Recommended stack order

1. **`retry(...)`** — outermost among these so each retry runs the full inner stack (including per-request timeout).
2. **`timeout(ms)`** — sets `ctx.request.timeout` before `next()`; the actual abort happens in **`dispatch`** via `AbortController`.
3. **`hooks(...)`** or **`debug(...)`** — logging / side effects around the pipeline.

From the main README: register **`retry` before `timeout`** so retries wrap the inner work correctly.

### `retry(options?)`

Thin wrapper around **`createRetryMiddleware`**. Accepts the same options plus an **`attempts`** alias for **`maxAttempts`**:

```ts
import { createClient } from "@hamdymohamedak/openfetch";
import { retry, timeout } from "@hamdymohamedak/openfetch/plugins";

const client = createClient({ baseURL: "https://api.example.com" })
  .use(retry({ attempts: 3, baseDelayMs: 400 }))
  .use(timeout(15_000));
```

Equivalent core import:

```ts
import { createRetryMiddleware } from "@hamdymohamedak/openfetch";
// .use(createRetryMiddleware({ maxAttempts: 3, baseDelayMs: 400 }))
```

See [Retry & cache](./retry-cache.md) for **`timeoutTotalMs`**, **`enforceTotalTimeout`**, **`timeoutPerAttemptMs`**, and POST **idempotency** behavior.

### `timeout(ms)`

Sets **`request.timeout`** for the in-flight round trip. Does not implement timers itself — **`dispatch`** merges this with your **`signal`**.

### `hooks({ onRequest?, onResponse?, onError? })`

- **`onRequest`** — runs before `next()` (after earlier middleware has run).
- **`onResponse`** — after successful `next()` when **`ctx.response`** is set.
- **`onError`** — when `next()` throws; error is rethrown after the hook.

Use **interceptors** when you need to **transform** config or responses; use **hooks** for **telemetry** or side effects without changing the payload shape.

### `debug(options?)`

Development-oriented logging to **`console.debug`** (or a custom **`log(phase, payload)`**).

| Option | Role |
|--------|------|
| `enabled` | Default `true` when using default logger |
| `includeRequestHeaders` | When `true`, logs **masked** request headers |
| `maskHeaders` | Header names to treat as sensitive |
| `maskStrategy` | `"partial"` (tail visible) or `"hash"` (fingerprint) |
| `maskPartialTailLength` | For `partial`, how many trailing chars to show |

Omit from production bundles if unused (tree-shaking friendly when imported from `/plugins` only in dev code paths).

### `strictFetch()`

If **`redirect`** is not set on the request, sets **`redirect: 'error'`** so **`fetch`** does not follow redirects silently. Useful for APIs where redirect chains are unexpected.

---

## Fluent client (`@hamdymohamedak/openfetch/sugar`)

```ts
import { createFluentClient } from "@hamdymohamedak/openfetch/sugar";
// or: import { createFluentClient } from "@hamdymohamedak/openfetch";

const client = createFluentClient({ baseURL: "https://api.example.com" })
  .use(retry({ attempts: 3 }))
  .use(timeout(5000));
```

### Callable URL entry

The client is **callable**: `client(url)` returns a **chain** ( **`RequestChain`** ).

- **`.get()` / `.post(data?)` / …** only **accumulate** config — they do **not** send yet.
- **Terminal** methods start the HTTP request: **`.json()`**, **`.text()`**, **`.blob()`**, **`.arrayBuffer()`**, **`.stream()`**, **`.raw()`**, **`.send()`**.

Calling **two terminals** without **`.memo()`** ⇒ **two separate** HTTP requests.

### `.memo()`

**`.memo()`** on the chain buffers the body **once** (after one `fetch` with **`rawResponse: true`**) so you can call **`.json()`** then **`.text()`** (or other terminals) **without** a second network round trip. This is **not** HTTP caching — only in-memory reuse for that chain.

### `.raw()` vs normal parsing

**`.raw()`** returns the native **`Response`** with an **unread** body (unless you used **`.memo()`**, which reconstructs a `Response` from the buffer).

With **`rawResponse` / `.raw()`**:

- **`dispatch`** skips body parsing and **`transformResponse`**.
- **Response interceptors** still run; they see **`OpenFetchResponse`** with **`data`** = native **`Response`**.
- Middleware that expects parsed **`ctx.response.data`** will not see JSON transforms until you parse yourself.

Use **`cloneResponse`** from the main package if you need two independent reads of the same native **`Response`**.

### Fluent vs `createClient`

| | `createClient` | `createFluentClient` |
|---|----------------|----------------------|
| Style | `await client.get("/path")` | `await client("/path").get().json()` |
| `use` / `defaults` / `interceptors` | Yes | Yes (fluent returns chained `use`) |
| Verb helpers on root | `client.get(url)` | `client.get(url)` still exists via delegation |

---

## Next

- [Configuration](./configuration.md) — `rawResponse`, `timeout`, full config reference  
- [Interceptors & middleware](./interceptors-middleware.md) — execution order  
- [Architecture & internals](./architecture.md) — diagrams and design notes  
