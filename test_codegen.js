const { parseScript } = require('shift-parser');
const parseIntCodegen = require('./reducers/parseInt-codegen');

src = `
parseInt(R(0x144, '2IW$')) / 0x1 + parseInt(R(0x145, 'N0hG')) / 0x2 + parseInt(S(0x146, 'alwv')) / 0x3 * (parseInt(R(0x147, 'wUOp')) / 0x4) + parseInt(S(0x148, ')e2V')) / 0x5 * (parseInt(S(0x149, 'Q8vK')) / 0x6) + -parseInt(R(0x14a, 'b^0g')) / 0x7 * (parseInt(S(0x14b, 'HcX]')) / 0x8) + parseInt(S(0x14c, 'X6J)')) / 0x9 + -parseInt(S(0x14d, 'Zv*S')) / 0xa;`

tree = parseScript(src)
console.log(parseIntCodegen(tree, ['parseInt', 'R', 'S'], ['/', '+', '*', '-']))
