import React from "react";
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'

let prev = {"x": null, "y": null};

function Game(props){
    
    const [board, setBoard] = useState(); 
    const [shipsOffsets, setShipsOffsets] = useState([]);
    const [shipsPlaced, setShipPlaced] = useState(new Set());
    const [currentShip, setCurrentShip] = useState();
    const [shadowBoard, setShadowBoard] = useState();
    const boardRef = useRef(null);
    
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
        // setup shadowBoard
    }, []);

    useEffect(() => {
        console.log(boardRef)
        console.log(board)
        const eventListener = (event) => {
            const rect = boardRef.current?.getBoundingClientRect();
            const tile = event.target
            const x = +tile.dataset.x
            const y = +tile.dataset.y
            if (prev.x !== x || prev.y !== y){
                // update shadowArray
                prev.x = x;
                prev.y = y;
                console.log(x,y);
            }
        }

        boardRef.current?.addEventListener('mousemove', eventListener)

        return () => {
            boardRef.current?.removeEventListener('mousemove', eventListener);
        };
    }, [boardRef.current])
    
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
    


    return(
        <div>
            <p>THIS IS THE GAME: {props.roomNumber}</p>
            <button onClick={rotateShip}>ROTATE 1</button>
            <button onClick={placeShip}>place ship</button>
            <div className="board">

            <div className="playerBoard" ref={boardRef}>
                {board?.map((row, rowId) => {
                    return(
                        <div key={rowId}>
                        {row.map((value, columnId) => {
                            {switch(value){
                                case 0: 
                                    return <div className="tileWater" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 1:
                                    return <div className="tileShip" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 3:    
                                    return <div className="tileMiss" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 4:    
                                    return <div className="tileHit" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 5:    
                                    return <div className="tileSunk" key={columnId} data-x={columnId} data-y={rowId}></div>
                                }}
                            })}
                        </div>
                    )
                })}
            </div>
            <div className="shadowBoard">
                <div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                </div>
                <div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                </div>
                <div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                    <div className="tileShadow"></div>
                </div>
            </div>
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
}

export default Game