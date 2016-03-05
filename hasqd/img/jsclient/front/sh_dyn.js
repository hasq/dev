function HasqLogo(id) {
    var counter = 0;
	var $obj = $('#' + id).find('img');
	return {
		wait: function() {
			counter++;
			if (counter == 1) return $obj.attr('src', imgLogoBlink);
		},
		done: function() {
			counter--;
			if (counter == 0) return setTimeout( function() {
				$obj.attr('src', imgLogoBlue) 
				}, 
			200);
		},
		fail: function() {
			counter = 0;
			$obj.attr('src', imgLogoRed);
		}
	}
}

function preload(container) {
    if (document.images) {
        for (i = 0; i < container.length; i++) {
			preloadImg[i] = new Image();
			preloadImg[i].onload = function () { };
            preloadImg[i].src = container[i];
		}
    }
}