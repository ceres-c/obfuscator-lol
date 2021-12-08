const { IdentifierExpression } = require('shift-ast');
const { parseScript } = require('shift-parser');
const scope = require('shift-scope');

let testCode = `
function interesting_fun() {
	a = 1;
}
function other_fun() {
	variable = interesting_fun;
	switch(1) {
		case 1:
			a1 = interesting_fun;
			a1_1 = a1;
			break;
		case 2:
			a2 = variable;
			break;
			interesting_fun = TEST;
	}
	local_inner_variable = variable;
}
`

let tree = parseScript(testCode);
let globalScope = scope.default(tree);

let funcName = 'interesting_fun';
let funcReferences = globalScope.variables.get(funcName).references.filter(r => r.accessibility.isRead).map(r => r.node);

console.log(`references to '${funcName}':`, funcReferences);
console.log(globalScope.children[0].children[0]);
// console.log(JSON.stringify(globalScope));
