// Hasq Technology Pty Ltd (C) 2013-2016

function HasqdLed(){
    //this.counter = 0;
}

HasqdLed.prototype.fail = function(){
    $('#hasqd_led').html(picRed);
    widPrintRecordsLastOperation('Connection failed!');
};

HasqdLed.prototype.inc = function(){
    setTimeout(function(){ $('#hasqd_led').html(picGryGrn); }, 500);
};

HasqdLed.prototype.dec = function(){
    setTimeout(function(){ $('#hasqd_led').html(picGry); }, 500);
};

var hasqdLed = new HasqdLed();

function widAnimateProgbar(){
    $('#hasqd_led').html(picGry);
}

function widTokensValueOninput(id){
	clearTimeout(glTimerId);
	$('#' + 'tokens_data_div').hide();
	var nextTdId = $('#' + id).closest('td').next('td').attr('id'); //find id of the next <td>
	var t = $('#' + id).val();
	var th = hex_md5(t); //var th = hex_sha2md5($('#' + id).val());

	if ($('#' + id).val() == ''){
		$('#' + nextTdId).empty();
		return;
	}
	
	$('#' + nextTdId).html(th);
	
	var cmd = 'last' + ' ' + glDataBase + ' ' + th;

	var req = function(){
		var timerId = glTimerId;
		
		var cb = function(data){
			//console.log('1. glTimerId:' + glTimerId);
			//console.log('1. timerId:' + timerId);
			if (timerId === glTimerId){
				var r = engGetLastRecord(data);
				if (r.message === 'OK'){
					var tokensData = r.d;
					if (tokensData.length > 0) {
						$('#' + 'tokens_data_div').show();
						$('#' + 'tokens_data_div').html(r.d);
					}
				} else if (r.message === 'IDX_NODN'){
					$('#' + 'tokens_data_div').show();
					$('#' + 'tokens_data_div').html('No such token');
				}
			} else {
				clearTimeout(timerId);
			}
		}		
		ajxSendCommand(cmd, cb, hasqdLed);
	}
	
	glTimerId = setTimeout(req, 1000);
	//console.log('0. glTimerId:' + glTimerId);
}
