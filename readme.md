# cloudfn

Short for "cloud function", cloudfn is a {yeah, this is the hard part}.


Theres a few parts in play:

- a javasscript file exporting a function with a (context, req, res) signature
- the context, req, res. See below.
- a CLI to CRUD scripts to your 'account'
- a OAuth or WebToken based authentication method
- streaming access and error logs

#### Example functions

```javascript

// minimal example
(context, req, res, next) => res.send('ok')
```

### Example use

1. Write the following to a file, 'counter.js'
```javascript
(context, req, res, next) => {
	context.store.counter = context.store.counter +1 || 1;
	res.json({counter});
}
```

2. 'upload' the file to the service:
```shell
	$ ops counter.js
```

3. The service replies with the URL endpoint:
```shell
	$ adding 'counter' to https://ops.base.io/{your}/{app}/counter
	# note: We come back to the {your} and {app} below
```

4. Call the function by GET'ing the url
```shell
	$ http https://ops.base.io/{you}/{app}/counter
	HTTP/1.1 200 OK
	Access-Control-Allow-Origin: *
	Connection: keep-alive
	Content-Length: 73
	Content-Type: text/html; charset=utf-8
	Date: Tue, 13 Sep 2016 13:07:09 GMT
	ETag: W/"49-2EMQqjVS4vxr45E9IbZl7g"

	{
		"counter": 1
	}
```
Calling it again will increment the counter.


### The `context`

The context is a JS object provided to the function.  
It is immutable, but contains a (growing) number of properties

| Prop | Desc | Avail |
| ---  | ---  | ---   |
| store 	| a persisted JS object. Put anything in there. | 0.1.0 |
| session | a persisted JS object, pr. session (user)   | planned |

Follow the development here [LINK TO ISSUE]

### The `req` and `res` and `next`

The `req` is Express' `req` object.  
The `res` is Express' `res` object.  
The `next` is function with signature (err, result). When called, the system persists your state etc. Call it when you're done.


### The CLI

All usage of the `name` system happens through the cli.  
Install it with npm
```javascript
	$ sudo npm install name-cli -g
```

When installed, the following commands

```shell
$ ops run  <scriptfile> 	# adds (or updates) a script
$ ops del  <scriptname>  	# removes the script from the (remote) system
$ ops lint <scriptfile> 	# checks if the scriptfile will work
```

All scripts will reside under your auth-name.

### The ({your}/{app}) Auth

TODO

Current thinking / design goals:  

Auth:  
- no configuration (the cli should know you somehow)
- maybe by loggin in to an OAuth provider (just once?) and store the Bearer token?
- will need some kind of user database on the server :-( to store tokens and their repo's...

App:  
- all scripts under one 'app' should have access to the same session and store.  

Loopholes / greyzone:
- nodejs' require() actually works inside the scripts.
- not sure if we need to lock that down somehow (require(fs), read/write anything...)
- but its also a feature... users could require what they need... but then they need a package.json too...


### The Access- and Error-logs

Streaming Access- and Error-logs is created for all script urls,  
and broadcasted as UDP packets. Listen to /logs/udp :
The "base" script-url:  
e.g. https://ops.base.io/{your}/{app}/counter  
publishes logs on
https://ops.base.io/{your}/{app}/counter/logs/udp  

More log interfaces is planned. [LINK TO ISSUE]

---

## Infrastructure

`(WIP)`

So, we need to host this somewhere.
The usual ./up.sh or ./deploy.sh are ok...



----


## User Stories

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


----------

context.redis.set, context.redis.get
context.redis.publish, context.redis.subscribe

are all prefixed with `appname`, so

context.redis.set("key", "value") becomes context.redis.set("appname-key", value),
and
context.redis.get("key", "value") becomes context.redis.get("appname-key", value)


-----------

each appname has one postgres db available through context.postgres, where any number of tables can be added and used.