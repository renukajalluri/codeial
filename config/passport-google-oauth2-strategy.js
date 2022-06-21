const passport  = require('passport');
const  googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User  = require('../models/user');
const env = require('../config/environment')
// const { profile } = require('console');

// tell  passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL : env.google_callback_url
   },
//    access token -> like jwt in header google also generates an access token
// refreshToken -> when the access token expires then you use the refresh token to get new access token
// profile -> contains users information that user selects one email and google sends to our server 
    function(accessToken,refreshToken,profile,done) {
        // finding the selected email in our db 
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("error in google strategy-passport",err)
                return
            }
            console.log("token",accessToken, refreshToken);
            console.log(profile);
            // if user found then set this user as req.user(signin that user)
            if(user){
                return done(null,user);
                //if not found then create the user and set it as req.user
            }else{
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){
                        console.log("err in creating user google strategy passport",err)
                        return
                    }

                    return done(null,user);
                })
            }
        })
} 
))

module.exports = passport