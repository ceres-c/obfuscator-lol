/**
 * Filter all the IdentifierExpression references contained in a given ast from a list.
 * Only the references which can be found in the tree will be returned
 * 
 * Accepts a list of Reference objects and will return a ListMonad
 */

const { MonoidalReducer } = require("shift-reducer");
const { ListMonad } = require("./monads");

// Returns a ListMonad object whose `value` field contains all the references found in this ast
class IdentifierTreeFilter extends MonoidalReducer {
	constructor(references) {
		if (references === undefined || !Array.isArray(references)) {
			throw new Error("references must be an array")
		} else if (references.length === 0) {
			throw new Error("The list of references can't be empty")
		}
		super(ListMonad);
		this.references = new Map(references.map(r => [r.node, r])); // Transform to map for easier access
	}

	reduceIdentifierExpression(node) {
		if (this.references.has(node)) {
			return new ListMonad({values: [this.references.get(node)]}).concat(super.reduceIdentifierExpression(node));
		} else {
			return super.reduceIdentifierExpression(node);
		}
	}

	reduceAssignmentTargetIdentifier(node) {
		if (this.references.has(node)) {
			return new ListMonad({values: [this.references.get(node)]}).concat(super.reduceAssignmentTargetIdentifier(node));
		} else {
			return super.reduceAssignmentTargetIdentifier(node);
		}
	}

	reduceBindingIdentifier(node) {
		if (this.references.has(node)) {
			return new ListMonad({values: [this.references.get(node)]}).concat(super.reduceBindingIdentifier(node));
		} else {
			return super.reduceBindingIdentifier(node);
		}
	}
}

module.exports.IdentifierTreeFilter = IdentifierTreeFilter;
