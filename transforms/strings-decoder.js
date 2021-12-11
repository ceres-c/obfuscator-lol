var crypto = require('crypto');
// TODO strings to avoid breaking source in both these functions

/**
 * base64decode obfuscator.io base64 strings
 * Args:
 * 	- input: base64 encoded string
 * 	- outString (true): if true, output will be converted to string, otherwise it will be returned as a Buffer object
 * Return:
 * 	A string or Buffer object, depending on the value of outString
 */
function base64Decode(input, outString=true) {
	// Need to swap case since obfuscator.io code uses a a-zA-Z0-9+/= alphabet, while standard base64 uses A-Za-z0-9+/=
	let swapCase = string => string.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');

	let buffer = Buffer.from(swapCase(input), 'base64');
	if (outString) {
		return buffer.toString('utf-8').replace("'", "\\'");
	} else {
		return buffer;
	}
}

/**
 * decrypt obfuscator.io RC4 encrypted strings
 * Args:
 * 	- input: base64 encoded string
 * 	- key: the key to decrypt with, a 4-char string
 * 	- outString (true): if true, output will be converted to string, otherwise it will be returned as a Buffer object
 * Return:
 * 	A string or Buffer object, depending on the value of outString
 */
function RC4Decrypt(ciphertext, key, outString=true) {
	ciphertext = base64Decode(ciphertext);

	let decipher = crypto.createDecipheriv('rc4', key, '')
	let decrypted = Buffer.concat([decipher.update(ciphertext, 'latin1'), decipher.final()]);
	if (outString) {
		return decrypted.toString('utf-8').replace("'", "\\'");
	} else {
		return decrypted;
	}
}

module.exports.base64Decode = function(input) {
	return base64Decode(input);
}
module.exports.RC4Decrypt = function(ciphertext, key) {
	return RC4Decrypt(ciphertext, key);
}
