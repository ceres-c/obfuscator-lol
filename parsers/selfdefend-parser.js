/**
 * Analyze code such as:
 * function hi(){var _0x3b1c48=(function(){var _0x2f3f23=!![];return function(_0x42d358,_0x10396e){var _0x5af8e5=_0x2f3f23?function(){if(_0x10396e){var _0x40c744=_0x10396e['apply'](_0x42d358,arguments);_0x10396e=null;return _0x40c744;}}:function(){};_0x2f3f23=![];return _0x5af8e5;};}());var _0x558dd4=_0x3b1c48(this,function(){return _0x558dd4['toString']()['search']('(((.+)+)+)+$')['toString']()['constructor'](_0x558dd4)['search']('(((.+)+)+)+$');});_0x558dd4();console['log']('Hello\x20World!');}hi();
 * 
 * Note: This code will hang if prettyfied
 */

const query = require('shift-query');

function check(tree) {
	// VariableDeclaration:has(CallExpression LiteralStringExpression[value='(((.+)+)+)+$'])
	throw new Error('Self defending code check not implemented yet');
}

function parse(tree) {
	let retObj = {
		applyFunctionDeclarator: undefined, // VariableDeclarator object - variable being declared to 'apply' function
		searchFunctionDeclarator: undefined, // VariableDeclarator object - variable being declared to 'search' function

		// e.g.
		//     applyFunctionDeclarator
		//	   |________
		// var _0x3b1c48=(function(){var _0x2f3f23=!![];return function(_0x42d358,_0x10396e){var _0x5af8e5=_0x2f3f23?function(){if(_0x10396e){var _0x40c744=_0x10396e['apply'](_0x42d358,arguments);_0x10396e=null;return _0x40c744;}}:function(){};_0x2f3f23=![];return _0x5af8e5;};}());
		//     searchFunctionDeclarator
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

	let searchDeclarationQuery = query(tree, 'VariableDeclaration:has(CallExpression LiteralStringExpression[value="(((.+)+)+)+$"])');
	checkQueryResults(searchDeclarationQuery, 'Self defending code protection search function');
	searchDeclarationQuery = searchDeclarationQuery[0];

	retObj.searchFunctionDeclarator = searchDeclarationQuery.declarators[0];
	let applyFunctionIdentifierName = retObj.searchFunctionDeclarator?.init?.callee.name;

	if (retObj.searchFunctionDeclarator === undefined || applyFunctionIdentifierName === undefined) {
		throw new Error('undefined searchFunctionDeclarator or applyFunctionIdentifierName');
	}

	let applyDeclarationQuery = query(tree, `VariableDeclaration:has(VariableDeclarator BindingIdentifier[name='${applyFunctionIdentifierName}'])`);
	checkQueryResults(applyDeclarationQuery, 'Self defending code protection apply function');
	applyDeclarationQuery = applyDeclarationQuery[0];

	retObj.applyFunctionDeclarator = applyDeclarationQuery.declarators[0];

	return retObj;
}

module.exports.check = function(tree) {
	return check(tree);
}
module.exports.parse = function(tree) {
	return parse(tree);
}
