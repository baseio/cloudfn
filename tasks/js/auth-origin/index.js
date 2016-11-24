return (api) => {
    arguments = api.clean.call(this);
    // sandbox end
    //(api) => {

	/// Example of using the api.auth.keys feature
	/// Provide the valid keys, and wrap your code in its callback.

	//api.auth({origins:['*cloudfn.github.io/*']}, () => {
	api.auth({origins:'*cloudfn.github.io/webs*'}, () => {
		/// your code here

		api.send({message:"This is only printed if authenticated"});
	});
}

// cli usage:
// $ cfn test examples/auth-token.js {Auth:aa}
// or, to check failure:
// $ cfn test examples/auth-token.js {Auth:bb}