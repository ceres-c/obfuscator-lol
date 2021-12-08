#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

codegen = require('shift-codegen');
const { parseScript } = require('shift-parser');
const { reduce } = require('shift-reducer');
const scope = require('shift-scope');
const { program } = require('commander');

const { DeclarationReferenceReducer } = require('./reducers/declaration_reference_reducer');
const { CallReplaceReducer } = require('./reducers/call_replace_reducer');
const { analyzeStrArrDecodingFunc } = require('./parsers/strings_decoding_finder');
const { findDeclarationScope, filterOverwriteAssignment } = require('./utils/scope_traversal');

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

console.log("[*] Searching base64 function");
let base64Function = analyzeStrArrDecodingFunc(tree);
let base64FunctionDeclaration = base64Function.functionReference.name // Assuming FunctionDeclaration AST object
let base64FunctionNameString = base64Function.functionReference.name.name // Assuming FunctionDeclaration AST object

// Trovo lo scope che contiene tra le declaration una dichiarazione a base64Function.functionReference TODO translate
let functionScope = findDeclarationScope(globalScope, base64FunctionDeclaration);
let functionScopeFilt = filterOverwriteAssignment(functionScope, base64FunctionNameString);

let base64FunctionReferences = functionScopeFilt.variables.get(base64FunctionNameString).references.map(r => r.node); // Extract reference nodes
let functionRedeclarations = reduce(new DeclarationReferenceReducer(base64FunctionReferences), tree).values;

let indirectCalls = [];
for (let d of functionRedeclarations) {
	let variableScope = findDeclarationScope(globalScope, d);
	indirectCalls.push(...variableScope.variables.get(d.name).references.filter(r => r.accessibility.isRead).map(r => r.node));
	// Potentially, the above filter could be empty since declared variables are not always used
}
tree = reduce(new CallReplaceReducer(indirectCalls, base64Function), tree);

console.log(codegen.default(tree));

//console.log(codegen.default(tree));

// TODO da modificare per fermarsi alla prima occurrency di base64Function.functionName e rieseguire finché non ne trovo più

// Uso l'oggetto scope corrente e prendo la lista delle reference IN LETTURA a base64Function.functionName
// let referencesInScope = scope.variables.get(base64Function.functionName).filter(SOLA LETTURA);
// Ora ho la lista delle variabili a cui viene assegnata base64Function.functionName
// Per ogni reference nella lista di cui sopra, cerco il suo scope
// All'interno dello scope cerco le function call alla variabile con questo nome e le sostituisco con il valore calcolato
// NB SI ASSUME CHE NON VENGANO RISCRITTE LE VARIABILI E NON CI SIANO ASSEGNAZIONI INDIRETTE, si parte sempre da base64Function.functionName
