import SocketManager from './socketManager.js';
import express from 'express'
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
import cors from 'cors';

app.use(cors());

const socketManager = new SocketManager()

const io = new Server(server, {
    cors: {
        origin : ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods : ["POST", "GET"],
    },
});

io.on('connection', (socket) => {
    
    socket.on('create_room', (_data) => {
        socketManager.create_room(socket)
    });

    socket.on('join_room', (data) => {
        socketManager.join_room(io, socket, data)
    });

    socket.on('send_message', (data) => {
        socketManager.send_message(io, data, socket)
    });
});

server.listen(3000, () => {
    console.log('listening on port *:3000');
})

