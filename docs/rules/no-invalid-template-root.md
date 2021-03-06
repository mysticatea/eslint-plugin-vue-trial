# Disallow invalid template root (no-invalid-root-element)

This rule checks whether every template root is valid.

## 📖 Rule Details

This rule reports the template root if the following cases:

- The root is text. E.g. `<template>hello</template>`.
- The root is multiple elements. E.g. `<template><div>one</div><div>two</div></template>`.
- The root element has `v-for` directives. E.g. `<template><div v-for="x in list">{{x}}</div></template>`.
- The root element has `v-if`/`v-else-if` directives without `v-else` elements. E.g. `<template><div v-if="foo">hello</div></template>`.
- The root element is `<template>` or `<slot>` elements. E.g. `<template><template>hello</template></template>`.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>hello</div>
    <div>hello</div>
</template>
```

```html
<template>
    abc
</template>
```

```html
<template>
    <div v-for="x in list"></div>
</template>
```

```html
<template>
    <div v-if="foo"></div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>abc</div>
</template>
```

```html
<template>
    <div v-if="foo">abc</div>
    <div v-else>def</div>
</template>
```

## 🔧 Options

Nothing.
