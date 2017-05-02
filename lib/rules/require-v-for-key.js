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
 * Check whether the given attribute is using the variables which are defined by `v-for` directives.
 * @param {ASTNode} node The attribute node to check.
 * @returns {boolean} `true` if the node is using the variables which are defined by `v-for` directives.
 */
function isUsingIterationVar(node) {
    const references = node.value.references
    const variables = node.parent.parent.variables

    return references.some(reference =>
        variables.some(variable =>
            variable.id.name === reference.id.name &&
            variable.kind === "v-for"
        )
    )
}

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        VStartTag(node) {
            const vFor = utils.getDirective(node, "for")
            const vBindKey = utils.getDirective(node, "bind", "key")

            if (vFor && vBindKey && !isUsingIterationVar(vBindKey)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive.",
                })
            }
            else if (vFor && !vBindKey && !utils.isCustomComponent(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-for' directives require 'v-bind:key' directives.",
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
            description: "require `v-bind:key` with `v-for` directives.",
            category: "Best Practices",
            recommended: false,
        },
        fixable: false,
        schema: [],
    },
}
