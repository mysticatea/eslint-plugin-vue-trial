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

/**
 * Creates AST event handlers for no-invalid-v-for.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    const sourceCode = context.getSourceCode()

    utils.registerTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='for']"(node) {
            const name = node.parent.id.name

            if (utils.isRootElement(node.parent.parent)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "The root element can't have 'v-for' directives.",
                })
            }

            if (!utils.isReservedTagName(name) &&
                name !== "template" &&
                !utils.hasDirective(node.parent, "bind", "key")
            ) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-for' directives on custom elements require 'v-bind:key' directives.",
                })
            }

            if (node.key.argument) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-for' directives require no argument.",
                })
            }
            if (node.key.modifiers.length > 0) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-for' directives require no modifier.",
                })
            }
            if (!utils.hasAttributeValue(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-for' directives require that attribute value.",
                })
                return
            }

            const expr = node.value.expression
            if (expr == null) {
                return
            }
            if (expr.type !== "VForExpression") {
                context.report({
                    node: node.value,
                    loc: node.value.loc,
                    message: "'v-for' directives require the special syntax '<alias> in <expression>'.",
                })
                return
            }

            const lhs = expr.left
            const value = lhs[0]
            const key = lhs[1]
            const index = lhs[2]

            if (value === null) {
                context.report({
                    node: value || expr,
                    loc: value && value.loc,
                    message: "Invalid alias ''.",
                })
            }
            if (key !== undefined && (!key || key.type !== "Identifier")) {
                context.report({
                    node: key || expr,
                    loc: key && key.loc,
                    message: "Invalid alias '{{text}}'.",
                    data: {text: key ? sourceCode.getText(key) : ""},
                })
            }
            if (index !== undefined && (!index || index.type !== "Identifier")) {
                context.report({
                    node: index || expr,
                    loc: index && index.loc,
                    message: "Invalid alias '{{text}}'.",
                    data: {text: index ? sourceCode.getText(index) : ""},
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
            description: "disallow invalid v-for directives.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
