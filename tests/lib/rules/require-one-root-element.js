/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/require-one-root-element")

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const tester = new RuleTester({
    parser: "vue-eslint-parser",
    parserOptions: {ecmaVersion: 2015},
})

tester.run("require-one-root-element", rule, {
    valid: [
        {
            filename: "test.vue",
            code: "",
        },
        {
            filename: "test.vue",
            code: "<template><div>abc</div></template>",
        },
        {
            filename: "test.vue",
            code: "<template>\n    <div>abc</div>\n</template>",
        },
        {
            filename: "test.vue",
            code: "<template>\n    <!-- comment -->\n    <div>abc</div>\n</template>",
        },
    ],
    invalid: [
        {
            filename: "test.vue",
            code: "<template>\n</template>",
            errors: ["The template root requires exactly one element."],
        },
        {
            filename: "test.vue",
            code: "<template><div></div><div></div></template>",
            errors: ["The template root requires exactly one element."],
        },
        {
            filename: "test.vue",
            code: "<template>\n    <div></div>\n    <div></div>\n</template>",
            errors: ["The template root requires exactly one element."],
        },
        {
            filename: "test.vue",
            code: "<template>{{a b c}}</template>",
            errors: ["The template root requires an element rather than texts."],
        },
        {
            filename: "test.vue",
            code: "<template><div></div>aaaaaa</template>",
            errors: ["The template root requires an element rather than texts."],
        },
        {
            filename: "test.vue",
            code: "<template>aaaaaa<div></div></template>",
            errors: ["The template root requires an element rather than texts."],
        },
    ],
})
