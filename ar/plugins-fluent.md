# الإضافات والواجهة السلسة (Fluent)

بالإضافة للمسار الرئيسي `@hamdymohamedak/openfetch` توجد مسارات فرعية للتصدير تساعد **tree-shaking**:

| المسار | الاستخدام |
|--------|-----------|
| `@hamdymohamedak/openfetch/plugins` | وسيط جاهز: `retry`، `timeout`، `hooks`، `debug`، `strictFetch` |
| `@hamdymohamedak/openfetch/sugar` | `createFluentClient` — سلسلة استدعاءات مثل `client("/path").get().json()` |

## ترتيب التسجيل المقترح

سجّل **`retry` قبل `timeout`** حتى تلتف إعادة المحاولة على الطبقات الداخلية (بما فيها مهلة كل محاولة).

## `retry` و`timeout`

```ts
import { createClient } from "@hamdymohamedak/openfetch";
import { retry, timeout } from "@hamdymohamedak/openfetch/plugins";

const client = createClient({ baseURL: "https://api.example.com" })
  .use(retry({ attempts: 3 }))
  .use(timeout(15_000));
```

`retry` يعادل `createRetryMiddleware` مع اسم بديل **`attempts`** بدل **`maxAttempts`**. التفاصيل في [إعادة المحاولة والتخزين المؤقت](./retry-cache.md).

## الواجهة السلسة

- `client("/url")` يعيد سلسلة؛ **`.get()` / `.post()`** تعدّ الإعدادات فقط.
- **الطرق النهائية** (`.json()`، `.text()`، `.raw()`، …) تبدأ الطلب.
- **`.memo()`** — طلب شبكة واحد ثم قراءة الجسم عدة مرات من الذاكرة المؤقتة للسلسلة (ليس تخزين HTTP عام).

**`.raw()`** يعيد `Response` أصليًا؛ لا يُطبَّق `transformResponse` في الطبقة الأساسية. راجع [الإعدادات](./configuration.md) و`cloneResponse` في الحزمة.

## متابعة

- [المعترضات والوسيط](./interceptors-middleware.md)  
- [الإعدادات](./configuration.md)  
- [النسخة الإنجليزية الكاملة للصفحة](/plugins-fluent)  
