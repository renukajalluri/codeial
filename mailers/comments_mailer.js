const nodemailer = require('../config/nodemailer');

// we getting comment data from comment_email_worker.js
exports.newComment = (comment)=>{
    // we are sending data and relative path to nodemailer.js renderTemplate
     let htmlString = nodemailer.renderTemplate({comment:comment},"/comments/new_comment.ejs")

     nodemailer.transporter.sendMail({
         from: 'renukajalluri20@gmail.com',
         to:comment.user.email,
         subject:"New comment Published",
         html:htmlString,

     },(err,info)=>{
         if(err){
             console.log("error in sending mail",err);
             return;
         }
        //  console.log("Message sent",info);
         return
     })
}
