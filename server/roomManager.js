
class RoomManager {

    constructor(){
        this.rooms = new Map()
    }

    addRoom(room){
        this.rooms.set(room, new Set())
    }
    
    removeRoom(room){
        this.rooms.delete(room);
    }

    generateNewRoom(){
        var roomNumber = Math.floor(Math.random() * 1000000) + 1;
        while (this.rooms.has(roomNumber)){
            roomNumber = Math.floor(Math.random() * 1000000) + 1;
        }
        return roomNumber.toString();
    }

    addSocketToRoom(room, socketId){
        if (!this.rooms.has(room)){
            this.addRoom(room);
        }
        room = this.rooms.get(room);
        if (room.size < 2){
            room.add(socketId);
        }
        else{
            console.log("Room already full!")
        }
    }

}
export default RoomManager