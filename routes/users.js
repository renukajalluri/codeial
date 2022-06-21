const express = require('express');
const router = express.Router();

const passport = require('passport');


const userController = require('../controllers/users_controller');



router.get('/profile/:id',passport.checkAuthentication  ,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/sign-in',userController.sigIn);
router.get('/sign-up',userController.signUp);

router.post('/create',userController.create);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(  //the req comes to create-session then passport first authenticates it(passport-local-authentication),if the authetication is done(returns to controller) ,if it is not done the it redirects to sign-in page
    'local', //the strategy is local
    //if the session is failed redirect to back
    {failureRedirect:'/users/sign-in'},
),userController.createSession);

router.get('/sign-out',userController.destroySession);

// this url goes to google signin
// /google is given by passport and identified by automatically
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
// this is the url which we will get data from url
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession)

module.exports = router;