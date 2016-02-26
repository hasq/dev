function HasqLogo() {
    var counter = 0;
	return {
		wait: function() {
			counter++;
			if (counter == 1) return $('#logo_span').find('img').attr('src', imgSrcLogoBlink);
		},
		done: function() {
			counter--;
			if (counter == 0) return setTimeout( function() {$('#logo_span').find('img').attr('src', imgSrcLogoBlue)}, 200);
		},
		fail: function() {
			counter = 0;
			console.log(counter);
			$('#logo_span').find('img').attr('src', imgSrcLogoRed);
		}
	}
}
/*
HasqLogo.prototype.wait = function () {
	console.log(counter);
	if (counter > 1) return;
	$('#logo_span').html(imgSrcLogoBlink);
};

HasqLogo.prototype.done = function (counter) {
	if (counter == 0) {
		setTimeout(function () {
			$('#logo_span').html(imgSrcLogoBlue);
		}, 500);
	}
};

HasqLogo.prototype.fail = function (counter) {
    $('#logo_span').html(imgSrcLogoRed);
    //widShowLog('Server connection failure!');
};
*/

function TextArea() {
	return {
		add: function (jqObj, data) {
			jqObj.val(jqObj.val() + data);
		},
		clear: function (jqObj, data) {
			if (typeof data == 'undefined') return jqObj.val('');
			jqObj.val('');
			jqObj.val(data);	
		},
		clearexcept: function (jqObj) {
			$('textarea').not(jqObj).val('');
		},		
		val: function (jqObj) {
			jqObj.val();
		}
	}
}

var hasqLogo = HasqLogo();
var textArea = TextArea();