# Require exactly one root element for `<template>` (require-one-root-element)

[Every component must have exactly one root element](https://vuejs.org/v2/guide/migration.html#Fragment-Instances-removed) in Vue.js 2.

## 📖 Rule Details

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>a</div>
    <div>b</div>
    <div>c</div>
</template>
```

```html
<template>
    abc
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>abc</div>
</template>
```

## 🔧 Options

Nothing.
