/**
 * Analyze functions such as:
 *	(function (c, d) {
 *	  var R = b;
 *	  var S = b;
 *	  var e = c();
 *	  while (!![]) {
 *	    try {
 *	      var f = parseInt(R(0x144, '2IW$')) / 0x1 + parseInt(R(0x145, 'N0hG')) / 0x2 + parseInt(S(0x146, 'alwv')) / 0x3 * (parseInt(R(0x147, 'wUOp')) / 0x4) + parseInt(S(0x148, ')e2V')) / 0x5 * (parseInt(S(0x149, 'Q8vK')) / 0x6) + -parseInt(R(0x14a, 'b^0g')) / 0x7 * (parseInt(S(0x14b, 'HcX]')) / 0x8) + parseInt(S(0x14c, 'X6J)')) / 0x9 + -parseInt(S(0x14d, 'Zv*S')) / 0xa;
 *	      if (f === d) {
 *	        break;
 *	      } else {
 *	        e['push'](e['shift']());
 *	      }
 *	    } catch (g) {
 *	      e['push'](e['shift']());
 *	    }
 *	  }
 *	}(a, 0xeb660));
 */

const query = require('shift-query');
const { reduce } = require('shift-reducer');
const { DeclarationReferenceReducer } = require('../reducers/declaration-reference-reducer');
const { findDeclarationScope } = require('../utils/scope-traversal');

function check(tree) {
	// ExpressionStatement > CallExpression > FunctionExpression > FunctionBody > WhileStatement[test.operand.operand.elements='']
	throw new Error('StringArrayRotation check not implemented yet');
}

function parse(tree, globalScope, stringDecodingFuncReferences) {
	let retObj = {
		functionReference: undefined,
		functionData: {
			checkExpressionReference: undefined,
			stringDecodingReferences: [],
			finalValue: undefined,
		}
	}

	// TODO remove every parameter apart from tree and calculate locally globalScope and stringDecodingFuncReferences
	/**
	 * TODO
	 * Passare a questa funzione solamente tree e stringDecodingFunctionReference,
	 * cioè la singla reference alla definizione della funzione che decoda le stringhe.
	 * Bisogna spostare le operazioni per ottenere stringDecodingFuncReferences in un helper da qualche parte.
	 * Questo helper deve prendere in input:
	 *	- un AST globale per calcolare lo scope
	 *	- uno specifico elemento (il target da cercare)
	 *	- un sub-AST, quello in cui serve cercare le reference
	 * e restituire la lista delle reference indirette all'interno del sub-ast.
	 * Possibilmente deve anche risolvere automaticamente le reference indirette multiple.
	 */

	function checkQueryResults(queryResult, queryName) {
		if (queryResult.length == 0) {
			throw new Error(`Could not locate ${queryName}`);
		} else if (queryResult.length > 1) {
			throw new Error(`Found too many (${queryResult.length}) potential ${queryName}s`);
		}
	}

	let callQuery = query(tree, 'ExpressionStatement > CallExpression:has(FunctionExpression > FunctionBody > WhileStatement)');
	// Filter out only functions being called with an identifier and a number
	callQuery = callQuery.filter(c => c.arguments.length == 2 && c.arguments[0]?.type == 'IdentifierExpression' && c.arguments[1]?.type == 'LiteralNumericExpression');
	checkQueryResults(callQuery, 'StringArrayRotation function');
	callQuery = callQuery[0];

	retObj.functionReference = callQuery.callee;

	// Find init value of the check expression (`var f = ...` above)
	let variableExpressionQuery = query(retObj.functionReference, 'WhileStatement TryCatchStatement > Block > VariableDeclarationStatement')
	checkQueryResults(variableExpressionQuery, 'check expression');
	variableExpressionQuery = variableExpressionQuery[0];
	if (variableExpressionQuery?.declaration?.declarators?.length != 1) {
		throw new Error(`Found wrong number of declarators in check expression init: ${variableExpressionQuery?.declaration?.declarators?.length}`);
	}
	retObj.functionData.checkExpressionReference = variableExpressionQuery?.declaration?.declarators[0].init;

	// Find references to string decoding function calls
	let functionRedeclarations = reduce(new DeclarationReferenceReducer(stringDecodingFuncReferences), retObj.functionReference).values;
	let indirectCalls = [];
	for (let d of functionRedeclarations) {
		let variableScope = findDeclarationScope(globalScope, d);
		indirectCalls.push(...variableScope.variables.get(d.name).references.filter(r => r.accessibility.isRead).map(r => r.node));
		// Potentially, the above filter could be empty since declared variables are not always used

		// TODO handle String Array Wrappers > 1.
	}
	retObj.functionData.stringDecodingReferences = indirectCalls;

	retObj.functionData.finalValue = callQuery.arguments[1].value;

	return retObj;
}

module.exports.check = function(tree) {
	return check(tree);
}
module.exports.parse = function(tree, globalScope, stringDecodingFuncReferences) {
	return parse(tree, globalScope, stringDecodingFuncReferences);
}
