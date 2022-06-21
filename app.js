const express = require('express');
const env = require('./config/environment')
const  logger = require('morgan');

const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app)
const port = 8000;
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const DB = `mongodb+srv://Signup:123@cluster0.nnrbm.mongodb.net/${env.db}?retryWrites=true&w=majority`


mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('connection successful')
}).catch((err)=>{console.log('no connection')})


//used for session cookie
const session = require('express-session');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy')
const passportGoogle = require('./config/passport-google-oauth2-strategy')

const MongoStore = require("connect-mongo");
const sassMiddleware = require('node-sass-middleware');
// connect flash is used for to store the flash message in session
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(express.static(env.asset_path));


const server= require('http').createServer(app);
const io = require('socket.io')(server,{cors:{origin:"*"}})

io.on('connection',(socket)=>{
    console.log("User connected:",socket.id)
    
    socket.on('disconnect',()=>{
        console.log("socket disconnected")
    })

    // on recieves the data from client side
    socket.on('join_room',function(data){
        console.log('joining request rec',data);
        // if there is a room it joins or it will create
        socket.join(data.chatroom);
            
        io.in(data.chatroom).emit('user_joined',data);
    })
    socket.on("send_message",function(data){
        io.in(data.chatroom).emit('recieve_message',data)
    })
})


if(env.name == 'development'){
//this middleware should be before the server starting because scss files should be pre-compiled 
app.use(sassMiddleware({
    //the path to scss files to convert into css 
    src:path.join(__dirname,env.asset_path,'scss'),
    //the path to css files
    //destination
    dest:path.join(__dirname,env.asset_path,'css'),
    debug:true,
    // put the code into understandle 
    outputStyle:'extended',
    //where should server lookout for css files
    prefix:'/css'
}))
}



app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use(cookieParser());



// making the uploads path available to the browser
// CODEIAL/uploads will be available in /uploads
app.use('/uploads',express.static(__dirname + '/uploads'))

app.use(expressLayouts);

app.use(logger(env.morgan.mode,env.morgan.options))


//extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//set up the view engine
app.set('view engine','ejs');
app.set('views',"./views");

// middleware which takes the key and stores in the cookie and encrypts it
app.use(session({
    //name of cookie
    name:'CODEIAL',
    //when encryption happens there is a key to encode and decode it
    secret:env.session_cookie_key,
    //when the id sents request which is not established, in that case don't store extra cookies
    saveUninitialized:false,
    // do not save the id again and again.
    resave:false,
    // how long the cookie should be handled after that cookie expires
    cookie:{
        maxAge:(1000*60*100)
    },
     //mongo store is used to store the session cookie in the db
    store: MongoStore.create({
        // mongooseConnection:db,
        mongoUrl:'mongodb+srv://Signup:123@cluster0.nnrbm.mongodb.net/codeial?retryWrites=true&w=majority',
        autoRemove:'disabled'
    },(err)=>{
        console.log(err || 'connect-mongodb setup')
    })
    
}));

// need to tell app to use passport
app.use(passport.initialize());
app.use(passport.session());

//when this middleware is called it will check the function and user will be sent in the locals
app.use(passport.setAuthenticatedUser);

// we need to put after the session be used.becoz flash uses session cookies.
// the flash will be set up in the cookies which stores the session information
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));



server.listen(port,(err)=>{
    if(err){
        console.log(`Error in running the server:${err}`);
    }else{
        console.log(`Server is listening on port: ${port}`);
    }
})

