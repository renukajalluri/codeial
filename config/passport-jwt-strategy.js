const passport = require('passport');
const JWTStrategy  = require('passport-jwt').Strategy
// which will help in extract json web token from header
const ExtractJWT = require("passport-jwt").ExtractJwt
const env = require('./environment')
const User = require('../models/user');

let opts = {
    // header is a list of keys.So header has a key called authorization. that is also list of keys
    // so that can key called bearer.That bearer jwt token
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:env.jwt_secret,

}

// authenticate user for other requests
// this is used after jwt was generated to authenticate the jwt
// user is also present in the jwt ,we are fetching out the from payload and checking user is there or not

passport.use(new JWTStrategy(opts,(jwtPayload,done)=>{
      User.findById(jwtPayload._id,(err,user)=>{
        if(err){
            console.log("error in finding user from jwt",error );
            return
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false)
        }
      })
}))
module.exports = passport