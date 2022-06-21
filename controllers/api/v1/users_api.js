const user = require('../../../models/user')
const jwt = require('jsonwebtoken')
const User = require('../../../models/user')
const env = require("../../../config/environment")

module.exports.createSession= async function(req,res){
   
   try{
  let user = await User.findOne({email:req.body.email})
    if(!user || user.password != req.body.password){
        return res.status(400).send("Email or Password is wrong")
    }

        return res.json(200,{
            message:"Sign in successfull",
            data:{
              token: jwt.sign({_id:user._id},env.jwt_secret,{expiresIn:10000})
            }
        })
    
   }catch(err){
       console.log(err);
       return res.status(500).send("Internal server error")
   }
  
   

       //  create and assign a token
    //    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET) 
    //       res.header('auth-token',token).send(token)

}