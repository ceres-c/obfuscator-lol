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
const { declarationUsages, findIndirectReferences } = require('./utils/references-finder');

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
let globalScope = scope.default(tree); // TODO remove if actually unused

// TODO implement an automatic pipelining system
if (enabledTransforms.StringArrayTransformer) {
	// TODO move code in here to separate analyzer file
	console.log("[*] Searching Strings Array decoding function");
	let decodingFunc = analyzeStrArrDecodingFunc(tree);

	let decodingFuncDeclaration = decodingFunc.functionReference.name // Get an IdentifierExpression object
	// Find all the references to the string decoding function, excluding all those withing the string decoding function itself
	let decodingFuncReferences = declarationUsages(tree, decodingFuncDeclaration, {excludeSubtrees: [decodingFunc.functionReference]});
	let indirectReferences = findIndirectReferences(tree, decodingFuncReferences);
	tree = reduce(new CallReplaceReducer(indirectReferences, decodingFunc), tree);

	// if (enabledTransforms.StringArrayRotateFunctionTransformer) {
	// 	tree = analyzeRotate(tree, globalScope, decodingFuncReferences);
	// 	process.exit(123)
	// }

	// let functionRedeclarations = reduce(new DeclarationReferenceReducer(decodingFuncReferences), tree).values;
	// let indirectCalls = [];
	// for (let d of functionRedeclarations) {
	// 	let variableScope = findDeclarationScope(globalScope, d);
	// 	indirectCalls.push(...variableScope.variables.get(d.name).references.filter(r => r.accessibility.isRead).map(r => r.node));
	// 	// Potentially, the above filter could be empty since declared variables are not always used

	// 	// TODO handle String Array Wrappers > 1.
	// }
	// tree = reduce(new CallReplaceReducer(indirectCalls, decodingFunc), tree);
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
