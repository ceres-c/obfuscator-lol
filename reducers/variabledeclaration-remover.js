const { EmptyStatement } = require('shift-ast');
const { LazyCloneReducer } = require('shift-reducer');

/**
 * Deletes from the tree all the function declarations/function expressions
 * from a list of FunctionDeclaration/FunctionExpression objects
 *
 * Args:
 *	- deleteReferences: a list of references (Reference objects) to IdentifierExpressions. All the
 *	  declarations where one of these IdentifierExpressions appears as an init will be deleted
 *		e.g.
 *			var aA = b; // <= Given a reference to `b`, this whole line will disappear
 */
class VariableDeclarationRemover extends LazyCloneReducer {
	constructor(deleteReferences) {
		if (deleteReferences === undefined || !Array.isArray(deleteReferences)) {
			throw new Error("references must be an array")
		} else if (deleteReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super()
		this.deleteReferences = deleteReferences.map(r => r.node); // Map out nodes from Reference objects
	}

	reduceVariableDeclarationStatement(node, state) {
		if (node?.declaration?.declarators?.length == 1 &&
			this.deleteReferences.includes(node.declaration.declarators[0].init)) {
			// Found a declaration that can be deleted
			return new EmptyStatement();
		} else {
			return super.reduceVariableDeclarationStatement(node, state);
		}
	}
}

module.exports.VariableDeclarationRemover = VariableDeclarationRemover;
