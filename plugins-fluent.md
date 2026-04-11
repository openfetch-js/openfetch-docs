# Plugins & fluent API

Use **tree-shakable** subpaths so bundlers include only what you need:

- `@hamdymohamedak/openfetch/plugins` — `retry`, `timeout`, `hooks`, `debug`, `strictFetch`
- `@hamdymohamedak/openfetch/sugar` — `createFluentClient` (fluent URL chains)

See [Getting started — Subpath imports](./getting-started.md#subpath-imports-tree-shaking) for import examples, [Configuration](./configuration.md) for request options, [Retry & cache](./retry-cache.md) for retry and cache middleware, and [Interceptors & middleware](./interceptors-middleware.md) for stack order with `use()`.
