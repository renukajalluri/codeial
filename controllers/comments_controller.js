const { findById, populate } = require('../models/comments');
const Comment = require('../models/comments');
const Post = require('../models/posts')
const commentsMailer = require("../mailers/comments_mailer")
const commentEmailWorker = require("../workers/comment_email_worker")
const queue = require("../config/kue")
const Like = require("../models/like")


module.exports.create =async function(req,res){
    try{
        // finding the post by id and stroing in post 
        let post = await Post.findById(req.body.post);
        // if post is existed then create a comment
        if(post){
         let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
              //adding comment to post
              // addding the comments id into posts list of comments
                post.comments.push(comment);
                post.save();
            
                comment = await comment.populate('user');
                // whenever new comment is made then we need to call mailer
            //   commentsMailer.newComment(comment)
            // here we creating a job inside a queue
                let job = queue.create('emails',comment).save(function(err){
                    if(err){
                        console.log("error in creating a queue",err)
                        return
                    }
                    console.log("job queued",job.id)
                });
              
                res.redirect('/');
          }

    }catch(err){
        console.log('Error',err);
    }
   
};

module.exports.destroy =async (req,res)=>{
    try{
        let comment =await Comment.findById(req.params.id);
        // the user who deleting the comment == the user who written the comment
        if(comment.user == req.user.id){
            // saving the post_id which is present in comment model and then deleting the comment
          let  postId = comment.post;
            comment.remove();
            // first finding the postId and then finding and pulling the commentId which is present inside the post model   
            //$pull: pulling out the list of comments 
            // req.params.id -> is the id of comment which i have to pull out from comments
            // pulling out the comment id which was deleted
                   let post =  Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
                   return res.redirect('back');
              }
        //  the user who deleting the comment != the user who written the comment
        else{
            return res.redirect('/');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
    
    

}