import { Player} from "./player.js";

export class GameController{

    constructor(player1, player2){
        this.players = new Map();
        this.opponentId = new Map();
        this.players.set(player1, new Player(player1));
        this.players.set(player2, new Player(player2));
        this.opponentId.set(player1, player2);
        this.opponentId.set(player2, player1);
        this.playerTurn = player1;
    }

    rotateShip(playerId, shipNumber){
        var player = this.players.get(playerId);
        var newOffsets = player.rotateShip(shipNumber);
        return newOffsets;
    }

    placeShip(playerId, coordinate, shipNumber){
        var player = this.players.get(playerId);
        var newBoard = player.placeShip(coordinate, shipNumber);
        return newBoard
    }

    allShipsPlaced(playerId, opponentId){
        var player1 = this.players.get(playerId);
        var player2 = this.players.get(opponentId);
        if (player1.allShipsPlaced() && player2.allShipsPlaced()){
            return true;
        }
        return false;
    }

    placeMissile(playerId, coordinate){
        var player = this.players.get(playerId);
        var opponentId = this.opponentId.get(playerId);
        var opponent = this.players.get(opponentId);
        // place missile on opponent and give back result (uppdate board of opponent)
        // update the hitTracker off the player
        // update player turn internaly
        // maker object to return with opponent board hit tracker and turn = true/false
    }

    getPlayerGameStates(playerId){
        var player = this.players.get(playerId);
        var board = player.getBoard();
        var shipsOffsets = player.getShipsOffsets();
        var hitTracker = player.getHitTracker();
        var data = {"board": board, "hitTracker": hitTracker, "shipsOffsets": shipsOffsets};
        return data;
    }
    
    getPlayerMainGameStates(playerId){
        var player = this.players.get(playerId);
        var board = player.getBoard();
        var hitTracker = player.getHitTracker();
        var myTurn = this.playerTurn === playerId;
        var data = {"myTurn" : myTurn, "board": board, "hitTracker": hitTracker};
        console.log(data);
        return data;
    }
}