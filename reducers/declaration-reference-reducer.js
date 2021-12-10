const { MonoidalReducer } = require("shift-reducer");
const { ListMonad } = require("./monads");

// Returns a ListMonad object whose `value` field contains all the assignments to a given target variable
// Accepts a list of Reference objects
class DeclarationReferenceReducer extends MonoidalReducer {
	constructor(initReferences) {
		if (initReferences === undefined || !Array.isArray(initReferences)) {
			throw new Error("initReferences must be an array")
		} else if (initReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super(ListMonad);
		this.initReferences = new Map(initReferences.map(r => [r.node, r])); // Transform to map for easier access
	}

	// TODO handle ArrayBinding objects such as `var [a, b] = [x, y]`

	reduceVariableDeclarator(node, state) {
		if (this.initReferences.has(node.init)) {
			return new ListMonad({values: [node.binding]}).concat(super.reduceVariableDeclarator(node, state));
		} else {
			return super.reduceVariableDeclarator(node, state);
		}
	}
}

module.exports.DeclarationReferenceReducer = DeclarationReferenceReducer;
