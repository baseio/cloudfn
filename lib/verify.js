var verify = function( code, cb ){
    let clientCode = null;

    if( code.trim().slice(0, 6) !== 'return' ){
        code = 'return '+ code.trim();
    }

    try {
        let factory = new Function('require', code);
        clientCode = factory(require);
        
        if (typeof clientCode !== 'function') {
            let msg = 'The code does not return a JavaScript function.';
            //console.log('ERROR ', 400, msg);
            cb(msg, null);
        }
        if (clientCode.length === 0 || clientCode.length > 2) {
            let msg = 'The JavaScript function must have the following signature: (ctx, callback)';
            //console.log('ERROR ', 500, msg);
            cb(msg, null);
        }
    } catch (e) {
        let msg = 'Unable to compile submitted JavaScript. ' + e.toString();
        //console.log('ERROR ', 600, msg);
        cb(msg, null);
    }

    if( cb ){
        cb( null, clientCode);
    }else{

        clientCode({who:'Jorgen'}, (err, result) => {
            console.log(err, result)
        });

    }
}
module.exports = verify;

//verify( '  return function(ctx, cb) { cb(null, {message: "1 Hello " + ctx.who}); }' );
//verify( ' function(ctx, cb, test) { cb(null, {message: "2 Hello " + ctx.who}); }' );
