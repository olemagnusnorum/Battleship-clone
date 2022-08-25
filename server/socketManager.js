import RoomManager from "./roomManager.js"
import { GameController } from "./game_logic/gameController.js";


class SocketManager {

    constructor(){
        this.roomManager = new RoomManager();
        this.games = new Map(); // <roomId, GameController>
    }


    create_room(socket){
        var room = this.roomManager.generateNewRoomId();
        this.roomManager.addRoom(room);
        this.roomManager.addSocketToRoom(room, socket.id);
        socket.join(room);
        this.roomManager.addSocket(socket.id, room)
        socket.emit('assign_room', room);
    }

    join_room(io, socket, data){
        var room = data.newRoomNumber;
        if (io.sockets.adapter.rooms.get(room) !== undefined) {
            if (!io.sockets.adapter.rooms.get(room).has(socket.id)){
                if (io.sockets.adapter.rooms.get(room).size < 2) {
                    var clientRooms = socket.rooms
                    clientRooms.forEach(clientRoom => {
                        if (clientRoom != socket.id){
                            socket.leave(clientRoom)
                        }
                    })
                    socket.join(room);
                    socket.emit('update_room', data);
                    io.in(room).emit('start_game');
                    var opponent = null;
                    io.sockets.adapter.rooms.get(room).forEach(client =>{
                        if (client !== socket.id){
                            opponent = client;
                        }
                    })
                    this.roomManager.addSocket(socket.id, room);
                    this.games.set(room, new GameController(opponent, socket.id))
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

    initializeGame(io, socket, data){
        var room = this.roomManager.getRoom(socket.id);
        var gameController = this.games.get(room);
        var data = gameController.getPlayerGameStates(socket.id);
        socket.emit('initial_game_state', data);
    }
    
    initializeMainGame(io, socket, data){
        var room = this.roomManager.getRoom(socket.id);
        var gameController = this.games.get(room);
        var data = gameController.getPlayerMainGameStates(socket.id);
        socket.emit('initial_main_game_state', data);
    }

    rotateShip(io, socket, data){
        var shipNumber = data.shipNumber;
        var room = this.roomManager.getRoom(socket.id);
        var gameController = this.games.get(room);
        var newOffset = gameController.rotateShip(socket.id ,shipNumber);
        var data = {"shipNumber": shipNumber, "newOffset": newOffset}
        socket.emit('ship_rotated', data);
    }

    placeShip(io, socket, data){
        var shipNumber = data.shipNumber;
        var x = data.x;
        var y = data.y;
        var room = this.roomManager.getRoom(socket.id);
        var gameController = this.games.get(room);
        var coordinate = {x,y}
        var newBoard = gameController.placeShip(socket.id, coordinate, shipNumber);
        socket.emit('ship_placed', newBoard);
        if (gameController.allShipsPlaced(socket.id, gameController.opponentId.get(socket.id))){
            io.in(room).emit('placing_finnished');
        }

    }

    placeMissile(io, socket, data){
        var x = data.x;
        var y = data.y;
        var room = this.roomManager.getRoom(socket.id);
        var gameController = this.games.get(room);
        var coordinate = {x, y};
        var newHitTracker = gameController.placeMissile(socket.id, coordinate)
        socket.emit('missile_placed', newHitTracker);
    }


}

export default SocketManager