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

function check(tree) {
	// ExpressionStatement > CallExpression > FunctionExpression > FunctionBody > WhileStatement[test.operand.operand.elements='']
	throw new Error('StringArrayRotation check not implemented yet');
}

function parse(tree) {
	let retObj = {
		functionReference: undefined,
		functionData: {
			checkExpressionReference: undefined,
			finalValue: undefined,
		}
	}

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

	retObj.functionData.finalValue = callQuery.arguments[1].value;

	return retObj;
}

module.exports.check = function(tree) {
	return check(tree);
}
module.exports.parse = function(tree, globalScope, stringDecodingFuncReferences) {
	return parse(tree, globalScope, stringDecodingFuncReferences);
}
