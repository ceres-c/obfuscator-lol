/**
 * Undo the string array rotation transform
 */

const { parse: parseStringArrayRotate } = require('../parsers/stringarrayrotate-parser');
const { parse: parseStringArray } = require('../parsers/stringarray-parser');
const { findRecursiveUsages } = require('../utils/references-finder');
const { base64Decode, RC4Decrypt } = require('./strings-decoder');

function analyze(tree) {
	let parsedDecoding = parseStringArray(tree); // Required to identify references to decoding function inside rotation function
	let parsedDecodingBinding = parsedDecoding.functionReference.name; // Extract the BindingIdentifier object from FunctionExpression
	let parsedRotate = parseStringArrayRotate(tree);
	let decodeReferencesInRotate = findRecursiveUsages(tree, parsedDecodingBinding, {subtrees: [parsedRotate.functionReference]});

	function decoder(arg1, arg2) {
		// This function has the same interface of the original strings decoding function in the obfuscated JS
		if (arg2 === undefined) {
			return base64Decode(parsedDecoding.stringsArray[arg1]);
		} else {
			return RC4Decrypt(parsedDecoding.stringsArray[arg1], arg2);
		}
	}
	function wrapper(node) {
		// This wrapper function is required because CallReplaceReducer accepts a function as an argument
		// and will call it to get the new node that will replace the CallExpression. We just need a static object,
		// but have to comply with that interface
		return new IdentifierExpression({
			name: decoder.name
		})
	}

	console.log(parsedRotate);
	console.log(decodeReferencesInRotate);
	throw new Error('StringArrayRotationTransformer not implemented yet');
}

module.exports.analyze = function(tree) {
	return analyze(tree);
}
