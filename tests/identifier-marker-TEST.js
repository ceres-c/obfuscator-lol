const { IdentifierExpression } = require('shift-ast');
const { LazyCloneReducer } = require('shift-reducer');

/**
 * This is a testing class: it will replace all the given references in a list with a new IdentifierExpression `AAAAAA`
 */

class IdentifierMarkerReducer extends LazyCloneReducer {
	constructor(replaceReferences) {
		super();
		this.replaceReferences = replaceReferences.map(r => r.node); // Map out nodes for easier access
	}

	reduceIdentifierExpression(node) {
		if (this.replaceReferences.includes(node)) {
			return new IdentifierExpression({
				name: 'AAAAAA'
			})
		} else {
			return super.reduceIdentifierExpression(node);
		}
	}
}

module.exports.IdentifierMarkerReducer = IdentifierMarkerReducer;
