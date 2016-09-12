# OpsTask

A (conceptual) clone of Auth0's WebTask.

## Stories

As a user, I would like to

- write my code in javascript

	```
	module.exports = function (ctx, cb) { cb(null, "hello world"); }
	
	module.exports = function (ctx, cb) {
		let db = ctx.mongo.use(env.db);
		let ok = db.insert({key:ctx.req.key, val:ctx.req.val, type:ctx.req.type});
		// or with utils:
		let ok = db.insert( ctx.utils.kvt() );
		cb(ok.error, {records:db.count());
	}
	```

- upload that code to the cloud, to create a http endpoint user/appid

	```
	$ ops test.js
	> https://ops.base.io/user/test
	
	```

- call my code (from other code, urls or cli)

	```
	$ curl -O https://ops.base.io/user/kvt-test?key=js&val={comp:base.io}&type=user
	```

- access / require npm modules from my code

As a engineer, I would like my users code to

- run in sandbox
- stream logs user/appid/logs

	```
	$ httail https://ops.base.io/user/kvt-test/logs
	```