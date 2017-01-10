return (api) => {
    arguments = api.clean.call(this, api);
    // sandbox end
    //(api) => {

	let t = api.args.time || 1234;

	console.log("-- wait, time:", t );
	
	api.wait( () => {
		console.log("-- done waiting");
		api.send({ok:true, msg:'Done', time:t});
	}, t );
	
}