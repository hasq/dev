function HasqLogo(id)
{
    var counter = 0;

    var ret =
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
    return ret;
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
