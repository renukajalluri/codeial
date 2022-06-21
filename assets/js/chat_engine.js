// this is frontend side socket connection
class ChatEngine{
    constructor(chatBoxId,userEmail){
     
        this.chatBox = $(`#${chatBoxId}`)
        this.userEmail = userEmail

        const socket = io("http://localhost:8000")
        let self = this;
        socket.on('connect',function(){
            console.log("connection established")

            socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'codeial'
            })
            socket.on('user_joined',function(data){
                console.log("user joined",data)
            })
        })

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            console.log(msg)
            if(msg != ''){
                socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatroom:'codeial'
                })

            }
        })

        socket.on('recieve_message',function(data){
                console.log('message received',data.message);

                let newMessage = $('<li>');
                let messageType = 'other-message'
                console.log("my email",data.user_email)
                if(data.user_email == self.userEmail){
                    messageType = 'self-message'
                }
                newMessage.append($('<span>',{
                    'html':data.message
                }))

                newMessage.append($('<sub>',{
                    'html': data.user_email
                }))

                newMessage.addClass(messageType)

                $('#chat-messages-list').append(newMessage)
        })

        
     
    }

    
}