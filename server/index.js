import RoomManager from './roomManager.js';
import express from 'express'
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
import cors from 'cors';

app.use(cors());

const roomManager = new RoomManager()

const io = new Server(server, {
    cors: {
        origin : ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods : ["POST", "GET"],
    },
});

io.on('connection', (socket) => {
    
    socket.on('create_room', (_data) => {
        var roomNumber = roomManager.generateNewRoom();
        roomManager.addRoom(roomNumber);
        roomManager.addSocketToRoom(roomNumber, socket.id);
        socket.join(roomNumber);
        socket.emit('assign_room', roomNumber);
    })

    socket.on('join_room', (data) => {
        var room = data.newRoomNumber;
        if (io.sockets.adapter.rooms.get(room) !== undefined) {
            if (io.sockets.adapter.rooms.get(room).size < 2) {
                socket.join(room);
                socket.emit('update_room', data);
            } else {
                console.log("Error: room is full (already 2 in room)");
            }
        } else {
            console.log("Error: room does not exist");
        }
    })

    socket.on('send_message', (data) => {
        var room = data.roomNumber;
        const clients = io.sockets.adapter.rooms.get(room);
        if (clients.has(socket.id)){
            socket.to(data.roomNumber).emit('recive_message', data);
        } else {
            console.log("Error: client is not part of the room");
        }
    })
});

server.listen(3000, () => {
    console.log('listening on port *:3000');
})

