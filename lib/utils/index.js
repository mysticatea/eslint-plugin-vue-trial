/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = {
    /**
     * Register the given visitor to parser services.
     * If the parser service of `vue-eslint-parser` was not found,
     * this generates the warning.
     *
     * @param {RuleContext} context The rule context to use parser services.
     * @param {object} visitor The visitor.
     * @returns {void}
     */
    registerTemplateBodyVisitor(context, visitor) {
        if (context.parserServices.registerTemplateBodyVisitor == null) {
            context.report({
                loc: {line: 1, column: 0},
                message: "Use the latest vue-eslint-parser.",
            })
            return
        }
        context.parserServices.registerTemplateBodyVisitor(context, visitor)
    },

    /**
     * Get the previous sibling element of the given element.
     * @param {ASTNode} node The element node to get the previous sibling element.
     * @returns {ASTNode|null} The previous sibling element.
     */
    prevSibling(node) {
        console.assert(node && node.type === "VElement")
        let prevElement = null

        for (const siblingNode of (node.parent && node.parent.children) || []) {
            if (siblingNode === node) {
                return prevElement
            }
            if (siblingNode.type === "VElement") {
                prevElement = siblingNode
            }
        }

        return null
    },

    /**
     * Check whether the given start tag has specific directive.
     * @param {ASTNode} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @returns {boolean} `true` if the start tag has the directive.
     */
    hasDirective(node, name) {
        console.assert(node && node.type === "VStartTag")
        return node.attributes.some(a => a.directive && a.key.name === name)
    },

    /**
     * Check whether the given attribute has their attribute value.
     * @param {ASTNode} node The attribute node to check.
     * @returns {boolean} `true` if the attribute has their value.
     */
    hasAttributeValue(node) {
        console.assert(node && node.type === "VAttribute")
        return (
            node.value != null &&
            (node.value.expression != null || node.value.syntaxError != null)
        )
    },

    /**
     * Check whether the previous sibling element has `if` or `else-if` directive.
     * @param {ASTNode} node The element node to check.
     * @returns {boolean} `true` if the previous sibling element has `if` or `else-if` directive.
     */
    prevElementHasIf(node) {
        console.assert(node && node.type === "VElement")

        const prev = this.prevSibling(node)
        return (
            prev != null &&
            prev.startTag.attributes.some(a =>
                a.directive &&
                (a.key.name === "if" || a.key.name === "else-if")
            )
        )
    },
}
