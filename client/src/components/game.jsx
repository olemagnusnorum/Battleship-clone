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

    const getEmptyBoard = () => {
        let updatedShadowBoard = [];
        for (let row = 0; row < shadowBoard.length; row++){
            let rowShadowBoard = [];
            for (let col = 0; col < shadowBoard[row].length; col++){
                rowShadowBoard.push(0);
            }
            updatedShadowBoard.push(rowShadowBoard);
        }
        return updatedShadowBoard;
    }
    
    const rotateShip = () =>{
        console.log("sendt rotate");
        props.socket.emit('rotate_ship', {"shipNumber": currentShip});
    }

    const placeShip = (x, y, shipNumber) => {
        props.socket.emit('place_ship', {"x": x, "y": y, "shipNumber": shipNumber})
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

    useEffect(() => { // add mousedown her for å håndtere å plasere en boat
        const mouseMoveListener = (event) => {
            //const rect = boardRef.current?.getBoundingClientRect();
            const tile = event.target
            const x = +tile.dataset.x
            const y = +tile.dataset.y
            if (currentShip !== undefined && !shipsPlaced.has(currentShip)){
                if (prev.x !== x || prev.y !== y){
                    // update shadowBoard
                    let updatedShadowBoard = getEmptyBoard();
                    for (let i = 0; i < shipsOffsets[currentShip].length; i++){
                        let shadowX = x + shipsOffsets[currentShip][i].x
                        let shadowY = y + shipsOffsets[currentShip][i].y
                        if (shadowY >= 0 && shadowY < updatedShadowBoard.length && shadowX >= 0 && shadowX < updatedShadowBoard.length){
                            updatedShadowBoard[shadowY][shadowX] = 1;
                        }
                    }
                    prev.x = x;
                    prev.y = y;
                    setShadowBoard(updatedShadowBoard);
                }
            }
        }

        const mouseDownListner = (event) => {
            const tile = event.target;
            const x = +tile.dataset.x
            const y = +tile.dataset.y
            placeShip(x, y, currentShip);
            //..... place ship logic thing, remember to fix shadow and stuff
        }

        boardRef.current?.addEventListener('mousemove', mouseMoveListener)
        boardRef.current?.addEventListener('click', mouseDownListner)

        return () => {
            boardRef.current?.removeEventListener('mousemove', mouseMoveListener);
            boardRef.current?.removeEventListener('click', mouseDownListner);
        };
    }, [boardRef.current, currentShip, shipsOffsets])
    
    useEffect(() => {
        props.socket.on('initial_game_state', (data) => {
            console.log(data)
            setBoard(data.board);
            setShadowBoard(data.board);
            setShipsOffsets(data.shipsOffsets);
        });

        props.socket.on('ship_rotated', (data) => {
            console.log(data.newOffset)
            console.log(data.shipNumber)
            let updatedShipsOffsets = [...shipsOffsets]
            updatedShipsOffsets[data.shipNumber] = data.newOffset;
            setShipsOffsets(updatedShipsOffsets);
        });

        props.socket.on('ship_placed', (data) => {
            if (Object.keys(data).length !== 0){
                shipsPlaced.add(data.shipNumber);
                setCurrentShip(undefined);
                setShadowBoard(getEmptyBoard())
                setBoard(data.board);
            } else {
                console.log("not valid placement")
                console.log(data.board);
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
            {shadowBoard?.map((row, rowId) => {
                    return(
                        <div key={rowId}>
                        {row.map((value, columnId) => {
                            {switch(value){
                                case 0: 
                                    return <div className="tileNoShadow" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 1:
                                    return <div className="tileShadow" key={columnId} data-x={columnId} data-y={rowId}></div>
                                }}
                            })}
                        </div>
                    )
                })}
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