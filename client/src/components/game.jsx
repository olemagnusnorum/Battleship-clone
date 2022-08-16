import React from "react";
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'

function Game(props){
    
    const [board, setBoard] = useState(); 
    const [shipsOffsets, setShipsOffsets] = useState([]);
    const [shipsPlaced, setShipPlaced] = useState(new Set());
    const [currentShip, setCurrentShip] = useState();
    
    const rotateShip = () =>{
        console.log("sendt rotate");
        props.socket.emit('rotate_ship', {"shipNumber": 0});
    }

    const placeShip = () => {
        props.socket.emit('place_ship', {"x": 5, "y": 5, "shipNumber": 0})
    }

    const  handleSetCurrentShip = (shipId) =>{
        if (!shipsPlaced.has(shipId)){
            console.log("HANDLNIG");
            console.log(shipId)
            setCurrentShip(shipId);
        } else {
            console.log("already placed")
        }
    }

    useEffect(() => {
        props.socket.emit('initialize_game');
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
            shipsOffsets[data.shipNumber] = data.newOffset
        });

        props.socket.on('ship_placed', (data) => {
            if (Object.keys(data).length !== 0){

                console.log(data);
                shipsPlaced.add(data.shipNumber)
                var shipOffsets = shipsOffsets[data.shipNumber]
                for (var i = 0; i < shipOffsets.length; i++){
                    setBoard(data.board);
                }
            } else {
                console.log("not valid placement")
            }
        })

        return () => {
            props.socket.off("initial_game_state");
            props.socket.off("ship_rotated");
            props.socket.off("ship_placed");
        };

        
    }, [props.socket, shipsOffsets, board]);
    

    if (board !== undefined) {
        return(
            <div>
                <p>THIS IS THE GAME: {props.roomNumber}</p>
                <button onClick={rotateShip}>ROTATE 1</button>
                <button onClick={placeShip}>place ship</button>
                <div className="playerBoard">
                    {board.map((row, rowId) => {
                        return(
                            <div key={rowId}>
                            {row.map((value, columnId) => {
                                    {switch(value){
                                        case 0: 
                                            return <div className="tileWater" key={columnId}></div>
                                            case 1:
                                                return <div className="tileShip" key={columnId}></div>
                                            case 3:    
                                                return <div className="tileMiss" key={columnId}></div>
                                            case 4:    
                                                return <div className="tileHit" key={columnId}></div>
                                            case 5:    
                                                return <div className="tileSunk" key={columnId}></div>
                                    }}
                                    <div className="tile"></div>
                                })}
                            </div>
                        )
                    })}
                </div>
                <div className="boatContainer">
                    {shipsOffsets.map((shipOffset, shipOffsetId) => {
                        return(
                            <button onClick={() => handleSetCurrentShip(shipOffsetId)}>{shipOffsetId}</button>
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