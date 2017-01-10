return (api) => {
    arguments = api.clean.call(this, api);
    // sandbox end
    //(api) => {

	/// Example of using the api.auth.origins feature
	/// Provide the valid origins (hostnames, urls...), and wrap your code in its callback.

	api.auth({origins:['localhost']}, () => {
		
		/// your code here

		api.send({ok:true, msg:"Access allowed!"});
	});
}
