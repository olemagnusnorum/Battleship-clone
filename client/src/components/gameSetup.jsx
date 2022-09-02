import React from "react";
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import PlayerBoard from "./playerBoard";
import BoatContainer from "./boatContainer";
import '../css/gameSetup.css'

let prev = {"x": null, "y": null};

function GameSetup(props) {

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

    useEffect(() => {
        const mouseMoveListener = (event) => {
            const tile = event.target;
            const x = +tile.dataset.x;
            const y = +tile.dataset.y;
            if (currentShip !== undefined && !shipsPlaced.has(currentShip)){
                if (prev.x !== x || prev.y !== y){
                    // update shadowBoard
                    let updatedShadowBoard = getEmptyBoard();
                    for (let i = 0; i < shipsOffsets[currentShip].length; i++){
                        let shadowX = x + shipsOffsets[currentShip][i].x;
                        let shadowY = y + shipsOffsets[currentShip][i].y;
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

        const leftMouseClickListener = (event) => {
            const tile = event.target;
            const x = +tile.dataset.x
            const y = +tile.dataset.y
            placeShip(x, y, currentShip);
        }

        const rightMouseClickListener = (event) => {
            event.preventDefault();
            if (currentShip !== undefined){
                rotateShip();
            }
        }

        boardRef.current?.addEventListener('mousemove', mouseMoveListener)
        boardRef.current?.addEventListener('click', leftMouseClickListener)
        boardRef.current?.addEventListener('contextmenu', rightMouseClickListener)

        return () => {
            boardRef.current?.removeEventListener('mousemove', mouseMoveListener);
            boardRef.current?.removeEventListener('click', leftMouseClickListener);
            boardRef.current?.removeEventListener('contextmenu', rightMouseClickListener);
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
            //updating shadowboard
            let updatedShadowBoard = getEmptyBoard();
            for (let i = 0; i < data.newOffset.length; i++){
                let shadowX = prev.x + data.newOffset[i].x
                let shadowY = prev.y + data.newOffset[i].y
                if (shadowY >= 0 && shadowY < updatedShadowBoard.length && shadowX >= 0 && shadowX < updatedShadowBoard.length){
                    updatedShadowBoard[shadowY][shadowX] = 1;
                }
            }
            setShadowBoard(updatedShadowBoard);
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
        <div className="gameSetup">
            <p>PLACE YOUR SHIPS</p>
            <div className="setupBoard">
            <PlayerBoard 
            boardRef={boardRef}
            board={board} 
            shadowBoard={shadowBoard} />
            </div>
            <BoatContainer 
            shipsOffsets={shipsOffsets} 
            shipsPlaced={shipsPlaced}
            handleSetCurrentShip={handleSetCurrentShip}/>
        </div>
    );
}

export default GameSetup