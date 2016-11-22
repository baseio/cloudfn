var express     = require('express');
var chalk       = require('chalk');
var glob        = require('glob');
var fs          = require('fs');
var cors        = require('cors');
var mkdirp      = require('mkdirp');
var moment      = require('moment');
var bodyParser  = require('body-parser');
//var formidable  = require('formidable');
var formidable  = require('express-formidable');
var moment      = require('moment');
var path        = require('path');

//var verify      = require('./lib/verify');
var cloudfn     = require('./lib.cloudfn.js');
var pack        = require('./package.json');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());
app.use(formidable());
app.disable('x-powered-by');


/// todo
/// - logging (via pub-sub > file >> websocket)
/// - add good things to context (via plugins?)
/// - secure node.js (docker? unpriviliged user...)

//
// PLANNING
// logs [appname/scriptname]
// set
// dis [user/app/script]
// en  [user/app/script]
// status [user/app/script]

// API Context wishlist:
// Database (gun?)
// file reader (CSV, csv2json, ...)
// Emailer
// SMS'er

// Premium
// Admin

var usersfile = __dirname + '/users.json';
var users = users_load();
console.dir( users );
/*
{
    'js': {
        username: 'js',
        email: 'js@base.io',
        hash: '5d63e4a1ceeb6a83f8a3ef8f85e09955dcc4ecb75ba6e3bca376a5c502023ea0',
        p: true,
    },
}
*/

app.listen(port, () => {
    console.log( chalk.yellow('Listining on port '), port);
});

app.get('/version', (req, res) => {
    res.send( pack.name +", v."+ pack.version );
    res.end();
});

function users_load(){
    return JSON.parse(fs.readFileSync(usersfile).toString() );
}
function users_save(){
    fs.writeFileSync(usersfile, JSON.stringify(users, null, '    '));
}


app.get('/ls/:user/:hash', (req, res) => {
    if( !verify_user(req.params.user, req.params.hash) ) return send_error(res, 'VERIFICATION_ERROR');

    //console.log("TODO: ls", Object.keys( cloudfn.tasks.list[req.params.user] ));

    send_msg(res, "ls", Object.keys( cloudfn.tasks.list[req.params.user] ));
});

app.get('/u/:user/:hash', (req, res) => {

    log.info({user:req.params.user, hash:req.params.hash, fields:req.fields});
    
    console.log("current users:", users );

    // if username exists, the hash *must* match - otherwise anyone can disable an account by chaninging its email
    if( Object.keys(users).indexOf(req.params.user) > -1 ){
        if( verify_user(req.params.user, req.params.hash) ){
            // credentials match
            send_msg(res, 'allow');
        }else{
            // credentials does not match
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            log.warn("USER_VERIFICATION_ERROR @ /u/"+ req.params.user +" @ ip:"+ ip );
            send_msg(res, 'deny');
        }
    }else{
        // username does not exist, create new user
        users[req.params.user] = {
            username : req.params.user, 
            email    : req.fields.email,
            hash     : req.params.hash,
            state    : 'enabled', //TODO: new = needs email verification | enabled = ok | disbled = cant run | recovery = awaiting password reset
            premium  : false, //TODO
            created_at: moment().toISOString()
        };
        users_save();
        log.warn("USER_CREATE @ /u/"+ req.params.user +" @ ip:"+ ip );
        send_msg(res, 'new');
    }
});


app.post('/a/:user/:hash', (req, res) => {
    log.info({user:req.params.user, hash:req.params.hash, fields:req.fields, files:req.files});
    
    if( !verify_user(req.params.user, req.params.hash) ){
        return send_msg(res, 'deny');
    }

    var user    = req.params.user;
    var script  = req.fields.name;
    var tmpfile = req.files['file'].path;

    cloudfn.tasks.add(app, user, script, tmpfile, (ok) => {
        if( ok ){
            send_msg(res, 'SCRIPT_ADDED_SUCCESS:'+ 'https://cloudfn.stream/'+ user +'/'+ script);
        }else{
            send_msg(res, 'SCRIPT_VERIFICATION_ERROR');
        }
    });
});



function verify_user(username, hash){
    //console.log(username, hash, users[username].hash)
    var usr = users[username];
    return usr ? usr.hash === hash : false;
}

function send_error(res, msg, data){
    log.error("@send_error "+ msg);
    res.status(500);
    res.json({ok:false, msg:msg, data:data});
    res.end();
}

function send_msg(res, msg, data){
    log.info("@send_msg "+ msg);
    res.status(200);
    res.json({ok:true, msg:msg, data:data});
    res.end();
}

cloudfn.tasks.load(app);
