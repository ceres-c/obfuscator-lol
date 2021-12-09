const { LiteralStringExpression } = require('shift-ast');
const { LazyCloneReducer } = require('shift-reducer');
const { base64Decode, RC4Decrypt } = require('../transform/obfuscator_strings_decoder')

/**
 * Replaces the calls to a given list of references with the corresponding result. e.g.
 *	`console[c(0x19e, '4kR$')](c(0x19f, 'BT!9') + 'd!');` becomes
 *	`console['log']('Hello worl' + 'd!');`
 *
 * Args:
 *	- replaceReferences: a list of reference to decode/decrypt function which must be replaced
 *	- stringDecodingData: An object with the list of source encoded/encrypted strings and the access offset
 */
class CallReplaceReducer extends LazyCloneReducer {
	constructor(replaceReferences, stringDecodingData) {
		if (replaceReferences === undefined || replaceReferences.length === 0) {
			throw new Error("The target list of references can't be empty")
		}
		super()
		this.stringDecodingData = stringDecodingData;
		this.replaceReferences = replaceReferences;
	}

	reduceCallExpression(node, state) {
		if (this.replaceReferences.includes(node.callee)) {
			// Found a call that can be replaced with the final result
			if (node.arguments.length == 1) {
				// Plain base64
				if (node.arguments[0].type != 'LiteralNumericExpression') {
					throw new Error(`base64 decode parameter is not a number, got ${node.arguments[0].type} instead`)
				}
				let arg0 = node.arguments[0].value;
				return new LiteralStringExpression({
					value: base64Decode(this.stringDecodingData.stringsArray[arg0 + this.stringDecodingData.offset]),
				});
			} else if (node.arguments.length == 2) {
				// RC4
				if (node.arguments[0].type != 'LiteralNumericExpression') {
					throw new Error(`RC4 decrypt parameter[0] is not a number, got ${node.arguments[0].type} instead`)
				} else if (node.arguments[1].type != 'LiteralStringExpression') {
					throw new Error(`RC4 decrypt parameter[1] is not a string, got ${node.arguments[0].type} instead`)
				}
				let arg0 = node.arguments[0].value;
				let arg1 = node.arguments[1].value;
				return new LiteralStringExpression({
					value: RC4Decrypt(this.stringDecodingData.stringsArray[arg0 + this.stringDecodingData.offset], arg1),
				});
			} else {
				throw new Error(`Invalid number of parameters (${node.arguments.length}) for callee ${node.callee.name}`)
			}
		} else {
			return super.reduceCallExpression(node, state);
		}
	}
}

module.exports.CallReplaceReducer = CallReplaceReducer;
