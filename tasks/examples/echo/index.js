return (api) => {
    arguments = api.clean.call(this, api);
    // sandbox end
    //(api) => {

	// call this script with either
	// query string: "?msg=hello" in the url
	// or url params, "/msg/hallo"
	
    api.send({ok:true, msg:api.args.msg})
}