import React from "react";
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import PlayerBoard from "./playerBoard";
import BoatContainer from "./boatContainer";
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'
import '../css/test.css'

let prev = {"x": null, "y": null};

function MainGame(props){

    const [hitTracker, setHitTracker] = useState();
    const [shadowBoard, setShadowBoard] = useState();
    const [board, setBoard] = useState();
    const [myTurn, setMyTurn] = useState();
    const hitTrackerRef = useRef(null);

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

    const placeMissile =(x, y) => {
        props.socket.emit('place_missile', {"x":x, "y":y});
    }

    useEffect(() => {
        props.socket.emit('initialize_main_game');
    }, []);

    useEffect(() => {
        const mouseMoveListener = (event) => {
            const tile = event.target;
            const x = tile.dataset.x;
            const y = tile.dataset.y;
            if (myTurn === true){
                if (prev.x !== x || prev.y !== y){
                    // update shadowBoard
                    let updatedShadowBoard = getEmptyBoard();
                    if (y >= 0 && y < updatedShadowBoard.length && x >= 0 && x < updatedShadowBoard.length){
                        updatedShadowBoard[y][x] = 1;
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
            placeMissile(x, y);
        }

        hitTrackerRef.current?.addEventListener('mousemove', mouseMoveListener);
        hitTrackerRef.current?.addEventListener('click', leftMouseClickListener);

        return () => {
            hitTrackerRef.current?.removeEventListener('mousemove', mouseMoveListener);
            hitTrackerRef.current?.removeEventListener('click', leftMouseClickListener);
        };
    })

    useEffect(() => {
        props.socket.on('initial_main_game_state', (data) => {
            console.log(data);
            setHitTracker(data.hitTracker);
            setBoard(data.board);
            setMyTurn(data.myTurn);
            setShadowBoard(data.hitTracker)
        })
    }, [props.socket])

    return (
        <div>
            {myTurn && <p>YOUR TURN</p>}
            {!myTurn && <p>NOT YOUR TURN</p>}
            <div className="boardContainer">
                <div className="bigBoard">
                <PlayerBoard 
                    boardRef={hitTrackerRef}
                    board={hitTracker} 
                    shadowBoard={shadowBoard}/>
                </div>
                <div className="samllBoard">
                    <PlayerBoard 
                    board={board} />
                </div>
            </div>
        </div>
    );

}

export default MainGame