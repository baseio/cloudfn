return (api) => {
    arguments = api.clean.call(this, api);
    // sandbox end
    //(api) => {
	api.send("this is static/main.js");
}