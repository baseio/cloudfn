return (api) => {
    arguments = api.clean.call(this);
    // sandbox end
    //(api) => {

    console.dir(this, {colors:true});
    console.dir(arguments, {colors:true});
    console.dir(api, {colors:true});

    //var fs = require('fs');
    //console.log("/etc/hosts:", fs.readFileSync('/etc/hosts').toString() );

    api.send({ok:true});

}