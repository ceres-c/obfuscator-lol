const { MonoidalReducer } = require("shift-reducer");
const { ListMonad } = require("./monads");

// Returns a ListMonad object whose `value` field contains all the assignments to a given target variable
class DeclarationReferenceReducer extends MonoidalReducer {
	constructor(initReferences) {
		if (initReferences === undefined || initReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super(ListMonad);
		this.initReferences = initReferences;
	}

	// TODO handle ArrayBinding objects such as `var [a, b] = [x, y]`

	reduceVariableDeclarator(node, state) {
		if (this.initReferences.includes(node.init)) {
			this.initReferences = this.initReferences.filter(e => e != node.init) // Remove current node from references array
			return new ListMonad({values: [node.binding]}).concat(super.reduceVariableDeclarator(node, state));
		} else {
			return super.reduceVariableDeclarator(node, state);
		}
	}
}

module.exports.DeclarationReferenceReducer = DeclarationReferenceReducer;
