

function HasqLogo() {
    var counter = 0;
	return {
		wait: function() {
			counter++;
			if (counter == 1) return $('#logo_span').find('img').attr('src', imgLogoBlink);
		},
		done: function() {
			counter--;
			if (counter == 0) return setTimeout( function() {$('#logo_span').find('img').attr('src', imgLogoBlue)}, 200);
		},
		fail: function() {
			counter = 0;
			console.log(counter);
			$('#logo_span').find('img').attr('src', imgLogoRed);
		}
	}
}
/*
HasqLogo.prototype.wait = function () {
	console.log(counter);
	if (counter > 1) return;
	$('#logo_span').html(imgLogoBlink);
};

HasqLogo.prototype.done = function (counter) {
	if (counter == 0) {
		setTimeout(function () {
			$('#logo_span').html(imgLogoBlue);
		}, 500);
	}
};

HasqLogo.prototype.fail = function (counter) {
    $('#logo_span').html(imgLogoRed);
    //widShowLog('Server connection failure!');
};
*/

var hasqLogo = HasqLogo();

var preloadImg = [];
function preload(images) {
    if (document.images) {
        for (i = 0; i < images.length; i++) {
			preloadImg[i] = new Image();
            preloadImg[i].src = images[i];
        }
    }
}