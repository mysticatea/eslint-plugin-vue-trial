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
 * Check whether the given `v-if` node is using the variable which is defined by the `v-for` directive.
 * @param {ASTNode} vIf The `v-if` attribute node to check.
 * @param {ASTNode} element The element node which has the `v-if` attribute.
 * @returns {boolean} `true` if the `v-if` is using the variable which is defined by the `v-for` directive.
 */
function isUsingIterationVar(vIf, element) {
    return vIf.value.references.some(reference =>
        element.variables.some(variable =>
            variable.id.name === reference.id.name &&
            variable.kind === "v-for"
        )
    )
}

/**
 * Creates AST event handlers for no-confusing-v-for-v-if.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        VElement(node) {
            const vFor = utils.getDirective(node.startTag, "for")
            const vIf = utils.getDirective(node.startTag, "if")
            if (vIf && vFor && !isUsingIterationVar(vIf, node)) {
                context.report({
                    node: vIf,
                    loc: vIf.loc,
                    message: "This 'v-if' should be moved to the wrapper element.",
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
            description: "disallow confusing `v-for` and `v-if` on the same element.",
            category: "Best Practices",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
