// Hasq Technology Pty Ltd (C) 2013-2016

function HasqLogo(id)
{
    var counter = 0;

    var retObj =
    {
        wait : function ()
        {
            var $Logo = $('#' + id + ' img');
            counter++;

            if (counter > 0)
                return $Logo.attr('src', imgLogoAnim);
        },
        done : function ()
        {
            var $Logo = $('#' + id + ' img');

            if (counter > 0)
                counter--;

            if (counter == 0)
                return setTimeout(function ()
            {
                $Logo.attr('src', imgLogoWait)
            }, 200);
        },
        fail : function ()
        {
            var $Logo = $('#' + id + ' img');
            counter = 0;

            return $Logo.attr('src', imgLogoFail);
        }
    }
    return retObj;
}

function preload(container)
{
    if (document.images)
    {
        for (i = 0; i < container.length; i++)
        {
            preloadImg[i] = new Image();
            preloadImg[i].onload = function ()  {};
            preloadImg[i].src = container[i];
        }
    }
}

var gBrowsers = {};
gBrowsers.CH_D = {plat: 'desktop', name: 'chrome', verFull: '50.0.2661.75', verShort: '50'};
gBrowsers.CH_M = {plat: 'mobile', name: 'chrome', verFull: '45.0.2454.95', verShort: '45'};
gBrowsers.ED_D = {plat: 'desktop', name: 'edge', verFull: '25.10586.0.0', verShort: '25'};
gBrowsers.ED_M = {plat: 'mobile', name: 'edge', verFull: '', verShort: ''};
gBrowsers.FF_D = {plat: 'desktop', name: 'firefox', verFull: '45.0.2', verShort: '45'};
gBrowsers.FF_M = {plat: 'mobile', name: 'firefox', verFull: '45.0', verShort: '45'};
gBrowsers.IE_D = {plat: 'desktop', name: 'ie', verFull: '11.0', verShort: '11'};
gBrowsers.IE_M = {plat: 'mobile', name: 'ie', verFull: '', verShort: ''};
gBrowsers.MX_D = {plat: 'desktop', name: 'maxthon', verFull: '4.4.8.1000', verShort: '4'};
gBrowsers.MX_M = {plat: 'mobile', name: 'maxthon', verFull: '', verShort: ''};
gBrowsers.OP_D = {plat: 'desktop', name: 'opera', verFull: '36.0.2130.65', verShort: '36'};
gBrowsers.OP_M = {plat: 'mobile', name: 'opera', verFull: '36.1.2126.102083', verShort: '36'};
gBrowsers.SF_D = {plat: 'desktop', name: 'safari', verFull: '9.1', verShort: '9'};
gBrowsers.SF_M = {plat: 'mobile', name: 'safari', verFull: '8', verShort: '8'};
gBrowsers.YA_D = {plat: 'desktop', name: 'yabrowser', verFull: '16.3', verShort: '16'};
gBrowsers.YA_M = {plat: 'mobile', name: 'yabrowser', verFull: '15.9', verShort: '15'};
gBrowsers.UNKNOWN = {plat: 'unknown', name: 'unknown', verFull: '', verShort: ''};

function getCurrentBrowser()
{
    var ua = navigator.userAgent;

    if (0)
        alert(ua);

    var bName = function ()
    {
     if (ua.search(/Edge/) > -1) return gBrowsers.ED_D.name;
     //if (ua.search(/MSIE/) > -1) return 'ie';
     if (ua.search(/Trident/) > -1) return gBrowsers.IE_D.name;
     if (ua.search(/Firefox/) > -1) return gBrowsers.FF_D.name;
     //if (ua.search(/Opera/) > -1) return 'opera';
     if (ua.search(/OPR/) > -1) return gBrowsers.OP_D.name;
     if (ua.search(/YaBrowser/) > -1) return gBrowsers.YA_D.name;
     if (ua.search(/Chrome/) > -1) return gBrowsers.CH_D.name;
     if (ua.search(/Safari/) > -1) return gBrowsers.SF_D.name;
     if (ua.search(/Maxthon/) > -1) return gBrowsers.MX_D.name;

        return gBrowsers.UNKNOWN.name;
    }();

    var version;

    switch (bName)
    {
        case gBrowsers.ED_D.name:
         version = (ua.split('Edge')[1]).split('/')[1];
            break;
            /*
            case 'ie':
                version = (ua.split('MSIE ')[1]).split(';')[0];
                break;
            */
        case gBrowsers.IE_D.name:
         //bName = 'ie';
            version = (ua.split('; rv:')[1]).split(')')[0];
            break;
        case gBrowsers.FF_D.name:
         version = ua.split('Firefox/')[1];
            break;
        //case 'opera':
 //  version = ua.split('Version/')[1];
        //        break;
        case gBrowsers.OP_D.name:
         //bName = 'opera';
         version = ua.split('OPR/')[1];
            break;
        case gBrowsers.YA_D.name:
         version = (ua.split('YaBrowser/')[1]).split(' ')[0];
            break;
        case gBrowsers.CH_D.name:
         version = (ua.split('Chrome/')[1]).split(' ')[0];
            break;
        case gBrowsers.SF_D.name:
         version = (ua.split('Version/')[1]).split(' ')[0];
            break;
        case gBrowsers.MX_D.name:
         version = ua.split('Maxthon/')[1];
            break;
        case gBrowsers.UNKNOWN.name:
            version = '0';
            break;
    }

    var plat = 'desktop';
    var mobile = new RegExp ('iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm', 'i');
    if (mobile.test(navigator.userAgent.toLowerCase())) plat = 'mobile';
    var browsrObj;

    try
    {
        browsrObj =
        {
            plat: plat,
            name: bName,
            verFull: version,
            verShort: version.split('.')[0]
        };
    }
    catch (err)
    {
        browsrObj =
        {
            plat: plat,
            name: 'unknown',
            verFull: 'unknown',
            verShort: 'unknown'
        };
    }

    return browsrObj;
}

function getBrowserInfo(b)
{
    if (0)
    {
        alert('plat: ' + b.plat + '\n' +
              'name: ' + b.name + '\n' +
              'Full ver: ' + b.verFull + '\n' +
              'Short ver: ' + b.verShort + '\n');
    }

    var obj = {};

    if (
        (b.name === gBrowsers.ED_D.name && +b.verShort >= +gBrowsers.ED_D.verShort) ||
        (b.name === gBrowsers.ED_M.name && +b.verShort >= +gBrowsers.ED_B.verShort) ||
        (b.name === gBrowsers.FF_D.name && +b.verShort >= +gBrowsers.FF_D.verShort && b.plat === 'desktop') ||
        (b.name === gBrowsers.FF_M.name && +b.verShort >= +gBrowsers.FF_M.verShort && b.plat === 'mobile') ||
        (b.name === gBrowsers.CH_D.name && +b.verShort >= +gBrowsers.CH_D.verShort && b.plat === 'desktop') ||
        (b.name === gBrowsers.CH_M.name && +b.verShort >= +gBrowsers.CH_M.verShort && b.plat === 'mobile') ||
        (b.name === gBrowsers.IE_D.name && +b.verShort >= +gBrowsers.IE_D.verShort) ||
        (b.name === gBrowsers.IE_M.name && +b.verShort >= +gBrowsers.IE_M.verShort) ||
        (b.name === gBrowsers.MX_D.name && +b.verShort >= +gBrowsers.MX_D.verShort) ||
        (b.name === gBrowsers.MX_M.name && +b.verShort >= +gBrowsers.MX_M.verShort) ||
        (b.name === gBrowsers.OP_D.name && +b.verShort >= +gBrowsers.OP_D.verShort && b.plat === 'desktop') ||
        (b.name === gBrowsers.OP_M.name && +b.verShort >= +gBrowsers.OP_M.verShort && b.plat === 'mobile') ||
        (b.name === gBrowsers.SF_D.name && +b.verShort >= +gBrowsers.SF_D.verShort) ||
        (b.name === gBrowsers.SF_M.name && +b.verShort >= +gBrowsers.SF_M.verShort) ||
        (b.name === gBrowsers.YA_D.name && +b.verShort >= +gBrowsers.YA_D.verShort) ||
        (b.name === gBrowsers.YA_M.name && +b.verShort >= +gBrowsers.YA_M.verShort)
    )
        obj.tested = true;
    else
    {
        obj.tested = false;
        obj.name = b.name;
        obj.plat = b.plat;
        obj.verShort = b.verShort;
        obj.verFull = b.verFull;
        obj.tVerShort = 'unknown';
        obj.tVerFull = 'unknown';

        for (i in gBrowsers)
        {
            if ( obj.name == gBrowsers[i].name && obj.plat == gBrowsers[i].plat )
            {
                obj.tVerShort = gBrowsers[i].verShort;
                obj.tVerFull = gBrowsers[i].verFull;
            }
        }
    }

    return obj;
}

function askToContinue(b)
{
    var r = 'Version ' + b.verShort + ' of "' + b.name + '" browser has not been tested.\nProceed?';
    return r;
}
