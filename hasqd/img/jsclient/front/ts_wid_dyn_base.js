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
	
	var objTokensDataDiv = $('#' + 'tokens_data_div');
	objTokensDataDiv.hide();
	var nextTdId = $('#' + id).closest('td').next('td').attr('id'); //find id of the next <td>
	var objTokensHashedValueTd = $('#' + nextTdId);
	var objTokensRawValue = $('#' + id);
	var rt = objTokensRawValue.val();
	
	if (engIsHash(rt, glDbHash)) {
		var ht = rt;
	} else {
		var ht = engGetHash(rt, glDbHash)
	}
	
	if (rt == ''){
		objTokensHashedValueTd.empty();
		return;
	} else if (engIsHash(rt, glDbHash)) {
		objTokensHashedValueTd.empty();
	} else {
		objTokensHashedValueTd.html(ht);
	}
	
	var cmd = 'last' + ' ' + glDataBase + ' ' + ht;

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
						objTokensDataDiv.show();
						objTokensDataDiv.html(r.d);
					}
				} else if (r.message === 'IDX_NODN'){
					objTokensDataDiv.show();
					objTokensDataDiv.html('No such token');
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
