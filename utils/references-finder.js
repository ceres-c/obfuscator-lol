const scope = require('shift-scope');
const { reduce } = require('shift-reducer');
const { DeclarationReferenceReducer } = require('../reducers/declaration-reference-reducer');
const { IdentifierTreeFilter } = require('../reducers/identifier-tree-filter');
const { findDeclarationScope } = require('./scope-traversal');

/**
 * Given the identifier `target`, DECLARED inside tree, find all the references to it (scope aware)
 * Args:
 *	- tree: ast containing the declaration of target
 *	- target: BindingIdentifier whose references must be located
 *	- subtrees (optional): array of ast - references will be searched only within this subtree(s)
 *	- excludeSubtrees (optional): array of ast - references inside this subtree(s) will be ignored
 * Return:
 *	- A list of Reference objects:
 *		{node: <node reference>, accessibility: <Accessibility info>}
 */
function recursiveFindReferences(tree, target, recursive=false, {subtrees = [], excludeSubtrees = []} = {}) {
	throw new Error('Recursive finder not implemented yet!')
}

/**
 * Given the identifier `target`, DECLARED inside tree, find all the references to it (scope aware)
 * Args:
 *	- tree: ast containing the declaration of target
 *	- target: BindingIdentifier whose references must be located
 *	- subtrees (optional): array of ast - references will be searched only within this subtree(s)
 *	- excludeSubtrees (optional): array of ast - references inside this subtree(s) will be ignored
 * Return:
 *	- A list of Reference objects:
 *		{node: <node reference>, accessibility: <Accessibility info>}
 */
function declarationUsages(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
	let globalScope = scope.default(tree);

	if (target.name === undefined) {
		throw new Error("Can't find target's name, got undefined");
	}

	// Find a scope containing, among all its declarations, a declaration to the target variable
	let declScope = findDeclarationScope(globalScope, target);
	let references = declScope.variables.get(target.name).references;

	if (subtrees.length > 0) {
		let positiveFilter = []
		for (let t of subtrees) {
			let referencesInSubtree = reduce(new IdentifierTreeFilter(references), t).values;
			if (referencesInSubtree.length > 0) {
				positiveFilter.push(...referencesInSubtree);
			}
		}
		references = positiveFilter;
	}

	for (let t of excludeSubtrees) {
		let referencesInSubtree = reduce(new IdentifierTreeFilter(references), t).values;
		if (referencesInSubtree.length > 0) {
			references = references.filter(r => !referencesInSubtree.includes(r));
		}
	}
	return references;
}

/**
 * Given a Variable object with references and declarations, this function will return
 * an object containing two lists where all the references are split between declarations
 * and actual references.
 * E.g. given the Variable object with
 * Variable.references = [ref1(use), ref2(definition), ref3(use)]
 * The result will be
 *	{
 *		references: [ref1, ref3],
 *		definitions: [ref2]
 * 	}
 * Thus, all the objects in the list will be Reference objects
 */
function filterDeclFromRef(variable) {
	if (variable.declarations === undefined || variable.references === undefined) {
		throw new Error('Variables object does not contain either declarations or references');
	}
	let decl = variable.declarations.map(d => d.node); // Map out for easier access
	let retObj = {
		declarations: [],
		references: [],
	}
	for (let r of variable.references) {
		if (decl.includes(r.node)) {
			retObj.declarations.push(r);
		} else {
			retObj.references.push(r);
		}
	}
	return retObj;
}

/**
 * Given an ast and a list of references, find which are used to be assigned to another variable
 * For example. in code such as
 *	function a() {console.log('a')}
 *	function b() {
 *		let c = a
 *		a();
 *	}
 * This function will return the reference to node `a` from `let c = a` and ignore `a()`
 */
function findIndirectReferences(tree, references) {
	let globalScope = scope.default(tree);
	let indirectedReferences = [];

	let redeclarations = reduce(new DeclarationReferenceReducer(references), tree).values;

	for (let d of redeclarations) {
		let variableScope = findDeclarationScope(globalScope, d);

		let filteredReferences = filterDeclFromRef(variableScope.variables.get(d.name));
		let redeclarationReferences = filteredReferences.references;

		let nonReads = redeclarationReferences.filter(r => !r.accessibility.isRead);
		if (nonReads.length > 0) {
			throw new Error(`Variable ${d.name} to whom the array decoding function is being assigned, is being accessed in non-read only mode. References: ${JSON.stringify(nonReads)}`)
		}
		indirectedReferences.push(...redeclarationReferences);
	}

	return indirectedReferences;
}

module.exports.recursiveFindReferences = function(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
	return recursiveFindReferences(tree, target, {subtrees, excludeSubtrees});
}
module.exports.declarationUsages = function(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
	return declarationUsages(tree, target, {subtrees, excludeSubtrees});
}
module.exports.findIndirectReferences = function(tree, references) {
	return findIndirectReferences(tree, references);
}
