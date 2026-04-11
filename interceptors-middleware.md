# Interceptors & middleware

## Request lifecycle (short)

1. Merge **defaults** + call config.  
2. Run **request interceptors** on the config.  
3. Build **`OpenFetchContext`** (`url`, `request`, `response`, `error`).  
4. Run **middleware** stack; innermost calls **`dispatch`** (`fetch` + parse + validate + response transforms).  
5. Run **response interceptors** on the successful response.  
6. Return full response or `data` if `unwrapResponse`.

See [Architecture & internals](./architecture.md) for diagrams, or the repo’s `openFetch/docs/PROJECT_FLOW.md` for a file map.

### Inside `dispatch` (after `next()` reaches core)

Order matters for debugging transforms and errors:

1. **`transformRequest`** — each function receives `(data, headers)`; may change body and headers before `fetch`.
2. **`fetch`** — single call with merged `RequestInit` + computed URL/body.
3. **Body parse** — unless **`rawResponse`** is true: JSON/text/blob/etc. per **`responseType`** or `Content-Type`.
4. **`validateStatus`** — failure throws **`OpenFetchError`** (`ERR_BAD_RESPONSE`) with response attached.
5. **`transformResponse`** — skipped when **`rawResponse`** is true.

**Response interceptors** run on the resulting **`OpenFetchResponse`** (so for `rawResponse`, `data` is still the native **`Response`**).

## Interceptors

Each client exposes:

```ts
client.interceptors.request.use(fulfilled?, rejected?);
client.interceptors.response.use(fulfilled?, rejected?);
```

**Order:**

- **Request:** handlers run **last registered first** (LIFO).
- **Response:** handlers run **first registered first** (FIFO).

Handlers return the value or a Promise. `rejected` follows standard promise chaining semantics.

## Middleware

Type:

```ts
type Middleware = (
  ctx: OpenFetchContext,
  next: NextFn
) => Promise<void>;
```

- **`ctx.request`** — Final merged config for this round trip.  
- **`ctx.response`** — Set by `dispatch` (or a middleware) on success.  
- **`ctx.error`** — May be set when something throws inside the stack. The client in **`client.ts`** prefers a successful **`ctx.response`**: if **`ctx.error`** is set but **`ctx.response`** is non-null (for example after retry recovered), the client does **not** throw **`ctx.error`**. If there is still **no** response after middleware finishes, the error is propagated.

### Who calls `dispatch`?

Only the **innermost** middleware handler passed to **`applyMiddlewares`** invokes **`dispatch`**. **Retry** middleware calls **`next()`** again so everything **below** retry in the stack runs **once per attempt**; middleware **above** retry wraps the whole loop.

Register on the client:

```ts
client.use(async (ctx, next) => {
  console.log("before", ctx.request.method);
  await next();
  console.log("after", ctx.response?.status);
});
```

`client.use` **pushes** onto `defaults.middlewares`.

### Ordering

Outer middleware runs first when entering the stack. **Order matters** for cache vs retry: e.g. cache **before** retry avoids retrying on cache hits; retry **before** cache retries origin failures before a cache layer sees them. Choose based on product rules.

## Built-in middleware factories

- **`createRetryMiddleware(options?)`** — See [Retry & cache](./retry-cache.md).  
- **`createCacheMiddleware(store, options?)`** — See [Retry & cache](./retry-cache.md).

Convenience wrappers (same middleware, nicer DX): **`retry`**, **`timeout`**, **`hooks`**, **`debug`**, **`strictFetch`** from **`@hamdymohamedak/openfetch/plugins`** — [Plugins & fluent API](./plugins-fluent.md).

## Next

- [Plugins & fluent API](./plugins-fluent.md)  
- [Retry & cache](./retry-cache.md)  
- [Errors & security](./errors-security.md)
