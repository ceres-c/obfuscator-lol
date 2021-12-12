// Blatantly copied from https://github.com/shapesecurity/unminify
// Thanks, Kevin Gibbons
'use strict';

const codegen = require('shift-codegen');

class MinimalCodeGenWithStrs extends codegen.MinimalCodeGen {
	reduceLiteralStringExpression(node) {
		const s = super.reduceLiteralStringExpression(node);
		let out = '';
		for (let i = 0; i < s.token.length; ++i) {
			const code = s.token.codePointAt(i);
			if (code >= 0x20 && code <= 0x7E) {
				out += s.token.charAt(i);
			} else if (code > 0xFFFF) {
				++i;
				out += '\\u{' + code.toString(16).toUpperCase() + '}';
			} else if (code > 0xFF) {
				let hex = code.toString(16).toUpperCase();
				out += '\\u' + '0000'.slice(hex.length) + hex;
			} else if (code === 0) {
				out += '\\0';
			} else {
				let hex = code.toString(16).toUpperCase();
				out += '\\x' + '00'.slice(hex.length) + hex;
			}
		}
		s.token = out;
		return s;
	}
}

class FormattedCodeGenWithStrs extends codegen.FormattedCodeGen {
	reduceLiteralStringExpression(node) {
		const s = super.reduceLiteralStringExpression(node);
		let out = '';
		for (let i = 0; i < s.token.length; ++i) {
			const code = s.token.codePointAt(i);
			if (code >= 0x20 && code <= 0x7E) {
				out += s.token.charAt(i);
			} else if (code > 0xFFFF) {
				++i;
				out += '\\u{' + code.toString(16).toUpperCase() + '}';
			} else if (code > 0xFF) {
				let hex = code.toString(16).toUpperCase();
				out += '\\u' + '0000'.slice(hex.length) + hex;
			} else if (code === 0) {
				out += '\\0';
			} else {
				let hex = code.toString(16).toUpperCase();
				out += '\\x' + '00'.slice(hex.length) + hex;
			}
		}
		s.token = out;
		return s;
	}
}

module.exports = function(tree, format=false) {
	if (format) {
		return codegen.default(tree, new FormattedCodeGenWithStrs);
	} else {
		return codegen.default(tree, new MinimalCodeGenWithStrs);
	}
};