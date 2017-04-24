/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates AST event handlers for no-parsing-error.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    const sourceCode = context.getSourceCode()

    return {
        "Program[templateBody!=null]"(program) {
            const node = program.templateBody

            let rootElementFound = false
            let extraTextFound = false
            let extraElementFound = false
            for (const child of node.children) {
                if (child.type === "VElement") {
                    if (!rootElementFound) {
                        rootElementFound = true
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
            description: "Require exactly one root element for `<template>`.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
