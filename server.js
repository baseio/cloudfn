var express     = require('express');
var chalk       = require('chalk');
var glob        = require('glob');
var fs          = require('fs');
//var cors        = require('cors');
var moment      = require('moment');
var bodyParser  = require('body-parser');
var formidable  = require('express-formidable');
var path        = require('path');

var cloudfn     = require('./lib.cloudfn.js');
var pack        = require('./package.json');

cloudfn.api.init();
cloudfn.users.load();

//cloudfn.api.test();

//return;

var pino        = require('pino');
var pretty = pino.pretty()
pretty.pipe(process.stdout)
var log = pino({
  name: 'cloudfn',
  safe: true
}, pretty);

let tasks       = {};
let port        = process.env.port || 3033;
let app         = express();

//app.options('*', cors()); // include before other routes

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
//app.use(cors());
app.use(formidable());
app.disable('x-powered-by');


/// todo
/// - logging (via pub-sub > file >> websocket)
/// - add good things to context (via plugins?)

app.listen(port, () => {
    console.log( chalk.yellow('Listining on port '), port);
});

/// Display system version
app.get('/version', (req, res) => {
    res.send( pack.name +", v."+ pack.version );
    res.end();
});



/// List the users' scripts
app.get('/@/ls/:user/:hash', (req, res) => {
    //if( !verify_user(req.params.user, req.params.hash) ) return send_error(res, 'VERIFICATION_ERROR');
    if( !cloudfn.users.verify(req.params.user, req.params.hash) ) return send_error(res, 'VERIFICATION_ERROR');

    let list = [];
    if( cloudfn.tasks.list[req.params.user] ){
        list = Object.keys( cloudfn.tasks.list[req.params.user]);
    }

    send_msg(res, "ls", list );
});

app.get('/@/u/:user/:hash', (req, res) => {

    log.info({user:req.params.user, hash:req.params.hash, fields:req.fields});
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    console.log("current users:", cloudfn.users.get() );

    // if username exists, the hash *must* match - otherwise anyone can disable an account by chaninging its email
    if( cloudfn.users.exists(req.params.user) ){
        if( cloudfn.users.verify(req.params.user, req.params.hash) ){
            // credentials match
            send_msg(res, 'allow');
        }else{
            // credentials does not match
            log.warn("USER_VERIFICATION_ERROR @ /u/"+ req.params.user +" @ ip:"+ ip );
            send_msg(res, 'deny');
        }
    }else{
        // username does not exist, create new user
        cloudfn.users.set(req.params.user, {
            username : req.params.user, 
            email    : req.fields.email,
            hash     : req.params.hash,
            state    : 'enabled', //TODO: new = needs email verification | enabled = ok | disbled = cant run | recovery = awaiting password reset
            premium  : false, //TODO
            created_at: new Date().toISOString()
        });

        log.info("USER_CREATE @ /u/"+ req.params.user +" @ ip:"+ ip );
        send_msg(res, 'new');
    }
});

app.post('/@/rm/:user/:hash', (req, res) => {
    log.info({endpoint:'rm', user:req.params.user, fields:req.fields});

    if( !cloudfn.users.verify(req.params.user, req.params.hash) ){
        return send_msg(res, 'deny');
    }

    var user    = req.params.user;
    var script  = req.fields.name;

    cloudfn.tasks.remove(user, script);
    
    send_msg(res, "SCRIPT_REMOVAL_SUCCESS", Object.keys( cloudfn.tasks.list[req.params.user] ));
    console.dir(cloudfn.tasks.list, {colors:true});
});

app.post('/@/a/:user/:hash', (req, res) => {
    log.info({endpoint:'a', user:req.params.user, fields:req.fields, files:req.files});
    
    if( !cloudfn.users.verify(req.params.user, req.params.hash) ){
        return send_msg(res, 'deny');
    }

    var user    = req.params.user;
    var script  = req.fields.name;
    var tmpfile = req.files['file'].path;

    cloudfn.tasks.add(user, script, tmpfile, (ok) => {
        if( ok ){

            add_routes(user,script, true);

            send_msg(res, 'SCRIPT_ADDED_SUCCESS:'+ 'https://cloudfn.stream/'+ user +'/'+ script);
        }else{
            send_msg(res, 'SCRIPT_VERIFICATION_ERROR');
        }
    });
});


// https://cloudfn.stream/logs/js/counter/346PU346PUBC45723P7WB45884548EPQ
app.get('/@/log/:user/:app/:hash', (req, res) => {
    if( !cloudfn.users.verify(req.params.user, req.params.hash) ) return send_error(res, 'VERIFICATION_ERROR');

    console.log("TODO: show log for", "user:", req.params.user, "app:", req.params.app);

    send_msg(res, "logs todo");
});




function send_error(res, msg = '', data = {}){
    log.error("@send_error "+ msg);
    res.status(500);
    res.json({ok:false, msg:msg, data:data});
    res.end();
}

function send_msg(res, msg = '', data = {}){
    log.info("@send_msg "+ msg);
    res.status(200);
    res.json({ok:true, msg:msg, data:data});
    res.end();
}

function add_routes( user, script, showRoutes=false){

    let url1 = `/${user}/${script}/*`;
    let url2 = `/${user}/${script}`;

    /// Make sure the route is not defined already
    /// (Can happen if a user re-uploads a script)
    let add = true;
    app._router.stack.map( (layer) => {
        if( layer.route ){
            let test = layer.route.path;
            if( test === url1 || test === url2 ) add = false;
        }
    });

    if( add ){
        app.get(url1, cloudfn.tasks.list[user][script].fn);
        app.get(url2, cloudfn.tasks.list[user][script].fn);

        app.post(url1, cloudfn.tasks.list[user][script].fn);
        app.post(url2, cloudfn.tasks.list[user][script].fn);

        app.put(url1, cloudfn.tasks.list[user][script].fn);
        app.put(url2, cloudfn.tasks.list[user][script].fn);
    }
    if( showRoutes ) show_routes();

    if( !add ) console.log("add_routes: Route exists", url1);
}

function show_routes(){
    app._router.stack.map( (layer) => {
        if( layer.route ){
            let m = cloudfn.utils.rightPad( Object.keys(layer.route.methods)[0].toUpperCase(), 5);
            let p = layer.route.path;
            console.log(m, p);
        }
    });
}

// as we want to keep the lib.cloudfn.js library clean,
// and handle alll server-specific stuff *here* (in the server file),
// we do the mounting here:

function load_tasks_from_file(){
    //console.log('load_tasks_from_file');
    glob.sync( './tasks/**/**/*.js', {} ).map( function(file){
        var parts   = file.split('/');      // [ '.', 'tasks', 'baseio', 'minimal', 'index.js' ]  
        //console.log("file:", file, parts);       // ./tasks/baseio/minimal/index.js
        var user    = parts[2];             // baseio
        var script  = parts[3];             // minimal
        var index   = parts[4];             // index.js        
        var code    = fs.readFileSync(file).toString();
        //console.dir({user, script, file}, {colors:true});

        var jscode  = cloudfn.verify.compile(code);
        
        if( jscode ){
            cloudfn.tasks.mount(user, script, jscode);
            add_routes(user, script);
        }
    });

    console.dir(cloudfn.tasks.list, {colors:true});
    show_routes();
}

load_tasks_from_file();