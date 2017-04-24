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
 * Creates AST event handlers for no-invalid-v-pre.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='pre']"(node) {
            if (node.key.argument) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-pre' directives require no argument.",
                })
            }
            if (node.key.modifiers.length > 0) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-pre' directives require no modifier.",
                })
            }
            if (node.value) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-pre' directives require no attribute value.",
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
            description: "disallow invalid v-pre directives.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}