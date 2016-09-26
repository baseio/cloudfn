(c, req, res, next) => {

/// Send SMS via Nexmo
/// Source from https://docs.nexmo.com/messaging/sms-api
/// $ http POST 127.0.0.1:3033/baseio/smso to=12345678 msg=alo

	let to  = req.body.to  || -1;
	let msg = req.body.msg || -1;
	console.log( req.body, to, msg );

	to = -1;
	if( to === -1 ){
		res.json({ok:false, error:'Invalid options', query:req.body});
		return;
	}

	var https = require('https');

	var data = JSON.stringify({
		api_key: 'd88b959b',
		api_secret: '8d001d34',
		to: '4523254997',
		from: '4523254997',
		text: msg
	});

	var options = {
		host: 'rest.nexmo.com',
		path: '/sms/json',
		port: 443,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(data)
		}
	};

	var req = https.request(options);

	req.write(data);
	req.end();

	var responseData = '';
	req.on('response', function(res){
		res.on('data', function(chunk){
			responseData += chunk;
		});

		res.on('end', function(){
			console.log(JSON.parse(responseData));
			res.json({ok:true, result:JSON.parse(responseData)});
		});
	});

}