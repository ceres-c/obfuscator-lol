// obfuscator.io default example with string array encrypted with RC4
function b(c, d) {
	var e = a();
	b = function (f, g) {
		f = f - 0x19e;
		var h = e[f];
		if (b['CfECSn'] === undefined) {
			var i = function (n) {
				var o = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
				var p = '';
				var q = '';
				for (var r = 0x0, s, t, u = 0x0; t = n['charAt'](u++); ~t && (s = r % 0x4 ? s * 0x40 + t : t, r++ % 0x4) ? p += String['fromCharCode'](0xff & s >> (-0x2 * r & 0x6)) : 0x0) {
					t = o['indexOf'](t);
				}
				for (var v = 0x0, w = p['length']; v < w; v++) {
					q += '%' + ('00' + p['charCodeAt'](v)['toString'](0x10))['slice'](-0x2);
				}
				return decodeURIComponent(q);
			};
			var m = function (n, o) {
				var p = [], q = 0x0, r, t = '';
				n = i(n);
				var u;
				for (u = 0x0; u < 0x100; u++) {
					p[u] = u;
				}
				for (u = 0x0; u < 0x100; u++) {
					q = (q + p[u] + o['charCodeAt'](u % o['length'])) % 0x100;
					r = p[u];
					p[u] = p[q];
					p[q] = r;
				}
				u = 0x0;
				q = 0x0;
				for (var v = 0x0; v < n['length']; v++) {
					u = (u + 0x1) % 0x100;
					q = (q + p[u]) % 0x100;
					r = p[u];
					p[u] = p[q];
					p[q] = r;
					t += String['fromCharCode'](n['charCodeAt'](v) ^ p[(p[u] + p[q]) % 0x100]);
				}
				return t;
			};
			b['XQhINA'] = m;
			c = arguments;
			b['CfECSn'] = !![];
		}
		var j = e[0x0];
		var k = f + j;
		var l = c[k];
		if (!l) {
			if (b['GvkcJO'] === undefined) {
				b['GvkcJO'] = !![];
			}
			h = b['XQhINA'](h, g);
			c[k] = h;
		} else {
			h = l;
		}
		return h;
	};
	return b(c, d);
}
function a() {
	var d = [
		'nMxcIa',
		'WPz8Cmkfa8kiimkZAda'
	];
	a = function () {
		return d;
	};
	return a();
}
function hi() {
	var c = b;
	//var e = c;
	console[c(0x19e, '4kR$')](c(0x19f, 'BT!9') + 'd!');
	//console.log(e(0x19e, '4kR$'));
}
hi();