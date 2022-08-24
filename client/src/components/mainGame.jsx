import React from "react";
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import PlayerBoard from "./playerBoard";
import BoatContainer from "./boatContainer";
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'
import '../css/test.css'


function MainGame(props){

    const [hitTracker, setHitTracker] = useState();
    const [shadowBoard, setShadowBoard] = useState();
    const [board, setBoard] = useState();
    const [myTurn, setMyTurn] = useState();
    const hitTrackerRef = useRef(null);


    useEffect(() => {
        props.socket.emit('initialize_main_game');
    }, []);

    useEffect(() => {
        props.socket.on('initial_main_game_state', (data) => {
            console.log(data);
            setHitTracker(data.hitTracker);
            setBoard(data.board);
            setMyTurn(data.myTurn);
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