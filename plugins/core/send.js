
module.exports = function(jsonObject){

	//console.log("@send() ", this, jsonObject);
	//console.log("@send() ", this.args);

	// obey return format from url-query
	console.log("@core.send format?", this.args.query);
	if( this.args.query.format ){
		switch (this.args.query.format) {
			case 'jsonp' : 
				this.res.set('Content-Type', 'text/javascript');
				this.res.send( 'var jsonp='+ JSON.stringify(jsonObject, null, '  ') );
				break;
		}
	}else{
		this.res.json(jsonObject);
	}
}
