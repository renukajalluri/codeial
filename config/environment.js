const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,"../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const developement = {
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething',
    db:'codeial_development',
    smtp:{
        service : 'gmail',
        // when you need to send mails using smtp .they have just created a domain
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth:{
            user:'renukajalluri20@gmail.com',
            pass:'Renuka@2003'
        }
    },
    google_client_id: "260499198153-lse4v46p2qhaae6c1rc1uuuphqlhh274.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url : "http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codieal',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}

const production = {
    name:"production",
    asset_path:process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service : 'gmail',
        // when you need to send mails using smtp .they have just created a domain
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth:{
            user:process.env.CODEIAL_GMAIL_USERNAME,
            pass:process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url : process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}


module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? developement : eval(process.env.CODEIAL_ENVIRONMENT)

// module.exports = developement