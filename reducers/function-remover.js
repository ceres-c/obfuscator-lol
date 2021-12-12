const { EmptyStatement } = require('shift-ast');
const { LazyCloneReducer } = require('shift-reducer');

/**
 * Deletes from the tree all the function declarations/function expressions
 * from a list of FunctionDeclaration/FunctionExpression objects
 *
 * Args:
 *	- deleteReferences: a list of reference to function declarations which must be deleted
 */
class FunctionRemover extends LazyCloneReducer {
	constructor(deleteReferences) {
		if (deleteReferences === undefined || !Array.isArray(deleteReferences)) {
			throw new Error("references must be an array")
		} else if (deleteReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super()
		this.deleteReferences = deleteReferences;
	}

	reduceExpressionStatement(node, state) {
		if (this.deleteReferences.includes(node.expression) ||
			this.deleteReferences.includes(node?.expression.callee)) {
			// Found an expression that can be deleted
			return new EmptyStatement();
		} else {
			return super.reduceExpressionStatement(node, state);
		}
	}

	reduceFunctionDeclaration(node, state) {
		if (this.deleteReferences.includes(node)) {
			// Found a declaration that can be deleted
			return new EmptyStatement();
		} else {
			return super.reduceFunctionDeclaration(node, state);
		}
	}
}

module.exports.FunctionRemover = FunctionRemover;
