(c, req, res, next) => {
/*

maps world ids to user ids

call like 
$ http 127.0.0.1:3033/baseio/userdb?wid=2325499

*/

	let awid = req.query.wid || -1;
	console.log( req.query, awid );
	

	c.store.wids = c.store.wids || [
		{wid:'23254997', uid:1},
		{wid:'iphoneUUID', uid:1},
	];

	let ok = false;
	let result = {};
	c.store.wids.map( (record) => {
		if( record.wid === awid ){
			result = record;
			ok = true;
		}
	});

	res.json( Object.assign({}, result, {ok}) );

	next();
}