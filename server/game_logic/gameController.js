import { Player} from "./player.js";

export class GameController{

    constructor(player1, player2){
        this.players = new Map();
        this.opponentId = new Map();
        this.players.set(player1, new Player(player1));
        this.players.set(player2, new Player(player2));
        this.opponentId.set(player1, player2);
        this.opponentId.set(player2, player1);
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

    givePostition(playerDefence, coordinate){
        var result = playerDefence.placeMissile(coordinate);
        return result;
    }

    giveResult(playerAttack, coordinate){
        playerAttack.updateHitTracker(coordinate);
    }

    getPossition(playerAttack){
        
    }

    getPlayerGameStates(playerId){
        var player = this.players.get(playerId);
        var board = player.getBoard();
        var shipsOffsets = player.getShipsOffsets();
        var hitTracker = player.getHitTracker();
        var data = {"board": board, "hitTracker": hitTracker, "shipsOffsets": shipsOffsets};
        return data;
    }
}