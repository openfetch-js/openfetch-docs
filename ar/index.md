---
layout: home
title: openFetch — عميل HTTP مبني على fetch
titleTemplate: false
description: معترضات، وسيط، إعادة محاولة، وتخزين مؤقت في الذاكرة على fetch القياسي — Node 18+ والمتصفحات والحافة دون الاعتماد على XHR.
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://openfetch-js.github.io/openfetch-docs/ar/
  - - meta
    - property: og:locale
      content: ar_SA
  - - meta
    - property: og:title
      content: openFetch — عميل HTTP مبني على fetch
  - - meta
    - property: og:description
      content: معترضات، وسيط، إعادة محاولة، وتخزين مؤقت — دون XHR. Node 18+ والمتصفحات والحافة.
  - - meta
    - name: twitter:title
      content: openFetch — عميل HTTP مبني على fetch
  - - meta
    - name: twitter:description
      content: وثائق openFetch بالعربية — عميل HTTP على fetch.

hero:
  name: openFetch
  text: عميل HTTP مبني على fetch
  tagline: معترضات، وسيط، إعادة محاولة، وتخزين مؤقت في الذاكرة — دون الاعتماد على XHR، جاهز لـ Node 18+ والمتصفحات والحافة.
  actions:
    - theme: brand
      text: ابدأ الآن
      link: /ar/getting-started
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/@hamdymohamedak/openfetch
    - theme: alt
      text: GitHub
      link: https://github.com/openfetch-js/OpenFetch

features:
  - title: نقل عبر fetch فقط
    details: مسار واحد فوق fetch القياسي — Node وBun وDeno والـ Workers والمتصفات الحديثة دون مكملات إلزامية.
  - title: معترضات ووسيط
    details: معترضات للطلب/الاستجابة مع وسيط قابل للتجميع للمصادقة والسجلات وإعادة المحاولة والتخزين المؤقت بترتيب متوقع.
  - title: إعادة محاولة وتخزين مؤقت
    details: إعادة محاولة اختيارية مع تراجع وتخزين مؤقت في الذاكرة لـ GET/HEAD مع TTL وأنماط قريبة من SWR عند التفعيل.
  - title: أخطاء منظمة وخطافات أمان
    details: OpenFetchError برموز مستقرة، وحارس URL اختياري للروابط غير الموثوقة، ومساعدات لتسجيل آمن.
  - title: مسارات استيراد قابلة للاقتطاع
    details: استورد نواة العميل أو أضف الإضافات وواجهة السلاسة من مسارات فرعية مخصصة.
  - title: مناسب لمكوّنات الخادم
    details: دون افتراض وجود window — مناسب لـ SSR وواجهات API وأنماط React Server Components.
---

## نظرة سريعة

<ComparisonMatrix locale="ar" />

## نفس الطلب — ثلاثة عملاء HTTP

واجهة [فئات EscuelaJS](https://api.escuelajs.co/api/v1/categories) تُرجع مصفوفة JSON. أدناه: **openFetch**، **Axios**، و**ky**.

**openFetch** — إعدادات مشتركة، استجابة منظمة، وجاهزية للمعترضات والوسيط:

```ts
import openFetch from "@hamdymohamedak/openfetch";

const res = await openFetch.get(
  "https://api.escuelajs.co/api/v1/categories"
);
// res.data, res.status, res.headers, res.config
```

**Axios** — واجهة مألوفة؛ نقل افتراضي مختلف في المتصفح:

```ts
import axios from "axios";

const res = await axios.get(
  "https://api.escuelajs.co/api/v1/categories"
);
// res.data, res.status, res.headers, res.config
```

**ky** — واجهة صغيرة فوق `fetch`:

```ts
import ky from "ky";

const data = await ky
  .get("https://api.escuelajs.co/api/v1/categories")
  .json();
```

## قياس حي في المتصفح

اضغط **تشغيل القياس (٥ جولات)**: في كل جولة يُنفَّذ **ثلاثة طلبات GET متوازية** (openFetch، Axios، ky) مع **تعطيل التخزين المؤقت** حيثما أمكن. البطاقات تعرض **آخر قياس**، **المتوسط**، **الأدنى**، و**الأعلى**؛ القائمة تُرتّب حسب **متوسط الزمن** (الأقل = أسرع في هذه الجلسة). الأسرع يحصل على شريط صغير — مع ذلك اقرأ التنبيه: **الشبكة هي المهيمنة**؛ هذا **لقطة من جلستك** وليس حكماً أدائياً مطلقاً.

<LiveFetchBench locale="ar" />

## لماذا يضيف المطورون طبقة عميل؟

- **إعدادات موحّدة** — `baseURL`، ترويسات، مهلة زمنية، و`unwrapResponse` لمثيل `createClient`.
- **سلوك عابر للطلبات** — مصادقة، تتبع، أعلام ميزات، وتطبيع أخطاء عبر المعترضات والوسيط.
- **مرونة** — سياسات إعادة محاولة وتخزين مؤقت دون تكرار في كل استدعاء.
- **أخطاء متوقعة** — ربط أعطال HTTP والشبكة بأخطاء مُنمّاة بدلاً من `try/catch` العشوائي.

openFetch يستهدف الفرق التي تريد ذلك **مع البقاء على fetch** حيث يوفّره النظام.

## صفحات التوثيق

1. [البدء](./getting-started.md) — التثبيت، التصدير الافتراضي، `createClient`، أول طلبات  
2. [طرق HTTP](./http-methods.md) — GET وPOST وPUT وPATCH وDELETE و`request()`  
3. [React و Vue](./framework-guides.md) — الخطافات، التركيبات، العملاء المشتركون، ملاحظات RSC  
4. [الإعدادات](./configuration.md) — خيارات الطلب، `rawResponse`، دمج الإعدادات  
5. [الإضافات والواجهة السلسة](./getting-started.md#subpath-imports-tree-shaking) — مسارات `plugins` و`sugar`  
6. [المعترضات والوسيط](./interceptors-middleware.md) — ترتيب التنفيذ، `use()`، وسيط مخصص  
7. [إعادة المحاولة والتخزين المؤقت](./retry-cache.md) — الميزانية، مفاتيح idempotency، التخزين المؤقت  
8. [الأخطاء والأمان](./errors-security.md) — `OpenFetchError`، الرموز، التسجيل الآمن، `assertSafeHttpUrl`  

## واجهة برمجة التطبيقات العامة (ملخص)

| التصدير | الدور |
|---------|--------|
| **الافتراضي** | مثيل جاهز من `createClient()` |
| `createClient` / `create` | عميل جديد مع `initialDefaults` اختيارية |
| `createFluentClient` | سلاسل URL مرنة (من `/sugar`) |
| `retry`, `timeout`, `hooks`, `debug`, `strictFetch` | إضافات وسيط (من `/plugins`) |
| `OpenFetchError`، `isOpenFetchError` | أخطاء مُنمّاة + حارس النوع |
| `InterceptorManager` | مكدس المعترضات |
| `createRetryMiddleware` | مصنع وسيط إعادة المحاولة |
| `MemoryCacheStore`، `createCacheMiddleware`، `appendCacheKeyVaryHeaders` | تخزين مؤقت في الذاكرة |
| الأنواع | `OpenFetchConfig`، `OpenFetchResponse`، `Middleware`، إلخ. |
| `assertSafeHttpUrl` | حارس اختياري على نمط SSRF |

## المتطلبات

**Node.js 18+** أو أي بيئة فيها `fetch` و`AbortController`.

## المصدر والحزمة

- **GitHub:** [openfetch-js/OpenFetch](https://github.com/openfetch-js/OpenFetch)  
- **npm:** [@hamdymohamedak/openfetch](https://www.npmjs.com/package/@hamdymohamedak/openfetch)  

## لغات أخرى

تصفح [كل الترجمات](/languages/).
