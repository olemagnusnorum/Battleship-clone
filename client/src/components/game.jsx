import React from "react";
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import '../css/tile.css'
import '..//css/playerBoard.css'

function Game(props){
    
    const [board, setBoard] = useState(); 
    const [shipsOffsets, setShipsOffsets] = useState([]);
    const [shipsPlaced, setShipPlaced] = useState(new Set());
    const boards = [[0,0,0],[0,0,0],[0,0,0]]
    
    const rotateShip = () =>{
        console.log("sendt rotate");
        props.socket.emit('rotate_ship', {"shipNumber": 0});
    }

    const placeShip = () => {
        console.log("sendt place");
        props.socket.emit('place_ship', {"x": 5, "y": 5, "shipNumber": 0})
    }

    useEffect(() => {
        props.socket.emit('initialize_game');
        console.log("INIT");
    }, []);
    
    useEffect(() => {
        props.socket.on('initial_game_state', (data) => {
            console.log(data)
            setBoard(data.board);
            console.log(data.shipsOffsets)
            setShipsOffsets(data.shipsOffsets)
        });

        props.socket.on('ship_rotated', (data) => {
            console.log(data.newOffset)
            console.log(data.shipNumber)
            console.log("aAAA")
            shipsOffsets[data.shipNumber] = data.newOffset
        });

        props.socket.on('ship_placed', (data) => {
            if (Object.keys.length !== 0){

                console.log(data);
                shipsPlaced.add(data.shipNumber)
                var shipOffsets = shipsOffsets[data.shipNumber]
                for (var i = 0; i < shipOffsets.length; i++){
                    var x = shipOffsets[i].x + data.x;
                    var y = shipOffsets[i].y + data.y;
                    board[y][x] = 1;
                }
            }
        })

        return () => {
            props.socket.off("initial_game_state");
            props.socket.off("ship_rotated");
            props.socket.off("ship_placed");
        };

        
    }, [props.socket, shipsOffsets, board]);
    

    const print = () =>{
        console.log(board);
        console.log(shipsOffsets)
    }

    if (board !== undefined) {
        return(
            <div>
                <p>THIS IS THE GAME: {props.roomNumber}</p>
                <button onClick={rotateShip}>ROTATE 1</button>
                <button onClick={print}>board</button>
                <button onClick={placeShip}>place ship</button>
                <div className="playerBoard">
                    {board.map((row, rowId) => {
                        return(
                            <div key={rowId}>
                            {row.map(value => {
                                    {switch(value){
                                        case 0: 
                                            return <div className="tileWater"></div>
                                            case 1:
                                                return <div className="tileShip"></div>
                                            case 3:    
                                                return <div className="tileMiss"></div>
                                            case 4:    
                                                return <div className="tileHit"></div>
                                            case 5:    
                                                return <div className="tileSunk"></div>
                                    }}
                                    <div className="tile"></div>
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    } else {
        return(
            <p>LOADING</p>
        );
    }
    
}

export default Game