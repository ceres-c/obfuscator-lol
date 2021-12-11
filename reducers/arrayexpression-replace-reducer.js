
const { LazyCloneReducer } = require('shift-reducer');

/**
 * Replaces a given list of ArrayExpression references with the return value of the replacer function
 *
 * Args:
 *	- replaceReferences: a list of ArrayExpression objects which must be replaced
 *	- replacer: A function that will be called for every node that has to be replaced, called with the node itself as an argument
 */
class ArrayExpressionReplaceReducer extends LazyCloneReducer {
	constructor(replaceReferences, replacer) {
		if (replaceReferences === undefined || !Array.isArray(replaceReferences)) {
			throw new Error("references must be an array")
		} else if (replaceReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super()
		this.replaceReferences = replaceReferences;
		this.replacer = replacer;
	}

	reduceArrayExpression(node, state) {
		if (this.replaceReferences.includes(node)) {
			// Found a call that can be replaced with the final result
			return this.replacer(node, state);
		} else {
			return super.reduceArrayExpression(node, state);
		}
	}
}

module.exports.ArrayExpressionReplaceReducer = ArrayExpressionReplaceReducer;
