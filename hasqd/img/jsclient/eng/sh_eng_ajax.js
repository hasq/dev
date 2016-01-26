// Hasq Technology Pty Ltd (C) 2013-2016

function ajxSendCommand(cmd, callback, progress) {
	//console.log('---start!');
    progress.inc();
    //$.get('/' + cmd, function (data){})
    // use post to prevent caching
    $.post('/', 'command=' + cmd, function(data){})

    .done(function (data) {
		//console.log('-done:' + data);
		//setTimeout(function(){callback(data)}, 3000);
		callback(data);
		progress.dec();
    })

    .fail(function(){
        progress.fail();
    })

    .always(function(){
    });
}
