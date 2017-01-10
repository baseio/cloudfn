return (api) => {
    arguments = api.clean.call(this, api);
    // sandbox end
    //(api) => {

	/// Example of using the api.auth.keys feature
	/// Provide the valid keys, and wrap your code in its callback.

	api.auth({keys:['AABBCC']}, () => {
		
		/// your code here

		api.send({ok:true, msg:"Access allowed!"});
	});
}


// cli usage:
// $ cfn test examples/auth-keys.js {Auth:aa}
// or, to check failure:
// $ cfn test examples/auth-keys.js {Auth:bb}