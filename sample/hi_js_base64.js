// obfuscator.io default example with string array encoded as base64
function hi() {
    var c = b;
    console[c(0x8c)](c(0x8d) + 'd!');
}
function a() {
    var d = [
        'Bg9N',
        'sgvSBg8Gv29YBa'
    ];
    a = function () {
        return d;
    };
    return a();
}
function b(c, d) {
    var e = a();
    b = function (f, g) {
        f = f - 0x8c;
        var h = e[f];
        if (b['mEwsuh'] === undefined) {
            var i = function (m) {
                var n = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
                var o = '';
                var p = '';
                for (var q = 0x0, r, s, t = 0x0; s = m['charAt'](t++); ~s && (r = q % 0x4 ? r * 0x40 + s : s, q++ % 0x4) ? o += String['fromCharCode'](0xff & r >> (-0x2 * q & 0x6)) : 0x0) {
                    s = n['indexOf'](s);
                }
                for (var u = 0x0, v = o['length']; u < v; u++) {
                    p += '%' + ('00' + o['charCodeAt'](u)['toString'](0x10))['slice'](-0x2);
                }
                return decodeURIComponent(p);
            };
            b['xbHKig'] = i;
            c = arguments;
            b['mEwsuh'] = !![];
        }
        var j = e[0x0];
        var k = f + j;
        var l = c[k];
        if (!l) {
            h = b['xbHKig'](h);
            c[k] = h;
        } else {
            h = l;
        }
        return h;
    };
    return b(c, d);
}
hi();