import React from "react";
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'

function PlayerBoard(props){

    return(
        <div className="board">
            <div className="playerBoard" ref={props.boardRef}>
                {props.board?.map((row, rowId) => {
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
            {props.shadowBoard?.map((row, rowId) => {
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
    );

}

export default PlayerBoard