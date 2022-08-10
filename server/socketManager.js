import RoomManager from "./roomManager.js"

class SocketManager {

    constructor(){
        this.roomManager = new RoomManager()
    }


    create_room(socket){
        var roomNumber = this.roomManager.generateNewRoomId();
        this.roomManager.addRoom(roomNumber);
        this.roomManager.addSocketToRoom(roomNumber, socket.id);
        socket.join(roomNumber);
        socket.emit('assign_room', roomNumber);
    }

    join_room(io, socket, data){
        var room = data.newRoomNumber;
        if (io.sockets.adapter.rooms.get(room) !== undefined) {
            if (!io.sockets.adapter.rooms.get(room).has(socket.id)){
                if (io.sockets.adapter.rooms.get(room).size < 2) {
                    socket.join(room);
                    socket.emit('update_room', data);
                    io.in(room).emit('start_game');
                } else {
                    console.log("Error: room is full (already 2 in room)");
                }
            } else {
                console.log("Error: client already in rom")
            }
        } else {
            console.log("Error: room does not exist");
        }
    }

    send_message(io, socket, data){
        var room = data.roomNumber;
        const clients = io.sockets.adapter.rooms.get(room);
        if (clients.has(socket.id)){
            socket.to(data.roomNumber).emit('recive_message', data);
        } else {
            console.log("Error: client is not part of the room");
        }
    }

}

export default SocketManager