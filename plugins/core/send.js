
module.exports = function(data){

	//console.log("@send() ", this, data);
	//console.log("@send() ", this.args);

	// obey return format from url-query
	console.log("@core.send use provided format?", this.args);
	if( this.args.query.format ){
		switch (this.args.query.format) {
			case 'jsonp' : 
				this.res.set('Content-Type', 'text/javascript');
				this.res.send( 'var jsonp='+ JSON.stringify(data, null, '  ') );
				break;
		}
	}else{

		if( typeof data === 'string' ){
			this.res.send(data);
			this.res.end();
		}else{
			this.res.json(data);
		}

	}
}
