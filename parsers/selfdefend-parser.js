/**
 * Analyze code such as:
 * function hi(){var _0x3b1c48=(function(){var _0x2f3f23=!![];return function(_0x42d358,_0x10396e){var _0x5af8e5=_0x2f3f23?function(){if(_0x10396e){var _0x40c744=_0x10396e['apply'](_0x42d358,arguments);_0x10396e=null;return _0x40c744;}}:function(){};_0x2f3f23=![];return _0x5af8e5;};}());var _0x558dd4=_0x3b1c48(this,function(){return _0x558dd4['toString']()['search']('(((.+)+)+)+$')['toString']()['constructor'](_0x558dd4)['search']('(((.+)+)+)+$');});_0x558dd4();console['log']('Hello\x20World!');}hi();
 *
 * Note: This code will hang if prettyfied
 *
 * Identification based on textual pattern `(((.+)+)+)+$` from
 * https://github.com/javascript-obfuscator/javascript-obfuscator/blob/master/src/custom-code-helpers/self-defending/templates/SelfDefendingTemplate.ts
 */

const query = require('shift-query');

function check(tree) {
	// VariableDeclaration:has(CallExpression LiteralStringExpression[value='(((.+)+)+)+$'])
	throw new Error('Self defending code check not implemented yet');
}

function parse(tree) {
	let retObj = {
		callControllerFuncDeclarator: undefined, // VariableDeclarator object - variable being declared to 'apply' function
		selfDefFuncDeclarator: undefined, // VariableDeclarator object - variable being declared to 'search' function

		// e.g.
		//     callControllerFuncDeclarator
		//	   |________
		// var _0x3b1c48=(function(){var _0x2f3f23=!![];return function(_0x42d358,_0x10396e){var _0x5af8e5=_0x2f3f23?function(){if(_0x10396e){var _0x40c744=_0x10396e['apply'](_0x42d358,arguments);_0x10396e=null;return _0x40c744;}}:function(){};_0x2f3f23=![];return _0x5af8e5;};}());
		//     selfDefFuncDeclarator
		//	   |________
		// var _0x558dd4 = _0x3b1c48(this, function () {
		// 	return _0x558dd4['toString']()['search']('(((.+)+)+)+$')['toString']()['constructor'](_0x558dd4)['search']('(((.+)+)+)+$');
		// });
	}

	function checkQueryResults(queryResult, queryName) {
		if (queryResult?.length === undefined || queryResult.length == 0) {
			throw new Error(`Could not locate ${queryName}`);
		} else if (queryResult.length > 1) {
			throw new Error(`Found too many (${queryResult.length}) potential ${queryName}s`);
		}
	}

	let selfDefFuncDeclarationQuery = query(tree, 'VariableDeclaration:has(CallExpression LiteralStringExpression[value="(((.+)+)+)+$"])');
	checkQueryResults(selfDefFuncDeclarationQuery, 'Self defending code protection search function');
	selfDefFuncDeclarationQuery = selfDefFuncDeclarationQuery[0];

	retObj.selfDefFuncDeclarator = selfDefFuncDeclarationQuery.declarators[0];
	let callControllerFuncIdentifierName = retObj.selfDefFuncDeclarator?.init?.callee.name;

	if (retObj.selfDefFuncDeclarator === undefined || callControllerFuncIdentifierName === undefined) {
		throw new Error('undefined searchFunctionDeclarator or applyFunctionIdentifierName');
	}

	let callControllerFuncDeclarationQuery = query(tree, `VariableDeclaration:has(VariableDeclarator BindingIdentifier[name='${callControllerFuncIdentifierName}'])`);
	checkQueryResults(callControllerFuncDeclarationQuery, 'Self defending code protection apply function');
	callControllerFuncDeclarationQuery = callControllerFuncDeclarationQuery[0];

	retObj.callControllerFuncDeclarator = callControllerFuncDeclarationQuery.declarators[0];

	return retObj;
}

module.exports.check = function(tree) {
	return check(tree);
}
module.exports.parse = function(tree) {
	return parse(tree);
}
