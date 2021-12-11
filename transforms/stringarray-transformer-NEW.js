/**
 * Undo the string array transform
 * NOTE: Must be executed AFTER stringarrayrotate transform, if that is enabled
 */

 const { reduce } = require('shift-reducer');

const { analyzeStrArrDecodingFunc } = require('../parsers/stringarray-parser');
const { declarationUsages, findInitializedToReferences, findRecursiveUsages } = require('../utils/references-finder-NEW');
const { CallReplaceReducer } = require('../reducers/call-replace-reducer');

function analyze(tree) {
	let decodingFunc = analyzeStrArrDecodingFunc(tree);
	let decodingFuncDeclaration = decodingFunc.functionReference.name // Get a BindingIdentifier object

	// Find all the references to the string decoding function, excluding all those within the string decoding function itself
	let decodingUsages = findRecursiveUsages(tree, decodingFuncDeclaration, {excludeSubtrees: [decodingFunc.functionReference]});

	return reduce(new CallReplaceReducer(decodingUsages, decodingFunc), tree);
}

module.exports.analyze = function(tree) {
	return analyze(tree);
}