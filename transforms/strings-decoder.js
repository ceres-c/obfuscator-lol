var crypto = require('crypto');

/**
 * base64decode obfuscator.io base64 strings
 * Args:
 * 	- input: base64 encoded string
 * 	- outString (true): if true, output will be converted to string, otherwise it will be returned as a Buffer object
 * Return:
 * 	A string or Buffer object, depending on the value of outString
 */
function base64Decode(input) {
    // Copied directly from code output by obfuscator.io since Buffer's base64 implementation is broken:
    // spurious backslashes will be added to escape the string.
    var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
    var p = '';
    var q = '';
    for (var r = 0x0, s, t, u = 0x0; t = input.charAt(u++); ~t && (s = r % 0x4 ? s * 0x40 + t : t, r++ % 0x4) ? p += String.fromCharCode(0xff & s >> (-0x2 * r & 0x6)) : 0x0) {
        t = alphabet.indexOf(t);
    }
    for (var v = 0x0, w = p.length; v < w; v++) {
        q += '%' + ('00' + p.charCodeAt(v).toString(0x10)).slice(-0x2);
    }
    return decodeURIComponent(q);
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
module.exports.RC4Decrypt = function(ciphertext, key, outString=true) {
	return RC4Decrypt(ciphertext, key, outString);
}
