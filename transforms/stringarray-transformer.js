/**
 * Undo the string array transform
 * NOTE: Must be executed AFTER stringarrayrotate transform, if that is enabled
 */

const { reduce } = require('shift-reducer');

const { analyzeStrArrDecodingFunc } = require('../parsers/stringarray-parser');
const { declarationUsages, findIndirectReferences } = require('../utils/references-finder');
const { CallReplaceReducer } = require('../reducers/call-replace-reducer');

function analyze(tree) {
	let decodingFunc = analyzeStrArrDecodingFunc(tree);

	let decodingFuncDeclaration = decodingFunc.functionReference.name // Get an IdentifierExpression object
	// Find all the references to the string decoding function, excluding all those within the string decoding function itself
	let decodingFuncReferences = declarationUsages(tree, decodingFuncDeclaration, {excludeSubtrees: [decodingFunc.functionReference]});
	let indirectReferences = findIndirectReferences(tree, decodingFuncReferences);
	return reduce(new CallReplaceReducer(indirectReferences, decodingFunc), tree);
}

module.exports.analyze = function(tree) {
	return analyze(tree);
}