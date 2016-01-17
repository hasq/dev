function ProgressLed() {
    //this.counter = 0;
}

ProgressLed.prototype.fail = function () {
    $('#progress_led').html(picRed);
    widPrintRecordsLastOperation('Connection failed!');
};

ProgressLed.prototype.inc = function () {
    setTimeout(function(){ $('#progress_led').html(picGryGrn); }, 500);
};

ProgressLed.prototype.dec = function () {
    setTimeout(function(){ $('#progress_led').html(picGry); }, 500);
};

var progressLed = new ProgressLed();

function widAnimateProgbar() {
    $('#progress_led').html(picGry);
}

function widTokensValueOninput(id){
	var nextTdId = $('#' + id).closest('td').next('td').attr('id');
	//var th = hex_sha2md5($('#' + id).val())
	var th = hex_md5($('#' + id).val());
	$('#' + nextTdId).html(th);
	var cb = function (data) {
		console.log(data);
	}
	var cmd = 'last' + ' ' + th + ' ' + '_MD5DB';
	console.log(cmd);
	var last = function () {
		ajxSendCommand(cmd, cb, progressLed);
	}
	
	timerId =  setTimeout(last,	1000);

}