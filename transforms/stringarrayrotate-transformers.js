/**
 * Undo the string array rotation transform
 */

const { parse } = require('../parsers/stringarrayrotate-parser')

function analyze(tree, globalScope, stringDecodingFuncReference) {
	let parsedTree = parse(tree, globalScope, stringDecodingFuncReference);
	console.log(parsedTree);
	throw new Error('StringArrayRotationTransformer not implemented yet')
}

module.exports.analyze = function(tree, globalScope, stringDecodingFuncReferences) {
	return analyze(tree, globalScope, stringDecodingFuncReferences);
}
