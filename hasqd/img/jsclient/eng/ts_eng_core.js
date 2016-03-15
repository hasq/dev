function engDoNothing() 
{
    return true;
}

function engSendDeferredRequest(cmd, t, f) 
{
    // Sends ajax request with 500ms delay.
    // the request will be ignored if token value will be changed during this 1000ms
    var req = function () {
        var timerId = glTimerId;

        var cb = function (data) {
            if (timerId === glTimerId)
                f(data);
            clearTimeout(timerId);
        }
        ajxSendCommand(cmd, cb, hasqLogo);
    }
    glTimerId = setTimeout(req, t);
}

function engSendPing(timeDelay)
{
    var cb = function (data)
    {
        var now = new Date();
        var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
        
        console.log(ct);
        
        var resp = engGetResp(data);
        
        if (resp.msg !== 'OK')
            return widShowLog(resp.msg + ': ' + resp.cnt);
    }
    
    ajxSendCommand('ping', cb, hasqLogo);
    
    if (arguments.length == 0)
        return;
        
    if (timeDelay < 60000)     // Ping server every 0s, 5s,10s,15s,...,60s,...,60s,...
        timeDelay += 5000;

    var ping = function () 
    {
        engSendPing(timeDelay);
    }
    
    setTimeout(ping, timeDelay);
}

