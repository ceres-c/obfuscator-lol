/**
 * Remove self defending code
 */

const { reduce } = require('shift-reducer');

const { parse } = require('../parsers/selfdefend-parser');
const { declarationUsages } = require('../utils/references-finder');
const { CallReplaceReducer, emptyReplacer } = require('../reducers/call-replace-reducer');
const { FunctionRemover } = require('../reducers/function-remover');

function analyze(tree) {
	let parsedSelfDefending = parse(tree);

	let searchFunctionCalls = declarationUsages(
		tree,
		parsedSelfDefending.selfDefFuncDeclarator.binding,
		{ excludeSubtrees: [parsedSelfDefending.selfDefFuncDeclarator], }
	)

	let replacedTree = reduce(new FunctionRemover([ // Remove function declarations
		parsedSelfDefending.callControllerFuncDeclarator, parsedSelfDefending.selfDefFuncDeclarator
	]), tree);

	return reduce(new CallReplaceReducer(searchFunctionCalls, emptyReplacer), replacedTree); // Remove calls to 'search' function
}

module.exports.analyze = function(tree) {
	return analyze(tree);
}