import { Board } from "./board.js";
import { SmallLShip } from "./ship.js";

export class Player{

    constructor(name){
        this.name = name;
        this.hitTracker = this.initHitTracker();
        this.board = new Board()
        this.ships = [new SmallLShip(), new SmallLShip(), new SmallLShip()]
    }

    placeMissile(coordinate){
        result = this.board.placeMissile(coordinate)
        return result;
    }

    updateHitTracker(coordinates){ // map of what coordinate(string) and value
        for (let coordinate of coordinates){
            var stringCoordinate = coordinate[0];
            var value = coordinate[1];
            var x = parseInt(stringCoordinate[0]);
            var y = parseInt(stringCoordinate[1]);
            this.hitTracker[y][x] = value;
        }
    }

    printHitTracker(){
        console.log(this.hitTracker);
    }

    placeShip(coordinate, shipNumber){
        console.log(coordinate)
        if (shipNumber < this.ships.length){
            var ship = this.ships[shipNumber];
            if (this.board.placeShip(coordinate, ship)){
                return {"x": coordinate.x, "y":coordinate.y, "shipNumber": shipNumber};
            } else {
                console.log("not a valid ship placement");
                return {}
            }
        } else {
            console.log("not a valid ship");
            return {}
        }
    }

    allShipsPlaced(){
        for (var i = 0; i < this.ships.length; i++){
            if (this.ships[i].placed == false){
                print("place all ships")
            }
            return false;
        }
        return true;
    }

    printShipsNotPlaced(){
        for (var i = 0; i < this.ships.length; i++){
            if (this.ships[i].placed === false){
                console.log(i)
            }
        }
        console.log()
    }

    rotateShip(shipNumber){
        var ship = this.ships[shipNumber];
        var new_offsets = ship.rotateRight(1);
        return new_offsets;
    }

    getBoard(){
        return this.board.board;
    }

    getHitTracker(){
        return this.hitTracker;
    }

    getShipsOffsets(){
        var shipsOffsets = [];
        for (var i = 0; i < this.ships.length; i++){
            shipsOffsets.push(this.ships[i].offsets);
        }
        return shipsOffsets;
    }

    initHitTracker(){
        var hitTracker = []
        for (var i = 0; i < 10; i++){
            var row = []
            for (var j = 0; j < 10; j++){
                row.push(0)
            }
            hitTracker.push(row)
        }
        return hitTracker
    }
}
