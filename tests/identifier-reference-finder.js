/**
 * Replaces all the IdentifierExpressions in a list with the identifier 'AAAAAAAA'
 */

const { IdentifierExpression, AssignmentTargetIdentifier, BindingIdentifier } = require('shift-ast');
const { LazyCloneReducer } = require("shift-reducer");

// Returns a ListMonad object whose `value` field contains all the references found in this ast
class IdentifierReferenceFinder extends LazyCloneReducer {
	constructor(references) {
		if (references === undefined || !Array.isArray(references)) {
			throw new Error("references must be an array")
		} else if (references.length === 0) {
			throw new Error("The list of references can't be empty")
		}
		super();
		this.references = new Map(references.map(r => [r.node, r])); // Transform to map for easier access
	}

	reduceIdentifierExpression(node) {
		if (this.references.has(node)) {
			return new IdentifierExpression({name: 'AAAAAAAA'})
		} else {
			return super.reduceIdentifierExpression(node);
		}
	}

	reduceAssignmentTargetIdentifier(node) {
		if (this.references.has(node)) {
			return new AssignmentTargetIdentifier({name: 'AAAAAAAA'})
		} else {
			return super.reduceAssignmentTargetIdentifier(node);
		}
	}

	reduceBindingIdentifier(node) {
		if (this.references.has(node)) {
			return new BindingIdentifier({name: 'AAAAAAAA'})
		} else {
			return super.reduceBindingIdentifier(node);
		}
	}
}

module.exports.IdentifierReferenceFinder = IdentifierReferenceFinder;
