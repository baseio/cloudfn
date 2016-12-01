# cloudfn

Short for "cloud function", cloudfn is a Function-as-a-Service (FaaS) that takes the 
infrastructure burden out of server-side code.

Cloudfn is suitable for projects that needs some* server-based functionality,
but cant afford (or bother) to setup the team, tech and infrastructure required.

With cloudfn, you simply express your functionality in a javascript function,
use the `cfn` command-line tool to upload it,
and call the resulting URL to get/set your data.

Check /examples and /test for, well, examples.

## Setup

Install the commandline tool with npm:
	
	sudo npm i -g cfn 


Create a user account

	cfn user

You will be prompted for some information.
The password you provide will *not* be stored anywhere, so remeber it.
Read our [privacy]() and [authentication]() docs for additional details.	


## Scripting

All cloudfn scripts adhere to this signature:

	(api) => {
		// your code here
	}

or, in traditional format (you can mix and match as you want)

	function(api){
		// your code here
	}

The [api]() is your connection to, and from, the world.
A 'hello world' looks like so:

	(api) => {
		api.send("hello world");
	}

But, lets speak JSON instead

	(api) => {
		api.send({ok:true, msg:"hello world"});
	}	

Save that to testing/hello-world.js

To run this code locally, do

	cfn test testing/hello-world.js


## Upload

To upload the script to your cloudfn account, do

	cfn add testing/hello-world.js

The server will reply with the URL to your script, sth like this:

	https://cloudfn.stream/<username>/hello-world

Try opening that in a browser.


## Call from CLI

All scripts are available at simple HTTP Urls.
To 'call' them, just load the URL. 
(Issue a GET request that is)

The cloundfn tool contains a simple utility you can use: 

	cfn call <username>/hello-world

and your favorite http tool, or library will work too:

	curl https://cloudfn.stream/<username>/hello-world
	http https://cloudfn.stream/<username>/hello-world


## Call from jQuery


## Call from vanilla Javascript

	<script src="https://cloudfn.stream/<username>/hello-world?format=jsonp">
		console.log(jsonp);
	</script>


## Access control

Note that all scripts, by default, are openly available to 'call' for anyone.
To limit that, cloudfn supports two access control strategies:
[Token]() and [Origin]()


## Next

- Readup on the api-object
- Check examples
- Check blogposts

## Premium features

- TBA (FS, Websockets, PubSub, Gun) 