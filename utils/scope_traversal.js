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

	let declarationName = declarationReference.name; // BindingIdentifier object
	return findDeclarationScopeCore(scope, declarationReference, declarationName);
}

/**
 * Filters out structures such as
 * 	function a() {
 * 		a = function() { // <= THIS reference will be ignored
 * 		}
 * 	}
 * 
 * Args:
 *	- scope: shift-scope scope object
 *	- functionName: function whose writes will be removed (string)
 * Returns:
 *	- Copy of the scope object without the writes
 * 
 * 	TODO this should be implemented passing the external function body and
 *  filtering out references to children nodes
 */
function filterOverwriteAssignment(scope, functionName) {
	let scopeCopy = {...scope};
	scopeCopy.variables = new Map(scope.variables);

	let variableObject = scopeCopy.variables.get(functionName);
	if (variableObject === undefined) {
		throw new Error(`Could not locate ${functionName} in current scope`);
	}
	let variableObjectCopy = {...variableObject};

	let previousLength = variableObjectCopy.references.length;
	variableObjectCopy.references = variableObjectCopy.references.filter(r => !r.accessibility.isWrite); // Filter out the only write access
	if (previousLength - variableObjectCopy.references.length != 1) {
		// When this program was coded in 2021, there was only one write, if this changes, this method is broken
		throw new Error(`Deleted too many writes to ${functionName} in current scope`);
	}

	scopeCopy.variables.set(functionName, variableObjectCopy);
	return scopeCopy;
}

module.exports.findDeclarationScope = function(scope, declarationReference) {
	return findDeclarationScope(scope, declarationReference);
}
module.exports.filterOverwriteAssignment = function(scope, functionName) {
	return filterOverwriteAssignment(scope, functionName);
}
