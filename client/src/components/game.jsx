import React from "react";
import { useState} from 'react';
import { useEffect } from 'react';
import GameSetup from "./gameSetup";
import MainGame from "./mainGame";
import GameOver from "./gameOver";

function Game(props){

    const [placedAllShips, setPlacedAllShips] = useState(false);

    const [gameOver, setGameOver] = useState(false);

    const [win, setWin] = useState(null);
   
    useEffect(() => {
        props.socket.on('placing_finnished', () => {
            setPlacedAllShips(true);
        })

        props.socket.on('game_over', (data) => {
            setGameOver(true);
            setWin(data.win);
        })
    })
    
    
    return(
        <div>
            {!placedAllShips && !gameOver && <GameSetup socket={props.socket} 
            roomNumber={props.roomNumber} 
            setPlacedAllShips={setPlacedAllShips}/>}
            {placedAllShips && !gameOver && <MainGame socket={props.socket}/>}
            {placedAllShips && gameOver && <GameOver win={win}/>}
        </div>
    );
}

export default Game