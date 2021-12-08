// 
/**
 * Various helpers devoted to extract data from the string decoding function
 *
 * This code was written to support functions such as this:
 *	function b(c, d) {
 *		var e = a(); // a() returns the array of encoded strings 
 *		b = function (f, g) {
 *			f = f - 0x8c;
 *			var h = e[f];
 *			if (b['mEwsuh'] === undefined) {
 *				var i = function (m) {
 *					var n = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
 *					var o = '';
 *					var p = '';
 *					for (var q = 0x0, r, s, t = 0x0; s = m['charAt'](t++); ~s && (r = q % 0x4 ? r * 0x40 + s : s, q++ % 0x4) ? o += String['fromCharCode'](0xff & r >> (-0x2 * q & 0x6)) : 0x0) {
 *						s = n['indexOf'](s);
 *					}
 *					for (var u = 0x0, v = o['length']; u < v; u++) {
 *						p += '%' + ('00' + o['charCodeAt'](u)['toString'](0x10))['slice'](-0x2);
 *					}
 *					return decodeURIComponent(p);
 *				};
 *				b['xbHKig'] = i;
 *				c = arguments;
 *				b['mEwsuh'] = !![];
 *			}
 *			var j = e[0x0];
 *			var k = f + j;
 *			var l = c[k];
 *			if (!l) {
 *				h = b['xbHKig'](h);
 *				c[k] = h;
 *			} else {
 *				h = l;
 *			}
 *			return h;
 *		};
 *		return b(c, d);
 *	}
 */

const query = require('shift-query');

/**
 * Given the whole ast of a program obfuscated by obfuscator.io, returns the section
 * of ast containing the string decoding function 
 * Returns:
 *	- FunctionDeclaration object
 */
function _getStrArrDecodeFunc(globalAST) {
	let functionQuery = query(globalAST, 'FunctionDeclaration:has(LiteralStringExpression[value="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="])');
	if (functionQuery.length == 0) {
		throw new Error('Could not locate base64 decoding function');
	} else if (functionQuery.length > 1) {
		throw new Error(`Found too many potential base64 decoding functions: ${functionQuery.map(f => f?.name?.name)}`);
	}
	return functionQuery[0];
}

/**
 * Given the body of the string decoding function, will return the section of ast
 * containing the actual decoding subfunction, which is the inner anonymous function
 * being assigned to `f` in above example code.
 * Returns:
 *	- FunctionExpression object
 */
function _getDecodeSubFunc(decodeAST) {
	let subfunctionQuery = query(decodeAST, 'AssignmentExpression > FunctionExpression');
	if (subfunctionQuery.length == 0) {
		throw new Error('Could not locate base64 decoding SUBfunction');
	} else if (subfunctionQuery.length > 1) {
		throw new Error(`Found too many potential base64 decoding SUBfunctions: ${subfunctionQuery.map(f => f?.name?.name)}`);
	}
	return subfunctionQuery[0];
}

/**
 * Given the subfunction in the strng decoding function, will return the numeric value
 * that has to be added to the index being passed to the string decoding function
 * to find the correct element in the encoded strings array.
 * In the above example, from this line `f = f - 0x8c;`, will return -0x8c
 * Returns:
 *	- A signed number
 */
function _getStrArrOffset(decodeSubAST) {
	// Identify first parameter of this function, which is the string index inside encoded strings' array
	let firstParamName = decodeSubAST.params['items'][0]['name']
	// Find expressions such as `f = f - 0x19e;`
	let offsetCalculationExpr = query(decodeSubAST, `ExpressionStatement:has(AssignmentTargetIdentifier[name="${firstParamName}"]):has(BinaryExpression[right.type="LiteralNumericExpression"]) BinaryExpression`);
	if (offsetCalculationExpr.length == 0) {
		throw new Error('Could not locate strings array index offset calculation');
	} else if (offsetCalculationExpr.length > 1) {
		throw new Error(`Found too many potential strings array index offset calculations`);
	}
	offsetCalculationExpr = offsetCalculationExpr[0];

	if (offsetCalculationExpr.operator === undefined) {
		throw new Error('Could not determine strings array offset operator in BinaryExpression')
	}
	if (offsetCalculationExpr?.right?.value === undefined) {
		throw new Error('Could not determine strings array offset value in BinaryExpression')
	}

	// Get actual numeric value from expression, accounting for positive and negative offsets
	// Concatenate operator string to numeric number, then convert to signed numeric
	return Number(offsetCalculationExpr.operator + offsetCalculationExpr.right.value)
}

// TODO doc
// Accepts function ast
function _getStrArrFuncName(decodeAST) {
	let arrayFunctionCallExpr = query(decodeAST, 'FunctionBody > VariableDeclarationStatement VariableDeclarator > CallExpression');
	if (arrayFunctionCallExpr.length == 0) {
		throw new Error('Could not locate strings array function call in string decoding function');
	} else if (arrayFunctionCallExpr.length > 1) {
		throw new Error('Found too many potential strings array function calls in string decoding function');
	}
	arrayFunctionCallExpr = arrayFunctionCallExpr[0];

	if (arrayFunctionCallExpr?.callee?.name === undefined) {
		throw new Error('Could not find strings array function name');
	}
	return arrayFunctionCallExpr.callee.name;
}

/**
 * Given the whole ast of a program obfuscated by obfuscator.io, returns
 * the array containing the encoded strings.
 * Args:
 *	- globalAST: the whole ast of the program
 *	- strArrFunctionName: The name of the function returning the strings array
 * Returns:
 *	- An array of strings
 */
function _getStrArr(globalAST, strArrFunctionName) {
	let arrayExpr = query(globalAST, `FunctionDeclaration[name.name="${strArrFunctionName}"] ArrayExpression`);
	if (arrayExpr.length == 0) {
		throw new Error('Could not locate strings array');
	} else if (arrayExpr.length > 1) {
		throw new Error(`Found too many potential strings array`);
	}
	arrayExpr = arrayExpr[0];

	if (arrayExpr.elements === undefined) {
		throw new Error('Could not find strings array elements');
	}
	return arrayExpr.elements;
}

// TODO doc
function analyzeStrArrDecodingFunc(globalAST) {
	let retObj = { // TODO document these
		functionReference: undefined,
		offset: undefined,
		stringsArray: undefined,
	}

	let decodeFunc = _getStrArrDecodeFunc(globalAST);

	retObj.functionReference = decodeFunc;

	let stringsArrayFunctionName = _getStrArrFuncName(decodeFunc);
	retObj.stringsArray = _getStrArr(globalAST, stringsArrayFunctionName).map(e => e['value']);

	let subFuncAST = _getDecodeSubFunc(decodeFunc); // TODO move this function call to _getStrArrOffset or remove altogether (query subfunction directly)
	retObj.offset = _getStrArrOffset(subFuncAST);

	return retObj;
}

module.exports.analyzeStrArrDecodingFunc = function(globalAST) {
	return analyzeStrArrDecodingFunc(globalAST);
}
