
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

    generateNewRoomId(){
        var roomId = this.generateRandomRoomId();
        while (this.rooms.has(roomId)){
            roomId = this.generateRandomRoomId();
        }
        return roomId;
    }

    generateRandomRoomId(){
        var idLenth = 6;
        var roomId = "";
        var validCharacter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var validCharacterLength = validCharacter.length;
        for (var i = 0; i < idLenth; i++){
            roomId += validCharacter.charAt(Math.floor(Math.random() * validCharacterLength));
        }
        return roomId;
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