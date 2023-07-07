const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const cors = require('cors')

const whitelist = ['http://localhost:3001','http://localhost:3002']
const corsOptions = {
    origin:(origin ,callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        } else {
            callback(new Error('Not allowes by CORS'))
        }
    },
    optionSucessStatus:200
}
app.use(cors(corsOptions))

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3001",
        methods: ['GET','POST'],
    },
})

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`)
    
    socket.on('join_room',(data) =>{
        console.log('room' , data)
        socket.join(data)
    });

    socket.on('send_message', (data) =>{
        console.log('message' ,data)
        // socket.broadcast.emit('receive_message',data)
        socket.to(data.room).emit('receive_message',data)
    });

})

server.listen(3002, () =>{console.log('server is run on 3002')})