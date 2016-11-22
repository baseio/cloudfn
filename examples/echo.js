(context, req, res, next) => {
    console.log('echo received', req.body);
    res.json({echo: req.body});
}