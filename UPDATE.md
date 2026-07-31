# رفع التحديث على GitHub

المستودع مربوط بـ Vercel: `khaldwlydhmwdahmdalrhmany-ctrl/areej-admin` — فرع `main`.
أي دفعة إلى `main` تُنشر تلقائيًا.

## مهم: افتح الزيب وادخل إلى مجلد `areej-admin`

اسحب **محتويات** المجلد (app، components، lib، public، …) — لا المجلد نفسه،
وإلا صارت الملفات داخل مسار `areej-admin/areej-admin/...` ولن يعمل الموقع.

## الطريقة الأولى: GitHub Desktop (الأسهل والأضمن)

1. حمّل GitHub Desktop من desktop.github.com
2. File ← Clone repository ← اختر `areej-admin`
3. الصق محتويات الزيب في مجلد المستودع (استبدل الموجود)
4. اكتب رسالة في الأسفل واضغط **Commit to main**
5. اضغط **Push origin**

## الطريقة الثانية: متصفح GitHub

استخدم **Chrome أو Edge** — سحب المجلدات لا يعمل في Safari.

1. افتح المستودع ← **Add file** ← **Upload files**
2. اسحب المجلدات دفعة دفعة (لا كلها مرة واحدة):
   - الدفعة ١: `app`
   - الدفعة ٢: `components`
   - الدفعة ٣: `lib` + `context` + `public` + `scripts`
   - الدفعة ٤: ملفات الجذر (package.json، middleware.js، …)
3. بعد كل دفعة: **Commit changes**

الحد في المتصفح 100 ملف لكل رفعة، ومجلد `app` وحده فيه 38 ملفًا.

## ملف `.gitignore` مخفي

لن يظهر عند السحب ما لم تُفعّل إظهار الملفات المخفية:
- ويندوز: تبويب View ← ✔ Hidden items
- ماك: اضغط `Cmd + Shift + .`

بديل أسهل: أنشئه من GitHub مباشرة (Add file ← Create new file ← اسمه `.gitignore`) والصق محتواه.

## لا ترفع هذه

`package-lock.json` — الموجود في المستودع صالح ويجب أن يبقى
`.env` — لا يُرفع أبدًا (المستودع عام)
`node_modules` و`.next`

## بعد النشر

لا يوجد أي إجراء. قاعدة البيانات مُرحّلة مسبقًا، ومتغيرات البيئة في Vercel كما هي.
