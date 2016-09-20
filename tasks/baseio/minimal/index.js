(context, req, res, next)  => {
    res.send("this is baseio/minimal/index.js, hello from "+ local() );
}

function local(arg){
	console.log("local function called");
	return "Local";
}