const { reduce } = require('shift-reducer');
const scope = require('shift-scope');
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
 function declarationUsages(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
	let globalScope = scope.default(tree);

	if (target.name === undefined) {
		throw new Error("Can't find target's name, got undefined");
	}

	// Find a scope containing, among all its declarations, a declaration to the target variable
	let declScope = findDeclarationScope(globalScope, target);
	if (declScope === undefined) {
		throw new Error(`Could not find a suitable scope for variable ${target.name}`)
	}
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
 * Given a list of Reference objects, returns a list of BindingIdentifiers to whome any of these reference is assigned to. e.g.
 * 
 *	let a = 1;
 *	console.log(a)	// <= not this
 *	let b = a;		// <= this
 *	let c = a;		// <= this
 */
function findInitializedToReferences(tree, references) {
	return reduce(new DeclarationReferenceReducer(references), tree).values;
}

/**
 * Given the identifier `target`, DECLARED inside tree, find all the references to it and to any other
 * variable it is assigned to (scope aware)
 * e.g.
 *	let a = 1; // BindingIdentifier `a`
 *	let b = a; // <= BindingIdentifier `b` and IdentifierExpression `a`
 *	console.log(a, b) // <= IdentifierExpression `a` and IdentifierExpression `b`
 * Args:
 *	- tree: ast containing the declaration of target
 *	- targets: either a list of BindingIdentifiers or a single BindingIdentifier whose references must be located
 *	- subtrees (optional): array of ast - references will be searched only within this subtree(s)
 *	- excludeSubtrees (optional): array of ast - references inside this subtree(s) will be ignored
 * Return:
 *	- A list of Reference objects:
 *		{node: <node reference>, accessibility: <Accessibility info>}
 */
function findRecursiveUsages(tree, targets, {subtrees = [], excludeSubtrees = []} = {}) {
	let retList = [];

	if (!Array.isArray(targets)) {
		targets = [targets]; // Wrap in single element array
	}
	let foundBindings = targets;

	while (foundBindings.length > 0) {
		foundBindings = [];
		for (let t of targets) { // i is a BindingIdentifier object
			let usages = declarationUsages(tree, t, {subtrees: subtrees, excludeSubtrees: excludeSubtrees});
			retList.push(...usages);

			// Check if this variable is assigned to any other variable
			let variablesInitialized = findInitializedToReferences(tree, usages);
			if (variablesInitialized.length > 0) {
				restart = true;
				foundBindings.push(...variablesInitialized);
			}
		}
		targets = foundBindings;
	}

	return retList;
}

module.exports.findRecursiveUsages = function(tree, targets, {subtrees = [], excludeSubtrees = []} = {}) {
	return findRecursiveUsages(tree, targets, {subtrees, excludeSubtrees});
}
module.exports.declarationUsages = function(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
	return declarationUsages(tree, target, {subtrees, excludeSubtrees});
}
module.exports.findInitializedToReferences = function(tree, references) {
	return findInitializedToReferences(tree, references);
}
