const nodemailer = require('nodemailer');
const ejs = require('ejs')
const path = require('path');
const env = require("../config/environment")
var smtpTransport = require('nodemailer-smtp-transport');

// this is the path how's the communication going to take place
let transporter = nodemailer.createTransport(smtpTransport(env.smtp));

// defining that we will be using ejs
let renderTemplate = (data,relativePath)=>{
     let mailHTML;
     ejs.renderFile(
         path.join(__dirname,'../views/mailers',relativePath),
        //  getting data from comments_mailer.js
        //  data in ejs file
         data,
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            mailHTML = template
        }
      
     )
     return mailHTML;
}

module.exports = {
    transporter:transporter,
    renderTemplate:renderTemplate
}