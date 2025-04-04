#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const codegen = require('./utils/codegen');
const { parseScript } = require('shift-parser');
const { program } = require('commander');

const { analyze: analyzeStringArrayRotate } = require('./transforms/stringarrayrotate-transformer');
const { analyze: analyzeStringArray } = require('./transforms/stringarray-transformer');
const { analyze: analyzeSelfDefend } = require('./transforms/selfdefend-transformer');

let enabledTransforms = {
	// TODO detect these automatically
	StringArrayTransformer: false,
    StringArrayRotateFunctionTransformer: false,
	SelfDefendTransformer: true,
}

program
	.option('-d, --debug', 'enable debugging output (quite chatty)', false)
	.option('-f, --format', 'output formatted code', false)
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

// TODO implement an automatic pipelining system
if (enabledTransforms.StringArrayRotateFunctionTransformer) {
	console.log("[*] Unrotating Strings Array");
	tree = analyzeStringArrayRotate(tree);
}
if (enabledTransforms.StringArrayTransformer) {
	console.log("[*] Replacing Strings Array decoding function calls with result");
	tree = analyzeStringArray(tree);
}
if (enabledTransforms.SelfDefendTransformer) {
	console.log("[*] Removing Self Defending Code protections");
	tree = analyzeSelfDefend(tree);
}

console.log(codegen(tree, options.format));
