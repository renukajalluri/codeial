const passport  = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//passport is using the local strategy to find the user who signed in
//passport has to use this local strategy
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    // this allows us to set first argument as req( in below)
    passReqToCallback:true
   },
   // done is callback function that is reporting to the passport.js
     function(req,email,password,done){
        // find a user and establish the identity
        //passport finding the user who signed in
        User.findOne({email:email},(err,user)=>{
            if(err){
                req.flash('error',err);
                // console.log("err in finding user --> passport");
                return done(err);
            }
          //if users password doesn't match the entered password
            if(!user || user.password != password){
                    req.flash('error','Invalid Username/Password');
                // console.log("Invalid Username/Passsword");
                return done(null,false);  // false -> authentication is not done
            }

            //if user is found
            return done(null,user);
        })
     }
));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if(err){
            console.log("err in finding user --> passport");
            return done(err);
        }
        //if user is found
        return done(null,user);
    });
});

//sending data of signed in user to views
//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in, then pass on request to the next function(controllers action) 
    if(req.isAuthenticated()){
       return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

// set the user for views
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user and we are just sending this to locals for the views
        res.locals.user = req.user
        // console.log(res.locals.user)
    }
    next();
}


module.exports = passport;


