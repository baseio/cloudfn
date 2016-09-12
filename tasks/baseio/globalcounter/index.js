return (ctx, cb) => {
    ctx.counter ++;
    console.log('ctx.counter', ctx.counter );
    cb(null, {counter: ctx.counter });
}