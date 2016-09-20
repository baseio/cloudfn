var express     = require('express');
var chalk       = require('chalk');
var glob        = require('glob');
var fs          = require('fs');
var cors        = require('cors');
var mkdirp      = require('mkdirp');
var moment      = require('moment');
var bodyParser  = require('body-parser');
var formidable  = require('formidable');
var verify      = require('./lib/verify');

var jsdb        = require('./lib/jsdb');

let tasks       = {};
let port        = process.env.port || 3001;
let app         = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());
app.disable('x-powered-by');

/// todo
/// - user auth
/// - logging
/// - add good things to context

app.listen(port, () => {
    console.log( chalk.yellow('Listining on port '), port);
});

app.post('/add/:user/:script', (req,res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var file = files['js_file'];
        if( !file ){
            var msg = "No source file received... usage:...";
            console.log(msg);
            res.send(msg);
            return;
        }
        var user    = req.params.user;
        var script  = req.params.script;
        var source  = fs.readFileSync( file.path ).toString();

        verify(source, (err, code) => {
            if( !err && code ){

                var file = __dirname + '/tasks/'+ user +'/'+ script; 
                mkdirp(file, function (err) {
                    if (err) console.error(err);
                    fs.writeFileSync( file +'/index.js', code);
                });

                mount(user, script, code);
                var msg = "Added!";
                console.log(msg);
                res.send(msg); 
            }
        });
    });
});

function mount(user, script, source){

    console.log( chalk.green(' Enabled'), user, script);
    tasks[user]                 = tasks[user] || {};
    tasks[user][script]         = tasks[user][script] || {};
    tasks[user][script].code    = source;
    tasks[user][script].context = create_ctx();

    app.get(`/${user}/${script}`, function(req, res){
        console.log( chalk.green(' Calling'), req.url );

        var timestamp = moment();

        restore_context(user+'/'+script, (err, data) => {
            if (err) throw err;

            console.log("#1 data", data );

            tasks[user][script].context = Object.assign({}, tasks[user][script].context, {store:data} );
            console.log('ctx',  tasks[user][script].context);

            res.header('x-runtime-ms', moment().diff(timestamp) );

            try{
                tasks[user][script].code(tasks[user][script].context, req, res, (err, result) => {
                    if( err ){
                        console.log( chalk.red('         Error:'), err );
                    }else{
                        if( result === undefined ){
                            console.log( chalk.green('         done'));
                        }else{
                            console.log( chalk.green('         done. Result:'), result );
                        }
                        persist_context(user+'/'+script, tasks[user][script].context.store );
                    }
                });
            }catch(e){
                //console.log( "Error running user code:") chalk.red(e) );
                userland_error(user, script, e);
                res.status(500).end();
            }

        });
    });
}


function persist_context( path, store ){
    return persist_context_fs(path, store);
}
function persist_context_fs(path, store){
    var filename = "./tasks/"+ path +"/store.json";
    console.log("< filename", filename);
    fs.writeFile( filename, JSON.stringify(store) );
}

function restore_context(path, cb){
    restore_context_fs(path, cb);
}
function restore_context_fs(path, cb){
    var filename = "./tasks/"+ path +"/store.json";
    console.log("> filename", filename);
    fs.readFile( filename, (err, data) => {
        if (err) throw err;
        cb(null, JSON.parse(data) || {} );
    });
}

function init_context(path){
    return init_context_fs(path);
}
function init_context_fs(path){
    var filename = "./tasks/"+ path +"/store.json";
    console.log("+ filename", filename );
    try {
        fs.accessSync(filename);
    }catch (e){
        console.log("+ filename", chalk.red('does not exist') );
        persist_context_fs(path, {} );
    }
}


function userland_error(user, script, error){
    console.log( chalk.red("Error in"), user+'/'+script, chalk.red( ""+error) );
    var msg = [ moment().utc(), "Error running user code:", " User: "+ user, " Script: "+ script, error, "\n\n"];
    fs.appendFile('error.log', msg.join("\n"));
}

function mount_tasks_fs(){
    /// iterates ./tasks
    
    glob.sync( "./tasks/**/*.js", {} ).map( function(file){
        //console.log("file:", file);       // ./tasks/baseio/minimal/index.js
        var parts   = file.split('/');      // [ '.', 'tasks', 'baseio', 'minimal', 'index.js' ]  
        var user    = parts[2];             // baseio
        var script  = parts[3];             // minimal        
        var source  = fs.readFileSync(file).toString();

        verify(source, (err, code) => {
            if( !err && code ){
                mount(user, script, code);
                /// init empty context.store if needed
                init_context(user+'/'+script);
            }
        });
    });
}

function create_ctx(req,res){
    /// populates the pr.user context object
    //return Object.assign({}, {version:'0.0.1'}, {counter:0}, req, res);
    return Object.assign({}, {version:'0.0.1'}, {store:{}}, req, res);
}

mount_tasks_fs();