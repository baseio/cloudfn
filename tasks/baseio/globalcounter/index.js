return (context, req, res, next) => {
    context.store.counter = context.store.counter || 0;
    context.store.counter++;
    console.log('context.store.counter', context.store.counter );
    res.json({counter: context.store.counter});
    next();
}