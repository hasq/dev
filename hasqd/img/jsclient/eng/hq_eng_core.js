// Hasq Technology Pty Ltd (C) 2013-2016

function engGetTokenInfo(data, r, s)
{
    var item = {};
    item.raw = r;
    item.s = s;
    item.fit = false;
    item.unfit = false;

    if (engGetResponseHeader(data) === 'OK')
    {
        var lr = engGetParsedRecord(data);
        var nr = engGetRecord(lr.n, lr.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
        item.n = lr.n;
        item.d = lr.d;
        item.fit = false;
        item.unfit = false;
        item.state = engGetTokensStatus(lr, nr);
        switch (item.state)
        {
            case 'OK':
                item.fit = true;
                break;
            case 'PWD_SNDNG':
                item.unfit = true;
                break;
            case 'PWD_RCVNG':
                item.unfit = true;
                break;
            case 'PWD_WRONG':
                item.unfit = true;
                break;
        }
    }
    else
    {
        item.state = 'IDX_NODN';
        item.unfit = true;
        item.n = -1;
        item.d = '';
    }

    return item;
}

function engRunCmdList(cmdList, cbFunc)
{
    var cb = function (ajxData)
    {
        if (cmdList.items.length == 0 && cmdList.idx >= cmdList.items.length) return;

        var progress = ((cmdList.idx + 1) / cmdList.items.length) * 100;
        var r = engGetResponseHeader(ajxData);

        if (r === 'OK' || r === 'IDX_NODN')
        {
            cbFunc(ajxData, cmdList.idx, progress);
            cmdList.idx++;
            cmdList.counter = 100;
        }
        else
        {
            cmdList.counter--;
            if (cmdList.counter === 0)
            {
                cmdList.idx++;
                cmdList.counter = 100;
                cbFunc(ajxData, cmdList.idx, progress);
            }
        }

        if (cmdList.items.length != 0 && cmdList.idx < cmdList.items.length)
            engRunCmdList(cmdList, cbFunc)
        }

    if (cmdList.items.length > 0 && cmdList.idx < cmdList.items.length)
        ajxSendCommand(cmdList.items[cmdList.idx].cmd, cb, hasqLogo);
    else if (cmdList.items.length === 0)
        cbFunc('OK', 0, 0);
}

function engGetCifer(data)
{
	randomize();
	
	if (data)
		return hjdbc_encrypt(data);
	
}

function randomize()
{
    gIv = engGetHash(gIv + Math.random(), gCiferHash);
    gSalt = engGetHash(gSalt + Math.random(), gCiferHash);
}

function text_to_hex(x)
{
    x = rstr2hex(x);
    return x;
}

var ascii = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
var basc = new Object();

function is_ascii(x)
{
    for ( var i = 0; i < x.length; i++ )
    {
        var k = int2char(char2int(x.charAt(i)));
        if ( k != x.charAt(i) ) return false;
    }

    return true;
}

function initascii()
{
    for ( var i = 0; i < ascii.length; i++ )
    {
        basc[ascii.charAt(i)] = i;
    }
}

initascii();

function hjdbc_encrypt(data)
{
    var t = data;
	var iv = gIv;
	var salt = gSalt;
	var hash = gCiferHash;
	

    if ( !is_ascii(t) )
        return alert("The text is not plain ASCII. "
              + "Convert it first to ASCII by clicking button 'Uni->ASCII'.");
			  
	var H = function(raw)
	{
		return engGetHash(raw, hash)
	}
	
    var blk_size = H('').length;

    if ( iv.length != salt.length )
        return alert("IV and Salt sizes do not match");

    if ( iv.length != blk_size )
        return alert("IV size does not match Digest function");

    var add_sign = false; /// 
    var min_salt = 4;
    var min_salt = parseInt(min_salt);

    // 1 add size
    t += ":" + t.length;
    t = text_to_hex(t);
    var tsz = t.length;

    // 2 pad with salt
    var psz = tsz % blk_size;
    psz = blk_size - psz;

    if ( psz < min_salt )
    {
        t = salt + t;
        tsz = t.length;
    }

    t = salt.substr(0, psz) + t;
    tsz = t.length;

    // 3 convert to blocks
    var v = [];
    var N = tsz / blk_size;
    for ( var i = 0; i < N; i++ )
    {
        v[i] = t.substr(i * blk_size, blk_size);
    }
    var C = hjdbc_enc_cipher(v, iv, H);

    N = C.length;
    if ( !add_sign ) --N;
    var c_text = iv + '\n';
    for ( var i = 0; i < N; i++ )
    {
        c_text += C[i] + '\n';
    }

	console.log('Iv: ' + gIv);
	console.log('Salt: ' + gSalt);
	console.log('c_text: ' + c_text);
	return c_text;

}

function hjdbc_enc_cipher(v, iv, H)
{
    var K = gSkc;
    var C = [];

    var cur = iv;
    for ( var i = 0; i < v.length; i++ )
    {
        var x = H(K + cur);
        cur = hex_xor(x, v[i]);
        C[i] = cur;
    }

    C[v.length] = H(K + cur);

    return C;
}

function hex_xor(a, b)
{
    var sz = b.length;
    if ( a.length != sz ) return "";

    var c = "";

    for ( var i = 0; i < sz; i++ )
    {
        var ia = hexchar2int(a.charAt(i));
        var ib = hexchar2int(b.charAt(i));
        c += int2hexchar( ia ^ ib );
    }

    return c;
}

function hexchar2int(x)
{
    var y = char2int(x);
    if ( y >= 48 && y <= 57 ) return y - 48;
    if ( y >= 65 && y <= 70 ) return y + 10 - 65;
    if ( y >= 97 && y <= 102 ) return y + 10 - 97;
    return -1;
}

function int2hexchar(x)
{
    if ( x <= 9 ) return int2char(x + 48);
    if ( x <= 15 ) return int2char(x - 10 + 97);
    return int2char(0);
}

function char2int(x)
{
    if ( x == '\n' ) return 13;
    if ( x == ' ' ) return 32;
    if ( !basc[x] ) return 0;
    return basc[x] + 32;
}

function int2char(x)
{
    if ( x == 10 ) return "\n";
    if ( x == 13 ) return "\n";
    if ( x < 32 ) return ".";
    if ( x > 126 ) return ".";
    if ( x == 32 ) return ' ';
    return ascii.charAt(x - 32);
}