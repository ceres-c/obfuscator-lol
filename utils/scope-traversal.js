/**
 * Given a scope and a reference to a given declaration (BindingIdentifier AST object),
 * recursively finds the scope where the declaration lies.
 */
function findDeclarationScope(scope, declarationReference) {
	// functionName is a BindingIdentifier object
	// functionNameString is a string
	function findDeclarationScopeCore(scope, declarationReference, declarationName) {
		if (scope.variables.has(declarationName)) {
			if (scope.variables.get(declarationName).declarations.some(d => d.node === declarationReference)) {
				// Found the same object
				return scope;
			}
		}

		for (let childScope of scope.children) {
			let foundScope = findDeclarationScopeCore(childScope, declarationReference, declarationName);
			if (foundScope != undefined) {
				return foundScope;
			}
		}
		return undefined;
	}

	let declarationName = declarationReference.name; // declarationReference is a BindingIdentifier object, get the name as a string
	return findDeclarationScopeCore(scope, declarationReference, declarationName);
}

module.exports.findDeclarationScope = function(scope, declarationReference) {
	return findDeclarationScope(scope, declarationReference);
}
