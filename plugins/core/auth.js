module.exports = function(opts, cb){
	console.log("@core.auth opts:", opts);
	console.log("@core.auth args:", this.args);

	let token = this.args.query.token || this.args.params.token || '';

	if( opts.keys ){
		console.log("@core.auth:", opts.keys, opts.keys.indexOf(token));

		if( opts.keys.indexOf(token) > -1 ){
			cb();
		}else{
			this.send({ok:false, message:"access denied (keys)"});
			return;
		}
	}


}