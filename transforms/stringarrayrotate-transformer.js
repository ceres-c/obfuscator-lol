/**
 * Undo the string array rotation transform
 */

const { reduce } = require('shift-reducer');
const { CallExpression, IdentifierExpression, VariableDeclarator, LiteralStringExpression, ArrayExpression } = require('shift-ast');

const { parse: parseStringArrayRotate } = require('../parsers/stringarrayrotate-parser');
const { parse: parseStringArray } = require('../parsers/stringarray-parser');
const { findRecursiveUsages } = require('../utils/references-finder');
const { CallReplaceReducer } = require('../reducers/call-replace-reducer');
const { ArrayExpressionReplaceReducer } = require('../reducers/arrayexpression-replace-reducer');
const { base64Decode, RC4Decrypt } = require('./strings-decoder');
const parseIntCodegen = require('../reducers/parseInt-codegen');

function analyze(tree) {
	let parsedDecoding = parseStringArray(tree); // Required to identify references to decoding function inside rotation function
	let parsedDecodingBinding = parsedDecoding.functionReference.name; // Extract the BindingIdentifier object from FunctionExpression
	let parsedRotate = parseStringArrayRotate(tree);
	let decodeReferencesInRotate = findRecursiveUsages(tree, parsedDecodingBinding, {subtrees: [parsedRotate.functionReference]});

	let offset = 0;

	function decoder(arg1, arg2, offset) {
		// This function has the same interface of the original strings decoding function in the obfuscated JS
		// and will be called by the below call to `eval`
		if (arg2 === undefined) {
			return base64Decode(parsedDecoding.stringsArray[arg1 + parsedDecoding.offset + offset]);
		} else {
			return RC4Decrypt(parsedDecoding.stringsArray[arg1 + parsedDecoding.offset + offset], arg2);
		}
	}
	function stringArrayRotateReplacer(node, state) {
		// This wrapper function is required because CallReplaceReducer accepts a function as an argument
		// and will call it to get the new node that will replace the CallExpression. We just need a static object,
		// but have to comply with that interface

		// Return a new call to `decoder` with the original parameters, plus a reference to the `offset` variable
		// b(324,"2IW$") => decoder(324,"2IW$", offset)
		return new CallExpression({
			callee: new IdentifierExpression({
					name: decoder.name
				}),
			arguments: [...node.arguments, new IdentifierExpression({name: Object.keys({offset})[0]})] // Retrieve the name of the `offset` variable as a string without hardcoding it
		});
	}

	let newExpression = reduce(new CallReplaceReducer(decodeReferencesInRotate, stringArrayRotateReplacer), parsedRotate.functionData.checkExpressionReference);
	let newExpressionString = parseIntCodegen(newExpression, ['parseInt', decoder.name, Object.keys({offset})[0]], ['/', '+', '*', '-']);

	try {
		(() => { // Emulating a python for-else
			for (let i = 0; i < parsedDecoding.stringsArray.length; i++) {
				// There are as many references in decodeReferencesInRotate as there are array access operations in the original code.
				// Subtracting its length should avoid out of bound accesses
				let result = eval(newExpressionString)
				if (result === parsedRotate.functionData.finalValue) {
					return;
				}
				offset++;
			}
			throw new Error("Could not find Strings Array rotation offset, result wasn't matched");
		})();
	} catch (TypeError) {
		// Out of bound read to stringsArray (internally accessing property of unknown, thus TypeError)
		throw new Error('Could not find Strings Array rotation offset, went out of bound');
	}

	// Rotate the strings array by the given offset
	function replacer(node, state) {
		node.elements = [...node.elements.slice(offset), ...node.elements.slice(0,offset)];
		return node;
	}
	return reduce(new ArrayExpressionReplaceReducer([parsedDecoding.stringsArrayReference], replacer), tree);

	// TODO remove array rotation function
}

module.exports.analyze = function(tree) {
	return analyze(tree);
}
