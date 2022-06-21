module.exports.setFlash = (req,res,next)=>{
    //    findout the flash from the req and set it up in res.locals.so we can access in views
    // fetches everything from req.flash puts it into locals and used in app.js
    res.locals.flash ={
        'success':req.flash('success'),
        'error' : req.flash('error')
    }
    next();
}