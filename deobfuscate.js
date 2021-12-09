#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

codegen = require('shift-codegen');
const { parseScript } = require('shift-parser');
const { reduce } = require('shift-reducer');
const scope = require('shift-scope');
const { program } = require('commander');

const { DeclarationReferenceReducer } = require('./reducers/declaration-reference-reducer');
const { CallReplaceReducer } = require('./reducers/call-replace-reducer');
const { analyzeStrArrDecodingFunc } = require('./parsers/stringarray-parser');
const { findDeclarationScope, filterOverwriteAssignment } = require('./utils/scope-traversal');

const { analyze: analyzeRotate } = require('./transforms/stringarrayrotate-transformer');

let enabledTransforms = {
	// TODO detect these automatically
	StringArrayTransformer: true,
    StringArrayRotateFunctionTransformer: true,
}

program
	.option('-d, --debug', 'enable debugging output (quite chatty)', false)
	.requiredOption('-s, --source <source.js>', 'Obfuscated source file to read');
program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.source)) {
	console.log("[!] Couldn't find specified file!");
	process.exit(1)
}
console.log(`[*] Reading source file: ${options.source}`);
const input_src = fs.readFileSync(options.source, "utf-8");

let tree = parseScript(input_src);
let globalScope = scope.default(tree);

// TODO implement an automatic pipelining system
if (enabledTransforms.StringArrayTransformer) {
	console.log("[*] Searching Strings Array decoding function");
	let base64Function = analyzeStrArrDecodingFunc(tree);
	let base64FunctionDeclaration = base64Function.functionReference.name // Assuming FunctionDeclaration AST object
	let base64FunctionNameString = base64Function.functionReference.name.name // Assuming FunctionDeclaration AST object

	// Find a scope containing, among the declaration, a declaration to base64FunctionNameString
	let functionScope = findDeclarationScope(globalScope, base64FunctionDeclaration);
	// Remove nested assignments (the base64Function reassign internally its own name to a new function)
	let functionScopeFilt = filterOverwriteAssignment(functionScope, base64FunctionNameString);

	let base64FunctionReferences = functionScopeFilt.variables.get(base64FunctionNameString).references.map(r => r.node); // Extract reference nodes

	if (enabledTransforms.StringArrayRotateFunctionTransformer) {
		tree = analyzeRotate(tree, globalScope, base64FunctionReferences);
		process.exit(123)
	}

	let functionRedeclarations = reduce(new DeclarationReferenceReducer(base64FunctionReferences), tree).values;

	let indirectCalls = [];
	for (let d of functionRedeclarations) {
		let variableScope = findDeclarationScope(globalScope, d);
		indirectCalls.push(...variableScope.variables.get(d.name).references.filter(r => r.accessibility.isRead).map(r => r.node));
		// Potentially, the above filter could be empty since declared variables are not always used

		// TODO handle String Array Wrappers > 1.
	}
	tree = reduce(new CallReplaceReducer(indirectCalls, base64Function), tree);
}

console.log(codegen.default(tree));

//console.log(codegen.default(tree));

// TODO da modificare per fermarsi alla prima occurrency di base64Function.functionName e rieseguire finché non ne trovo più

// Uso l'oggetto scope corrente e prendo la lista delle reference IN LETTURA a base64Function.functionName
// let referencesInScope = scope.variables.get(base64Function.functionName).filter(SOLA LETTURA);
// Ora ho la lista delle variabili a cui viene assegnata base64Function.functionName
// Per ogni reference nella lista di cui sopra, cerco il suo scope
// All'interno dello scope cerco le function call alla variabile con questo nome e le sostituisco con il valore calcolato
// NB SI ASSUME CHE NON VENGANO RISCRITTE LE VARIABILI E NON CI SIANO ASSEGNAZIONI INDIRETTE, si parte sempre da base64Function.functionName
