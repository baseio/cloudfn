var db = require('../lib/jsdb.js');

module.exports = function(){
    db.insert('users', {name:'js', age:42});
    db.insert('users', {name:'at', age:38});
    db.insert('users', {name:'fg', age:15});
    db.insert('users', {name:'mt', age:9});
    db.insert('users', {name:'lt', age:3});

    console.log( db.list("users") );

    var js = db.select("users", {name:"js"});
    console.log("js:", js);

    var lt = db.select("users", {age:3});
    console.log("lt:", lt);

    var gth = db.select("users", {age:">30"});
    console.log("> 30 :", gth);

    var lth = db.select("users", {age:"<30"});
    console.log("< 30 :", lth);



}