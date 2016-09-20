return (ctx, cb) => {
	
	var fs = require('fs');

	console.log('FS test:', fs.readFileSync("server.js").toString() );

	ctx.db = ctx.db || {};
	ctx.db.users = ctx.db.users || [];

	ctx.db.users.push({name:'test', age: 3 + Math.random()*47});

	cb(null, JSON.stringify(ctx.db, null, "\t") );
}

