var express     = require('express');
var chalk       = require('chalk');
var glob        = require('glob');
var fs          = require('fs');
var cors        = require('cors');
var mkdirp      = require('mkdirp');
var bodyParser  = require('body-parser');
var formidable  = require('formidable');
var verify      = require('./lib/verify');

let tasks       = {};
let port        = process.env.port || 3001;
let app         = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

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
        tasks[user][script].context = Object.assign(tasks[user][script].context, req, res);
        
        tasks[user][script].code(
            tasks[user][script].context, 
            (err,result) => {
                res.send(result);
            }
        );
    });
}

function mount_tasks_fs(){
    /// iterates ./tasks
    
    glob.sync( "./tasks/**/*.js", {} ).map( function(file){
        //console.log("file:", file);     // ./tasks/baseio/minimal/index.js
        var parts   = file.split('/');    // [ '.', 'tasks', 'baseio', 'minimal', 'index.js' ]  
        var user    = parts[2];         // baseio
        var script  = parts[3];         // minimal        
        var source  = fs.readFileSync(file).toString();

        verify(source, (err, code) => {
            if( !err && code ){
                mount(user, script, code);
            }
        });
    });
}

function create_ctx(req,res){
    /// populates the pr.user context object
    return Object.assign({}, {version:'0.0.1'}, {counter:0}, req, res);
}

mount_tasks_fs();