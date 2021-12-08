# Shift Query

Shift-query is a library for querying a Shift AST for patterns of syntax using a CSS style selector system.

This is a fork and update of esquery to be used with the Shift suite of parsers and tools. No significant functionality
has been changed.

## Demo

Check out the [demo here](https://jsoverson.github.io/shift-query-demo/)

## Install

```bash
$ npm install shift-query
```

## Usage

```javascript
const query = require('shift-query');
const { parseScript } = require('shift-parser');

const ast = parseScript(`
function add(a, b) { return a + b };
function noop() { };

const sum = add(1,2);
`);

const binding = query(ast, '[name="sum"]');
console.log(binding);
/*
[ BindingIdentifier { type: 'BindingIdentifier', name: 'sum' } ]
*/

const functionsWithParams = query(ast, '[params.items.length>0]');
console.log(functionsWithParams);

/*
[ FunctionDeclaration {
  type: 'FunctionDeclaration',
  isAsync: false,
  isGenerator: false,
  name: BindingIdentifier { type: 'BindingIdentifier', name: 'add' },
  params: FormalParameters { type: 'FormalParameters', items: [Array], rest: null },
  body: FunctionBody { type: 'FunctionBody', directives: [], statements: [Array] } } ]
*/
```

The following selectors are supported:
* AST node type: `FunctionDeclaration`
* [wildcard](http://dev.w3.org/csswg/selectors4/#universal-selector): `*`
* [attribute existence](http://dev.w3.org/csswg/selectors4/#attribute-selectors): `[attr]`
* [attribute value](http://dev.w3.org/csswg/selectors4/#attribute-selectors): `[attr="foo"]` or `[attr=123]`
* attribute regex: `[attr=/foo.*/]`
* attribute conditons: `[attr!="foo"]`, `[attr>2]`, `[attr<3]`, `[attr>=2]`, or `[attr<=3]` 
* nested attribute: `[attr.level2="foo"]`
* field: `FunctionDeclaration > IdentifierExpression.name`
* [First](http://dev.w3.org/csswg/selectors4/#the-first-child-pseudo) or [last](http://dev.w3.org/csswg/selectors4/#the-last-child-pseudo) child: `:first-child` or `:last-child`
* [nth-child](http://dev.w3.org/csswg/selectors4/#the-nth-child-pseudo) (no ax+b support): `:nth-child(2)`
* [nth-last-child](http://dev.w3.org/csswg/selectors4/#the-nth-last-child-pseudo) (no ax+b support): `:nth-last-child(1)`
* [descendant](http://dev.w3.org/csswg/selectors4/#descendant-combinators): `ancestor descendant`
* [child](http://dev.w3.org/csswg/selectors4/#child-combinators): `parent > child`
* [following sibling](http://dev.w3.org/csswg/selectors4/#general-sibling-combinators): `node ~ sibling`
* [adjacent sibling](http://dev.w3.org/csswg/selectors4/#adjacent-sibling-combinators): `node + adjacent`
* [negation](http://dev.w3.org/csswg/selectors4/#negation-pseudo): `:not(ExpressionStatement)`
* [matches-any](http://dev.w3.org/csswg/selectors4/#matches): `:matches([attr] > :first-child, :last-child)`
* [subject indicator](http://dev.w3.org/csswg/selectors4/#subject): `!IfStatement > [name="foo"]`
* class of AST node: `:statement`, `:expression`, `:declaration`, `:function`, or `:target`

