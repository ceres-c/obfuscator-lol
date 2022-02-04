const { EmptyStatement } = require('shift-ast');
const { LazyCloneReducer } = require('shift-reducer');

/**
 * Replaces calls to a given list of references with the return value of the replacer function
 *
 * Args:
 *	- replaceReferences: a list of reference to function calls which must be replaced
 *	- replacer: A function that will be called for every node that has to be replaced, called with the node itself as an argument
 */
class CallReplaceReducer extends LazyCloneReducer {
	constructor(replaceReferences, replacer) {
		if (replaceReferences === undefined || !Array.isArray(replaceReferences)) {
			throw new Error("references must be an array")
		} else if (replaceReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super()
		this.replaceReferences = replaceReferences.map(r => r.node); // Map out nodes for easier access
		this.replacer = replacer;
	}

	reduceCallExpression(node, state) {
		if (this.replaceReferences.includes(node.callee)) {
			// Found a call that can be replaced with the final result
			return this.replacer(node, state);
		} else {
			return super.reduceCallExpression(node, state);
		}
	}
}

/**
 * Simple replacer function to delete calls
 */
function emptyReplacer(node, state) {
	// TODO: avoid emitting EmptyStatements at all
	return new EmptyStatement();
}

module.exports.CallReplaceReducer = CallReplaceReducer;
module.exports.emptyReplacer = function(node, state) {
	return emptyReplacer(node, state);
}
