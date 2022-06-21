const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
// set up the path
const AVATAR_PATH = path.join('/uploads/users/avatars')

const userScheema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    friendships:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Friendship'
    }

},{
    timestamps:true
});

let storage = multer.diskStorage({
    // giving destination to where the file has to store
    destination: function (req, file, cb) {
        // .. -> going out of the models 
      cb(null, path.join(__dirname,'..',AVATAR_PATH))
    },
    // giving name for the file ,because if two users upload two pictures with same name
    // then the picture can overide one another
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //   fieldname is avatar
    // every that user upload will named as avatar-date
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

//   static methods                      
                                                        //   only one file is uploaded
// multer uses this disk storage for storing the uploaded file
userScheema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
// whenever i want to access from the controller where is the file going to be saved, so the we are putting path globally
userScheema.statics.avatarPath = AVATAR_PATH;
// console.log( userScheema.statics)
const User = mongoose.model('User',userScheema);

module.exports = User;