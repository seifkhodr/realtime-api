import { log } from 'console';
import { Server } from 'socket.io';


const initSocket = (httpServer)=>{
    const io = new Server(httpServer);

    io.on('connection' , (socket)=>{
        log('a user connected');

        socket.on('disconnect' , ()=>{
            log('user disconnected')
        });

        // handle chat messages
        socket.on('chat_message' , (payload)=>{
            log(`message : ${payload.text} at: ${payload.date}`);
            
            io.emit('chat_message' ,payload );
        });

        // create room when use click to the friend to start a conversation
        socket.on('create_room' , (payload)=>{
            log(`room created with id: ${payload.conversationId}`);
            socket.join(payload.conversationId);
        });

        //send message to the room
        socket.on('send_message' , (payload)=>{
            log(`message sent to room ${payload.conversationId} : ${payload.text} at: ${payload.date}`);
            io.to(payload.conversationId).emit('receive_message' , payload);
        });
    });
}

export default initSocket;