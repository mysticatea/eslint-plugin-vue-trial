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
 * Creates AST event handlers for no-invalid-template-root.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    const sourceCode = context.getSourceCode()

    return {
        "Program[templateBody!=null]"(program) {
            const node = program.templateBody

            let rootElementName = null
            let rootElementFound = false
            let rootElementHasVIf = false
            let rootElementHasVFor = false
            let extraTextFound = false
            let extraElementFound = false
            for (const child of node.children) {
                if (child.type === "VElement") {
                    if (!rootElementFound) {
                        rootElementFound = true
                        rootElementName = child.startTag.id.name
                        rootElementHasVIf = utils.hasDirective(child.startTag, "if")
                        rootElementHasVFor = utils.hasDirective(child.startTag, "for")
                    }
                    else if (rootElementHasVIf && utils.hasDirective(child.startTag, "else-if")) {
                        // Do nothing.
                    }
                    else if (rootElementHasVIf && utils.hasDirective(child.startTag, "else")) {
                        rootElementHasVIf = false
                    }
                    else {
                        extraElementFound = true
                    }
                }
                else if (sourceCode.getText(child).trim() !== "") {
                    extraTextFound = true
                }
            }

            if (extraTextFound) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "The template root requires an element rather than texts.",
                })
            }
            else if (extraElementFound || !rootElementFound) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "The template root requires exactly one element.",
                })
            }
            else {
                if (rootElementName === "template" || rootElementName === "slot") {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "The template root disallows '<{{name}}>' elements.",
                        data: {name: rootElementName},
                    })
                }
                if (rootElementHasVIf) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "The template root requires the next element which has 'v-else' directives if it has 'v-if' directives.",
                    })
                }
                if (rootElementHasVFor) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "The template root disallows 'v-for' directives.",
                    })
                }
            }
        },
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    create,
    meta: {
        docs: {
            description: "Disallow invalid template root.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
