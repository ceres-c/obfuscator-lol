const { EmptyStatement } = require('shift-ast');
const { LazyCloneReducer } = require('shift-reducer');

/**
 * Deletes from the tree all the function declarations/function expressions
 * from a list of FunctionDeclaration/FunctionExpression/VariableDeclarators objects
 *
 * Args:
 *	- deleteReferences: a list of reference to function declarations which must be deleted
 *
 * TODO: avoid emitting EmptyStatements at all
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

	// let a = function() {return "Function a"};
	// Will delete this when passed a VariableDeclarator object (both binding and init)
	reduceVariableDeclarationStatement(node, state) {
		// Check if any VariableDeclarator is in deleteReferences.
		let declarators = node?.declaration?.declarators?.length ? node.declaration.declarators : [];
		let remaining = declarators.filter(d => !this.deleteReferences.includes(d));
		if (remaining.length == 0) {
			// Found a DeclarationStatement that can be deleted
			return new EmptyStatement();
		} else {
			node.declaration.declarators = remaining;
			return super.reduceVariableDeclarationStatement(node, state);
		}
	}
}

module.exports.FunctionRemover = FunctionRemover;
