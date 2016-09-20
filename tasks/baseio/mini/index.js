return (context, req, res, next)  => {
	//res.send('ok');

	res.send("Can we access another script's local functions? Local -> "+ local() );

	next();
}