export class Board {

    constructor(){
        this.WATER = 0
        this.SHIP = 1
        this.MISS = 3
        this.HIT = 4
        this.HOLE_SHIP_SUNK = 5
        this.board = this.initBoard();
        this.shipDict = new Map()
        this.shipCoordinates = new Map()
    }

    printBoard(){
        for (var i = 0; i < this.board.length; i++){
            console.log(this.board[i]);
        }
    }

    placeShip(coordinate, ship){
        var coordinate_x = coordinate.x;
        var coordinate_y = coordinate.y;
        var placement = [];
        for (var i = 0; i < ship.offsets.length; i++){
            var placement_x = ship.offsets[i].x + coordinate_x;
            var placement_y = ship.offsets[i].y + coordinate_y;
            placement.push({"x":placement_x, "y":placement_y});
        }

        if (!ship.placed && this.checkLegalShipPlacement(placement)){
            for (var i = 0; i < placement.length; i++){
                this.board[placement[i].y][placement[i].x] = this.SHIP;
            }
        } else {
            return false
        }
        
        for (var i = 0; i < placement.length; i++){
            var key = placement[i].x + "," + placement[i].y;
            this.shipDict.set(key, ship); 
        }
        this.shipCoordinates.set(ship, placement);
        ship.placed = true;
        return true
    }

    placeMissile(coordinate){
        var affectedCoordinates = new Map();
        var x = coordinate.x;
        var y = coordinate.y;
        if (this.board[y][x] > 1){
            return affectedCoordinates;
        }
        this.board[y][x] += 3;
        var key = x + "," + y;
        if (this.shipDict.has(key)){
            this.shipDict.get(key).damageShip();
            if (this.shipDict.get(key).isSunk()){
                return this.sinkShip(this.shipDict.get(key));
            }
        }
        affectedCoordinates.set(key, this.board[y][x]);
        return affectedCoordinates;
    }

    sinkShip(ship){
        var affectedCoordinates = new Map();
        var coordinates = this.shipCoordinates.get(ship);
        for (var i = 0; i < coordinates.length; i++){
            var x = coordinates[i].x;
            var y = coordinates[i].y;
            this.board[y][x] = this.HOLE_SHIP_SUNK;
            var key = x + "," + y;
            affectedCoordinates.set(key, this.HOLE_SHIP_SUNK);
        }
        return affectedCoordinates;
    }

    checkLegalShipPlacement(placement){
        for (var i = 0; i < placement.length; i++){
            var x = placement[i].x;
            var y = placement[i].y;
            if (x < 0 || y < 0){
                console.log("SHIP out of bound");
                return false
            }
            if (this.board[y][x] !== this.WATER){
                console.log("Ship collition with other ship");
                return false
            }
        }
        return true
    }

    checkGameOver(){
        for (var y = 0; y < this.board.length; y++){
            for (var x = 0; x < this.board[y].length; x++){
                if (this.board[y][x] === this.SHIP){
                    return false
                }
            }
        }
        return true
    }

    initBoard(){
        var board = []
        for (var i = 0; i < 10; i++){
            var row = []
            for (var j = 0; j < 10; j++){
                row.push(0)
            }
            board.push(row)
        }
        return board
    }


}
