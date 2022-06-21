// this is server side socket connection

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors:{origin:"*"}
    });
    

    io.sockets.on('connection',function(socket){
        console.log("new connection recieved",socket.id)
    })
 
}

// user emmit a connect event to server recieves a connection and server emmits back you are connected using connect event
// this all done automatically