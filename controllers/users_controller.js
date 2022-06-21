const User = require('../models/user');
const fs = require("fs");
const path = require('path');
const { use } = require('passport');

module.exports.profile = function(req,res){
    User.findById(req.params.id,(err,user)=>{
        return res.render("users",{
            title : "Profile",
            profile_user:user
        })
    })
    
}
module.exports.update = async (req,res)=>{
    // current user == the user who want to update
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            // we can't access body in the form directly by req.params becoz of multipart.for accessing we want multer
            // console.log("params:" ,req.params.id)
            User.uploadedAvatar(req,res,(err)=>{
                if(err){
                    console.log('Multer err',err);
                }else{
                    user.name = req.body.name,
                    user.email = req.body.email
                   
                    if(req.file){
                        fs.appendFile(path.join(__dirname, '..',user.avatar),'world',(err)=>{
                            if(err){
                                console.log(err)
                            }else{
                                console.log("success")
                            }
                        })
                // if the user has already an avatar then remove the old one and replace it with new one
                    // if(user.avatar){
                    //     fs.unlinkSync(path.join(__dirname, '..',user.avatar))
                    // }
                        // this is saving the path of the uploaded file into the avatar field in the user.js
                        user.avatar = User.avatarPath + '/' + req.file.filename
                    }
                    
                    user.save();
                    return res.redirect('back')
                    // console.log(req.file);
                }

            })

        }catch(err){
           req.flash('error',err);
           return res.redirect('back') 
        }

    }else{
        req.flash('error','Unauthorized!');
        return res.status(401).send('Unauthorized')
    }
}
//render sign up page
module.exports.signUp = function(req,res){
    // if the user is signed up then did not show sign up page and redirect to the profile page
    if(req.isAuthenticated()){
     return res.redirect('/users/profile');
    }

   return res.render('user_signup',{
       title:"Sign Up"
   })
}

//render sign in page
module.exports.sigIn = function(req,res){
 
    //if the user is signed in then do not show the sign in page and redirect to the profile page 
    if(req.isAuthenticated()){
     return res.redirect('/users/profile');
    }
    return res.render('user_signin',{
        title:"CODIEAL"
    })
}


//get sign up data
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password ){
        return res.redirect('/users/sign-up');
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){ 
            console.log("error in finding user in signing up"); 
             return
             }
              // if email is not unique then create the (data)  in db
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log("error in creating user while signing up");  return
                }
                  // user created and sending to sign in page
                    return res.redirect('/users/sign-in');
                
            })
            //email is unique then sign up again
        }else{
            return res.redirect('/users/sign-up');
        }
    });
  

    }

//sign in and create a session for the user
module.exports.createSession=function(req,res,next){
    // first argument in flash is type of flash message

    req.flash('success','Logged In successfully');
    
         return res.redirect('/');
  
}

module.exports.destroySession =(req,res)=>{
    // console.log(req.logout);
    req.logout();
    // these messages should be visible in ui. so the flash message have to transferred to response.
    // so for that we are using middlewares (in config)
    // console.log(req.flash)
    req.flash('success','You have logged out!')
    return res.redirect('/');
}