function engGetParsedDataValue(data){
	var r = data;
	if (r !== undefined && r.length > 0) {
		var ss = '\u0020'; //unicode space
		var lf = '\u000a'; //unicode line-feed

		for (var i=0; i < r.length; i++) {
			//console.log(r.length);			
			if (r[i] === '\u005c' && r[i+1] === '\u005c' && r[i+2] === '\u006e'){
				r = r.substring(0,i) + r.substr(i+1, r.length);
			} else if (r[i] === '\u005c' && r[i+1] === '\u006e'){
				r = r.substring(0,i) + lf + r.substr(i+2, r.length);
			} else if (r[i] === '\u005c' && r[i+1] === '\u0020'){
				r = r.substring(0,i) + ss + r.substr(i+2, r.length);
			}
		}
	}
	return r;
}