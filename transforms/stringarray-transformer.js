/**
 * Undo the string array transform
 * NOTE: Must be executed AFTER stringarrayrotate transform, if that is enabled
 */

const { reduce } = require('shift-reducer');
const { LiteralStringExpression } = require('shift-ast');

const { parse } = require('../parsers/stringarray-parser');
const { findRecursiveUsages } = require('../utils/references-finder');
const { CallReplaceReducer } = require('../reducers/call-replace-reducer');
const { base64Decode, RC4Decrypt } = require('../transforms/strings-decoder')

function analyze(tree) {
	let decodingFunc = parse(tree);
	let decodingFuncDeclaration = decodingFunc.functionReference.name // Get a BindingIdentifier object

	// Find all the references to the string decoding function, excluding all those within the string decoding function itself
	let decodingUsages = findRecursiveUsages(tree, decodingFuncDeclaration, {excludeSubtrees: [decodingFunc.functionReference]});

	/**
	 * The function that will be called by the reducer to actually replace nodes
	 *	`console[c(0x19e, '4kR$')](c(0x19f, 'BT!9') + 'd!');` becomes
	 *	`console['log']('Hello worl' + 'd!');`
	 */
	function stringArrayReplacer(node, state) {
		if (node.arguments.length == 1) {
			// Plain base64
			if (node.arguments[0].type != 'LiteralNumericExpression') {
				throw new Error(`base64 decode parameter is not a number, got ${node.arguments[0].type} instead`)
			}
			let arg0 = node.arguments[0].value;
			return new LiteralStringExpression({
				value: base64Decode(decodingFunc.stringsArray[arg0 + decodingFunc.offset]),
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
				value: RC4Decrypt(decodingFunc.stringsArray[arg0 + decodingFunc.offset], arg1),
			});
		} else {
			throw new Error(`Invalid number of parameters (${node.arguments.length}) for callee ${node.callee.name}`)
		}
	}

	return reduce(new CallReplaceReducer(decodingUsages, stringArrayReplacer), tree);
}

module.exports.analyze = function(tree) {
	return analyze(tree);
}