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
        socketManager.send_message(io, socket, data)
    });

    socket.on('initialize_game', (data) => {
        socketManager.initializeGame(io, socket, data)
    })

    socket.on('rotate_ship', (data) => {
        socketManager.rotateShip(io, socket, data);
    });
    
    socket.on('place_ship', (data) => {
        socketManager.placeShip(io, socket, data);
    });

    socket.on('place_missile', (data) => {
        socketManager.placeMissile(io, socket, data)
    });

    socket.on('initialize_main_game', (data) => {
        socketManager.initializeMainGame(io, socket, data);
    })


});

server.listen(3000, () => {
    console.log('listening on port *:3000');
})

