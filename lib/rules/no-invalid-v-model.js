/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const VALID_MODIFIERS = new Set(["lazy", "number", "trim"])
const INVALID_TAGS = new Set([
    "html", "body", "base", "head", "link", "meta", "style", "title", "address",
    "article", "aside", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6",
    "hgroup", "nav", "section", "div", "dd", "dl", "dt", "figcaption", "figure",
    "hr", "img", "li", "main", "ol", "p", "pre", "ul", "a", "b", "abbr", "bdi",
    "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q",
    "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span", "strong", "sub",
    "sup", "time", "u", "var", "wbr", "area", "audio", "map", "track", "video",
    "embed", "object", "param", "source", "canvas", "script", "noscript", "del",
    "ins", "caption", "col", "colgroup", "table", "thead", "tbody", "td", "th",
    "tr", "button", "datalist", "fieldset", "form", "label", "legend", "meter",
    "optgroup", "option", "output", "progress", "details", "dialog", "menu",
    "menuitem", "summary", "content", "element", "shadow", "template", "svg",
    "animate", "circle", "clippath", "cursor", "defs", "desc", "ellipse",
    "filter", "font-face", "foreignObject", "g", "glyph", "image", "line",
    "marker", "mask", "missing-glyph", "path", "pattern", "polygon", "polyline",
    "rect", "switch", "symbol", "text", "textpath", "tspan", "use", "view",
])

/**
 * Check whether the given node can be LHS.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node can be LHS.
 */
function isLhs(node) {
    return node != null && (
        node.type === "Identifier" ||
        node.type === "MemberExpression"
    )
}

/**
 * Creates AST event handlers for no-invalid-v-model.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='model']"(node) {
            if (INVALID_TAGS.has(node.parent.id.name)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-model' directives aren't supported on <{{name}}> elements.",
                    data: node.parent.id,
                })
            }
            if (node.parent.id.name === "input") {
                if (utils.hasDirective(node.parent, "bind", "type")) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "'v-model' directives don't support dynamic input types.",
                        data: node.parent.id,
                    })
                }
                if (utils.hasAttribute(node.parent, "type", "file")) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "'v-model' directives don't support 'file' input type.",
                        data: node.parent.id,
                    })
                }
            }
            if (node.key.argument) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-model' directives require no argument.",
                })
            }
            for (const modifier of node.key.modifiers) {
                if (!VALID_MODIFIERS.has(modifier)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "'v-model' directives don't support the modifier '{{name}}'.",
                        data: {name: modifier},
                    })
                }
            }
            if (!utils.hasAttributeValue(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-model' directives require that attribute value.",
                })
            }
            if (node.value && !isLhs(node.value.expression)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-model' directives require the attribute value which is valid as LHS.",
                })
            }
        },
    })

    return {}
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    create,
    meta: {
        docs: {
            description: "disallow invalid v-model directives.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
