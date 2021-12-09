/**
 * A custom codegen blacklisting every operation not required by statements such as:
 *	`parseInt(R(0x144, '2IW$')) / 0x1 + parseInt(S(0x145, 'N0hG'))`
 * Even to parse the above expression, identifiers such as parseInt, R and S must be passed explicitly to the constructor,
 * same goes for unary/binary operators.
 */
'use strict';

const codegen = require('shift-codegen');

class ParseIntCodegen extends codegen.MinimalCodeGen {
	constructor(safeIdentifiers, safeOperators) {
		if (safeIdentifiers === undefined || safeIdentifiers.length === 0) {
			throw new Error("The list of safe identifiers can't be empty");
		}
		if (safeOperators === undefined || safeOperators.length === 0) {
			throw new Error("The list of safe binary operators can't be empty");
		}
		super();
		this.safeIdentifiers = safeIdentifiers;
		this.safeOperators = safeOperators;
	}

	reduceArrayExpression(node) {
		throw new Error('Found an unsupported and unsafe ArrayExpression while codegenerating.');
	}
	reduceAwaitExpression(node) {
		throw new Error('Found an unsupported and unsafe AwaitExpression while codegenerating.');
	}
	reduceSpreadElement(node) {
		throw new Error('Found an unsupported and unsafe SpreadElement while codegenerating.');
	}
	reduceSpreadProperty(node) {
		throw new Error('Found an unsupported and unsafe SpreadProperty while codegenerating.');
	}
	reduceAssignmentExpression(node) {
		throw new Error('Found an unsupported and unsafe AssignmentExpression while codegenerating.');
	}
	reduceAssignmentTargetIdentifier(node) {
		throw new Error('Found an unsupported and unsafe AssignmentTargetIdentifier while codegenerating.');
	}
	reduceAssignmentTargetWithDefault(node) {
		throw new Error('Found an unsupported and unsafe AssignmentTargetWithDefault while codegenerating.');
	}
	reduceCompoundAssignmentExpression(node) {
		throw new Error('Found an unsupported and unsafe CompoundAssignmentExpression while codegenerating.');
	}
	reduceBinaryExpression(node, _ref8) {
		if (!this.safeOperators.includes(node.operator)) {
			throw new Error(`Found an unsupported and unsafe BinaryExpression with operator '${node.operator}' while codegenerating.`);
		} else {
			return super.reduceBinaryExpression(node, _ref8);
		}
	}
	reduceBindingWithDefault(node) {
		throw new Error('Found an unsupported and unsafe BindingWithDefault while codegenerating.');
	}
	reduceBindingIdentifier(node) {
		throw new Error('Found an unsupported and unsafe BindingIdentifier while codegenerating.');
	}
	reduceArrayAssignmentTarget(node) {
		throw new Error('Found an unsupported and unsafe ArrayAssignmentTarget while codegenerating.');
	}
	reduceArrayBinding(node) {
		throw new Error('Found an unsupported and unsafe ArrayBinding while codegenerating.');
	}
	reduceObjectAssignmentTarget(node) {
		throw new Error('Found an unsupported and unsafe ObjectAssignmentTarget while codegenerating.');
	}
	reduceObjectBinding(node) {
		throw new Error('Found an unsupported and unsafe ObjectBinding while codegenerating.');
	}
	reduceAssignmentTargetPropertyIdentifier(node) {
		throw new Error('Found an unsupported and unsafe AssignmentTargetPropertyIdentifier while codegenerating.');
	}
	reduceAssignmentTargetPropertyProperty(node) {
		throw new Error('Found an unsupported and unsafe AssignmentTargetPropertyProperty while codegenerating.');
	}
	reduceBindingPropertyIdentifier(node) {
		throw new Error('Found an unsupported and unsafe BindingPropertyIdentifier while codegenerating.');
	}
	reduceBindingPropertyProperty(node) {
		throw new Error('Found an unsupported and unsafe BindingPropertyProperty while codegenerating.');
	}
	reduceBlock(node) {
		throw new Error('Found an unsupported and unsafe Block while codegenerating.');
	}
	reduceBlockStatement(node) {
		throw new Error('Found an unsupported and unsafe BlockStatement while codegenerating.');
	}
	reduceBreakStatement(node) {
		throw new Error('Found an unsupported and unsafe BreakStatement while codegenerating.');
	}
	reduceCallExpression(node, _ref20) {
		if (!this.safeIdentifiers.includes(node.callee.name)) {			
			throw new Error('Found an unsupported and unsafe CallExpression while codegenerating.');
		} else {
			return super.reduceCallExpression(node, _ref20);
		}
	}
	reduceCatchClause(node) {
		throw new Error('Found an unsupported and unsafe CatchClause while codegenerating.');
	}
	reduceClassDeclaration(node) {
		throw new Error('Found an unsupported and unsafe ClassDeclaration while codegenerating.');
	}
	reduceClassExpression(node) {
		throw new Error('Found an unsupported and unsafe ClassExpression while codegenerating.');
	}
	reduceClassElement(node) {
		throw new Error('Found an unsupported and unsafe ClassElement while codegenerating.');
	}
	reduceComputedMemberAssignmentTarget(node) {
		throw new Error('Found an unsupported and unsafe ComputedMemberAssignmentTarget while codegenerating.');
	}
	reduceComputedMemberExpression(node) {
		throw new Error('Found an unsupported and unsafe ComputedMemberExpression while codegenerating.');
	}
	reduceComputedPropertyName(node) {
		throw new Error('Found an unsupported and unsafe ComputedPropertyName while codegenerating.');
	}
	reduceConditionalExpression(node) {
		throw new Error('Found an unsupported and unsafe ConditionalExpression while codegenerating.');
	}
	reduceContinueStatement(node) {
		throw new Error('Found an unsupported and unsafe ContinueStatement while codegenerating.');
	}
	reduceDataProperty(node) {
		throw new Error('Found an unsupported and unsafe DataProperty while codegenerating.');
	}
	reduceDebuggerStatement(node) {
		throw new Error('Found an unsupported and unsafe DebuggerStatement while codegenerating.');
	}
	reduceDoWhileStatement(node) {
		throw new Error('Found an unsupported and unsafe DoWhileStatement while codegenerating.');
	}
	reduceEmptyStatement(node) {
		throw new Error('Found an unsupported and unsafe EmptyStatement while codegenerating.');
	}
	reduceExpressionStatement(node, _ref31) {
			return super.reduceExpressionStatement(node, _ref31);
	}
	reduceForInStatement(node) {
		throw new Error('Found an unsupported and unsafe ForInStatement while codegenerating.');
	}
	reduceForOfStatement(node) {
		throw new Error('Found an unsupported and unsafe ForOfStatement while codegenerating.');
	}
	reduceForStatement(node) {
		throw new Error('Found an unsupported and unsafe ForStatement while codegenerating.');
	}
	reduceForAwaitStatement(node) {
		throw new Error('Found an unsupported and unsafe ForAwaitStatement while codegenerating.');
	}
	reduceFunctionBody(node) {
		throw new Error('Found an unsupported and unsafe FunctionBody while codegenerating.');
	}
	reduceFunctionDeclaration(node) {
		throw new Error('Found an unsupported and unsafe FunctionDeclaration while codegenerating.');
	}
	reduceFunctionExpression(node) {
		throw new Error('Found an unsupported and unsafe FunctionExpression while codegenerating.');
	}
	reduceFormalParameters(node) {
		throw new Error('Found an unsupported and unsafe FormalParameters while codegenerating.');
	}
	reduceArrowExpression(node) {
		throw new Error('Found an unsupported and unsafe ArrowExpression while codegenerating.');
	}
	reduceGetter(node) {
		throw new Error('Found an unsupported and unsafe Getter while codegenerating.');
	}
	reduceIdentifierExpression(node) {
		if (!this.safeIdentifiers.includes(node.name)) {
			throw new Error(`Found an unsupported and unsafe IdentifierExpression '${node.name}' while codegenerating.`);
		} else {
			return super.reduceIdentifierExpression(node);
		}
	}
	reduceIfStatement(node) {
		throw new Error('Found an unsupported and unsafe IfStatement while codegenerating.');
	}
	reduceImport(node) {
		throw new Error('Found an unsupported and unsafe Import while codegenerating.');
	}
	reduceImportNamespace(node) {
		throw new Error('Found an unsupported and unsafe ImportNamespace while codegenerating.');
	}
	reduceImportSpecifier(node) {
		throw new Error('Found an unsupported and unsafe ImportSpecifier while codegenerating.');
	}
	reduceExportAllFrom(node) {
		throw new Error('Found an unsupported and unsafe ExportAllFrom while codegenerating.');
	}
	reduceExportFrom(node) {
		throw new Error('Found an unsupported and unsafe ExportFrom while codegenerating.');
	}
	reduceExportLocals(node) {
		throw new Error('Found an unsupported and unsafe ExportLocals while codegenerating.');
	}
	reduceExport(node) {
		throw new Error('Found an unsupported and unsafe Export while codegenerating.');
	}
	reduceExportDefault(node) {
		throw new Error('Found an unsupported and unsafe ExportDefault while codegenerating.');
	}
	reduceExportFromSpecifier(node) {
		throw new Error('Found an unsupported and unsafe ExportFromSpecifier while codegenerating.');
	}
	reduceExportLocalSpecifier(node) {
		throw new Error('Found an unsupported and unsafe ExportLocalSpecifier while codegenerating.');
	}
	reduceLabeledStatement(node) {
		throw new Error('Found an unsupported and unsafe LabeledStatement while codegenerating.');
	}
	reduceLiteralBooleanExpression(node) {
		throw new Error('Found an unsupported and unsafe LiteralBooleanExpression while codegenerating.');
	}
	reduceLiteralNullExpression(node) {
		throw new Error('Found an unsupported and unsafe LiteralNullExpression while codegenerating.');
	}
	reduceLiteralInfinityExpression(node) {
		throw new Error('Found an unsupported and unsafe LiteralInfinityExpression while codegenerating.');
	}
	reduceLiteralRegExpExpression(node) {
		throw new Error('Found an unsupported and unsafe LiteralRegExpExpression while codegenerating.');
	}
	reduceMethod(node) {
		throw new Error('Found an unsupported and unsafe Method while codegenerating.');
	}
	reduceModule(node) {
		throw new Error('Found an unsupported and unsafe Module while codegenerating.');
	}
	reduceNewExpression(node) {
		throw new Error('Found an unsupported and unsafe NewExpression while codegenerating.');
	}
	reduceNewTargetExpression(node) {
		throw new Error('Found an unsupported and unsafe NewTargetExpression while codegenerating.');
	}
	reduceObjectExpression(node) {
		throw new Error('Found an unsupported and unsafe ObjectExpression while codegenerating.');
	}
	reduceUpdateExpression(node) {
		throw new Error('Found an unsupported and unsafe UpdateExpression while codegenerating.');
	}
	reduceUnaryExpression(node, _ref57) {
		if (!this.safeOperators.includes(node.operator)) {
			throw new Error(`Found an unsupported and unsafe UnaryExpression with operator '${node.operator}' while codegenerating.`);
		} else {
			return super.reduceUnaryExpression(node, _ref57);
		}

		throw new Error('Found an unsupported and unsafe UnaryExpression while codegenerating.');
	}
	reduceReturnStatement(node) {
		throw new Error('Found an unsupported and unsafe ReturnStatement while codegenerating.');
	}
	reduceSetter(node) {
		throw new Error('Found an unsupported and unsafe Setter while codegenerating.');
	}
	reduceShorthandProperty(node) {
		throw new Error('Found an unsupported and unsafe ShorthandProperty while codegenerating.');
	}
	reduceStaticMemberAssignmentTarget(node) {
		throw new Error('Found an unsupported and unsafe StaticMemberAssignmentTarget while codegenerating.');
	}
	reduceStaticMemberExpression(node) {
		throw new Error('Found an unsupported and unsafe StaticMemberExpression while codegenerating.');
	}
	reduceStaticPropertyName(node) {
		throw new Error('Found an unsupported and unsafe StaticPropertyName while codegenerating.');
	}
	reduceSuper(node) {
		throw new Error('Found an unsupported and unsafe Super while codegenerating.');
	}
	reduceSwitchCase(node) {
		throw new Error('Found an unsupported and unsafe SwitchCase while codegenerating.');
	}
	reduceSwitchDefault(node) {
		throw new Error('Found an unsupported and unsafe SwitchDefault while codegenerating.');
	}
	reduceSwitchStatement(node) {
		throw new Error('Found an unsupported and unsafe SwitchStatement while codegenerating.');
	}
	reduceSwitchStatementWithDefault(node) {
		throw new Error('Found an unsupported and unsafe SwitchStatementWithDefault while codegenerating.');
	}
	reduceTemplateExpression(node) {
		throw new Error('Found an unsupported and unsafe TemplateExpression while codegenerating.');
	}
	reduceTemplateElement(node) {
		throw new Error('Found an unsupported and unsafe TemplateElement while codegenerating.');
	}
	reduceThisExpression(node) {
		throw new Error('Found an unsupported and unsafe ThisExpression while codegenerating.');
	}
	reduceThrowStatement(node) {
		throw new Error('Found an unsupported and unsafe ThrowStatement while codegenerating.');
	}
	reduceTryCatchStatement(node) {
		throw new Error('Found an unsupported and unsafe TryCatchStatement while codegenerating.');
	}
	reduceTryFinallyStatement(node) {
		throw new Error('Found an unsupported and unsafe TryFinallyStatement while codegenerating.');
	}
	reduceYieldExpression(node) {
		throw new Error('Found an unsupported and unsafe YieldExpression while codegenerating.');
	}
	reduceYieldGeneratorExpression(node) {
		throw new Error('Found an unsupported and unsafe YieldGeneratorExpression while codegenerating.');
	}
	reduceDirective(node) {
		throw new Error('Found an unsupported and unsafe Directive while codegenerating.');
	}
	reduceVariableDeclaration(node) {
		throw new Error('Found an unsupported and unsafe VariableDeclaration while codegenerating.');
	}
	reduceVariableDeclarationStatement(node) {
		throw new Error('Found an unsupported and unsafe VariableDeclarationStatement while codegenerating.');
	}
	reduceVariableDeclarator(node) {
		throw new Error('Found an unsupported and unsafe VariableDeclarator while codegenerating.');
	}
	reduceWhileStatement(node) {
		throw new Error('Found an unsupported and unsafe WhileStatement while codegenerating.');
	}
	reduceWithStatement(node) {
		throw new Error('Found an unsupported and unsafe WithStatement while codegenerating.');
	}
}

module.exports = function (tree, safeIdentifiers, safeOperators) {
	return codegen.default(tree, new ParseIntCodegen(safeIdentifiers, safeOperators));
};
