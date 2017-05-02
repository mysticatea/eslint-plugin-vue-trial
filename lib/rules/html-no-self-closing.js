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
 * Creates AST event handlers for html-no-self-closing.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VStartTag[selfClosing=true]"(node) {
            if (!utils.isSvgElementName(node.id.name)) {
                const pos = node.range[1] - 2
                context.report({
                    node,
                    loc: node.loc,
                    message: "Self-closing shuld not be used.",
                    fix: (fixer) => fixer.removeRange([pos, pos + 1]),
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
            description: "enforce end tag style.",
            category: "Best Practices",
            recommended: true,
        },
        fixable: "code",
        schema: [],
    },
}
