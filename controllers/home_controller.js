const Post = require('../models/posts');
const User = require('../models/user');
const Like = require("../models/like")

// first telling to server that this function is async
module.exports.home = async function(req,res){

    // if there is an first await or second await then it goes to catch
    try{
        let posts = await Post.find({}) // first await and execute this 
       // first created post will be at top. -createdAt=> this like stored in db
        .sort('-createdAt')
        //populate the user of each posts
        .populate('user')
        //need to get comment and user of that comment
        .populate({
            path:'comments',
            populate:{
                path:'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('likes');
         // for displaying all the users for that finding all the users and sending to home.ejs to display all the users
        let user= await  User.find({});  //after executing first then  second await for this and execute
        return res.render("home",{ //after first and second are executed  then return this to browser
         title :"Codeial | Home",
         posts :posts,
         all_users:user
     });
    }catch(err){
           console.log('Error',err);
           return;
    }


   
 
   
      
    
        
    
 
}