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
 * Creates AST event handlers for no-parsing-error.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VExpressionContainer[syntaxError!=null]"(node) {
            context.report({
                node,
                loc: node.loc,
                message: "Parsing error: {{message}}.",
                data: node.syntaxError,
            })
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
            description: "disallow parsing errors in `<template>`.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
