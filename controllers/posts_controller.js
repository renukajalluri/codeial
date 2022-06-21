const Post = require('../models/posts');
const Comment = require('../models/comments');
 const Like = require("../models/like")

module.exports.create = async function(req,res){

    try{
       let created_post =  await Post.create({   // first await and execute this
            content:req.body.content,
            user:req.user._id
         });
        //  checking that req is ajax req or not
        // type of ajax is xhrhttp req
         if(req.xhr){
            //  return data with success status code
              return res.status(200).json({
                  data:{
                    // returning the data which was created at db 
                      post:created_post
                  },
                message:'post created'
              });
         }
         
         req.flash('success','Post Published');
            return res.redirect('back');   // after executing return to back
            }
    catch(err){
        //  console.log('Error',err);
        req.flash('error',err);
        return res.redirect('back'); 
    }
     
}


module.exports.destroy = async (req,res)=>{

    try{
 // finding that id is present in db or not and storing in post
 let post =  await  Post.findById(req.params.id); 
        // the user who deleting the post == the user who written the post
        // .id means converting the object id into string
       if(post.user == req.user.id){
        //    delete the associated likes for the post and comment
           await Like.deleteMany({
               likeable:post,onModel:"Post"
           })
           await Like.deleteMany({_id:{$in:post.comments}})
           post.remove();
             // deleting many comments based on the post
     await Comment.deleteMany({post:req.params.id});
     if(req.xhr){
         return res.status(200).json({
             data:{
                 post_id:req.params.id
             },
             message:'Post deleted'
         })
     }
      req.flash('success','Post and Comments are deleted!');
               return res.redirect('back');
       }else{
             // the user who deleting the post == the user who written the post
             req.flash('errot','You cannot delete this post');
             return res.redirect('back');
       }
    }catch(err){
        // console.log('Error',err);
        req.flash('error',err);
        return res.redirect('back'); 
    }
   

   
}