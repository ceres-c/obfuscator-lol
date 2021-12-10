const scope = require('shift-scope');
const { reduce } = require('shift-reducer');
const { DeclarationReferenceReducer } = require('../reducers/declaration-reference-reducer');
const { IdentifierTreeFilter } = require('../reducers/identifier-tree-filter');
const { findDeclarationScope, filterOverwriteAssignment } = require('./scope-traversal');

/**
 * Given the identifier `target`, DECLARED inside tree, find all the references to it (scope aware)
 * Args:
 *	- tree: ast containing the declaration of target
 *	- target: IdentifierExpression whose references must be located
 *	- subtrees (optional): array of ast - references will be searched only within this subtree(s)
 *	- excludeSubtrees (optional): array of ast - references inside this subtree(s) will be ignored
 * Return:
 *	- A list of Reference objects:
 *		{node: <node reference>, accessibility: <Accessibility info>}
 */
function findReferences(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
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

// TODO continuare da qui con questo metodo
// TODO rendere "ricorsivo" per risolvere wrapper multipli
function findIndirectReferences() {
	let base64FunctionReferences = functionScopeFilt.variables.get(targetName).references.map(r => r.node); // Extract reference nodes

	let functionRedeclarations = reduce(new DeclarationReferenceReducer(base64FunctionReferences), tree).values;

	let indirectCalls = [];
	for (let d of functionRedeclarations) {
		let variableScope = findDeclarationScope(globalScope, d);
		indirectCalls.push(...variableScope.variables.get(d.name).references.filter(r => r.accessibility.isRead).map(r => r.node));
		// Potentially, the above filter could be empty since declared variables are not always used

		// TODO handle String Array Wrappers > 1.
	}
}

module.exports.findReferences = function(tree, target, {subtrees = [], excludeSubtrees = []} = {}) {
	return findReferences(tree, target, {subtrees, excludeSubtrees});
}
