import React from "react";
import { useState} from 'react';
import { useEffect } from 'react';
import GameSetup from "./gameSetup";
import MainGame from "./mainGame";
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'

function Game(props){

    const [placedAllShips, setPlacedAllShips] = useState(false);
   
    useEffect(() => {
        props.socket.on('placing_finnished', () => {
            setPlacedAllShips(true);
        })
    })
    
    
    return(
        <div>
            {!placedAllShips && <GameSetup socket={props.socket} 
            roomNumber={props.roomNumber} 
            setPlacedAllShips={setPlacedAllShips}/>}
            {placedAllShips && <MainGame socket={props.socket}/>}
        </div>
    );
}

export default Game