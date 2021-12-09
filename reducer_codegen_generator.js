methods = ['parenToAvoidBeingDirective', 'regenerateArrowParams', 'reduceArrayExpression', 'reduceAwaitExpression', 'reduceSpreadElement', 'reduceSpreadProperty', 'reduceAssignmentExpression', 'reduceAssignmentTargetIdentifier', 'reduceAssignmentTargetWithDefault', 'reduceCompoundAssignmentExpression', 'reduceBinaryExpression', 'reduceBindingWithDefault', 'reduceBindingIdentifier', 'reduceArrayAssignmentTarget', 'reduceArrayBinding', 'reduceObjectAssignmentTarget', 'reduceObjectBinding', 'reduceAssignmentTargetPropertyIdentifier', 'reduceAssignmentTargetPropertyProperty', 'reduceBindingPropertyIdentifier', 'reduceBindingPropertyProperty', 'reduceBlock', 'reduceBlockStatement', 'reduceBreakStatement', 'reduceCallExpression', 'reduceCatchClause', 'reduceClassDeclaration', 'reduceClassExpression', 'reduceClassElement', 'reduceComputedMemberAssignmentTarget', 'reduceComputedMemberExpression', 'reduceComputedPropertyName', 'reduceConditionalExpression', 'reduceContinueStatement', 'reduceDataProperty', 'reduceDebuggerStatement', 'reduceDoWhileStatement', 'reduceEmptyStatement', 'reduceExpressionStatement', 'reduceForInStatement', 'reduceForOfStatement', 'reduceForStatement', 'reduceForAwaitStatement', 'reduceFunctionBody', 'reduceFunctionDeclaration', 'reduceFunctionExpression', 'reduceFormalParameters', 'reduceArrowExpression', 'reduceGetter', 'reduceIdentifierExpression', 'reduceIfStatement', 'reduceImport', 'reduceImportNamespace', 'reduceImportSpecifier', 'reduceExportAllFrom', 'reduceExportFrom', 'reduceExportLocals', 'reduceExport', 'reduceExportDefault', 'reduceExportFromSpecifier', 'reduceExportLocalSpecifier', 'reduceLabeledStatement', 'reduceLiteralBooleanExpression', 'reduceLiteralNullExpression', 'reduceLiteralInfinityExpression', 'reduceLiteralNumericExpression', 'reduceLiteralRegExpExpression', 'reduceLiteralStringExpression', 'reduceMethod', 'reduceModule', 'reduceNewExpression', 'reduceNewTargetExpression', 'reduceObjectExpression', 'reduceUpdateExpression', 'reduceUnaryExpression', 'reduceReturnStatement', 'reduceScript', 'reduceSetter', 'reduceShorthandProperty', 'reduceStaticMemberAssignmentTarget', 'reduceStaticMemberExpression', 'reduceStaticPropertyName', 'reduceSuper', 'reduceSwitchCase', 'reduceSwitchDefault', 'reduceSwitchStatement', 'reduceSwitchStatementWithDefault', 'reduceTemplateExpression', 'reduceTemplateElement', 'reduceThisExpression', 'reduceThrowStatement', 'reduceTryCatchStatement', 'reduceTryFinallyStatement', 'reduceYieldExpression', 'reduceYieldGeneratorExpression', 'reduceDirective', 'reduceVariableDeclaration', 'reduceVariableDeclarationStatement', 'reduceVariableDeclarator', 'reduceWhileStatement', 'reduceWithStatement']

/**
 * Example code:
 *	const codegen = require('shift-codegen');
 *	
 *	class FormattedCodeGenWithStrs extends codegen.FormattedCodeGen {
 *	  reduceLiteralStringExpression(node) {
 *		throw new Error('Found an unsupported and unsafe ${m} while codegenerating.');
 *	  }
 *	}
 *	
 *	module.exports = function (tree) {
 *	  return codegen.default(tree, new FormattedCodeGenWithStrs);
 *	};
 * 
 */
let resultCode = '';
for (let m of methods) {
	resultCode += m;
	resultCode += '(node) {\n';
	resultCode += `\tthrow new Error('Found an unsupported and unsafe ${m} while codegenerating.');\n`;
	resultCode += '}\n';
}
console.log(resultCode);