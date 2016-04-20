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
                return $Logo.attr('src', imgLogoBlink);
        },
        done : function ()
        {
            var $Logo = $('#' + id + ' img');

            if (counter > 0)
                counter--;

            if (counter == 0)
                return setTimeout(function ()
            {
                $Logo.attr('src', imgLogoBlue)
            }, 200);
        },
        fail : function ()
        {
            var $Logo = $('#' + id + ' img');
            counter = 0;

            return $Logo.attr('src', imgLogoRed);
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

function getBrowser()
{
    var ua = navigator.userAgent;
    var bName = function ()
    {
     if (ua.search(/Edge/) > -1) return 'edge';
     if (ua.search(/MSIE/) > -1) return 'ie';
     if (ua.search(/Trident/) > -1) return 'ie11';
     if (ua.search(/Firefox/) > -1) return 'firefox';
     if (ua.search(/Opera/) > -1) return 'opera';
     if (ua.search(/OPR/) > -1) return 'operaWebkit';
     if (ua.search(/YaBrowser/) > -1) return 'yabrowser';
     if (ua.search(/Chrome/) > -1) return 'chrome';
     if (ua.search(/Safari/) > -1) return 'safari';
     if (ua.search(/Maxthon/) > -1) return 'maxthon';
    }();

    var version;

    switch (bName)
    {
        case 'edge':
         version = (ua.split('Edge')[1]).split('/')[1];
            break;
        case 'ie':
            version = (ua.split('MSIE ')[1]).split(';')[0];
            break;
        case 'ie11':
            bName = 'ie';
            version = (ua.split('; rv:')[1]).split(')')[0];
            break;
        case 'firefox':
         version = ua.split('Firefox/')[1];
            break;
        case 'opera':
         version = ua.split('Version/')[1];
            break;
        case 'operaWebkit':
            bName = 'opera';
         version = ua.split('OPR/')[1];
            break;
        case 'yabrowser':
         version = (ua.split('YaBrowser/')[1]).split(' ')[0];
            break;
        case 'chrome':
         version = (ua.split('Chrome/')[1]).split(' ')[0];
            break;
        case 'safari':
         version = (ua.split('Version/')[1]).split(' ')[0];
            break;
        case 'maxthon':
         version = ua.split('Maxthon/')[1];
            break;
    }

    var platform = 'desktop';
 //if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) platform = 'mobile';
    var mobile = new RegExp ('iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm', 'i');
    if (mobile.test(navigator.userAgent.toLowerCase())) platform = 'mobile';
    var browsrObj;

    try
    {
        browsrObj =
        {
            platform: platform,
            browser: bName,
            versionFull: version,
            versionShort: version.split('.')[0]
        };
    }
    catch (err)
    {
        browsrObj =
        {
            platform: platform,
            browser: 'unknown',
            versionFull: 'unknown',
            versionShort: 'unknown'
        };
    }

    return browsrObj;
}
