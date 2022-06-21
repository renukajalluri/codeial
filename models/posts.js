const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    //connecting posts to user by id 
    user:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'User'
          
    },
    // include the array of ids of all comments in this post schema itself
    //by including ids of comments , it makes fast to search and load 
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
    } 
    ],
    

},{
    timestamps:true
});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;
