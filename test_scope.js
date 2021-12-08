const { parseScript } = require('shift-parser');
const scope = require('shift-scope');

const input_src = `
function b() {}
function hi() {
    var c = b;
    console[c(0x8c)](c(0x8d) + 'd!');
}`
let tree = parseScript(input_src);
let globalScope = scope.default(tree);
debugger