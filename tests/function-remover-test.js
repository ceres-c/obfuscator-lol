const { reduce } = require('shift-reducer');
const { parseScript } = require('shift-parser');

const { FunctionRemover } = require('../reducers/function-remover');
const codegen = require('../utils/codegen');

const input_src = `
let a = function() {return "Function a"}, b = function() {return "Function b"};
`

let tree = parseScript(input_src);

// Remove strings array decoding function and strings array function itself
let newTree = reduce(new FunctionRemover([ tree.statements[0].declaration.declarators[0] ]), tree);

console.log(codegen(newTree));
