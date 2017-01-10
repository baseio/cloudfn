return (api) => {
    arguments = api.clean.call(this, api);
    // sandbox end
    //(api) => {

	/// example of a rest-ish blog backend
	
	/// rails-style routing, e.g. <baseurl>/post/new
	const controller 	= api.args.raw.param_keys[0];
	const action 		= api.args.raw.param_keys[1];

	// init store if needed
	api.store.data['posts'] = api.store.data['posts'] || {};

	const route = () => {

		if( api.method == 'GET' ){
			switch( controller ){

				// blog/list
				case 'list': getAll(); break;

				// blog/:slug
				default : getOne();
			}
		}

		if( api.method == 'POST' ){
			// Limit access to "admin" functions
			api.auth({origins:['localhost']}, () => {
				switch( controller ){
					case 'add': add(); break;
					default : api.send({ok:true, version:version()});
				}
			});
		}
	}

	const version = () => '0.0.1';

	const getOne = () => {
		api.send({ok:true, msg:'getOne', record:api.store.data['posts'][controller] || {} });
	}

	const getAll = () => {
		// api.store.data['posts']
		//api.send({ok:true, msg:'getAll', records:api.store.data['posts']});
		let records = [];
		for( var post in api.store.data['posts'] ){
			records.push( api.store.data['posts'][post] );
		}
		api.send({ok:true, msg:'getAll', records:records});
	}

	const add = () => {
		// validate the input
		api.expect({
			slug:  'required|string|slug',
			text:  'required',
			title: 'required|string',
			tags:  'string',
			meta:  'json',
			numb:  'numeric'
		},
		(data) => {
			console.log("- add, valid params! data:");
			console.dir( data, {colorize:true} );

			data.created_at = new Date().toISOString();

			// upsert
			api.store.data['posts'][data.slug] = data;
			api.store.save();

			api.send({ok:true, msg:'added', record:api.store.data['posts'][data.slug]});
		});
	}

	// begin
	route();
}