import React from "react";
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'

function PlayerBoard(props){
    if (!props.board) return <></>
    return(
        <div className="board" style={{"--row": props.board.length, "--col": props.board[0].length}}>
            <div className="playerBoard" ref={props.boardRef}>
                {props.board?.map((row, rowId) => {
                    return(
                        <div key={rowId}>
                        {row.map((value, columnId) => {
                            {switch(value){
                                case 0: 
                                    return <div className="tile tileWater" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 1:
                                    return <div className="tile tileShip" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 3:    
                                    return <div className="tile tileMiss" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 4:    
                                    return <div className="tile tileHit" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 5:    
                                    return <div className="tile tileSunk" key={columnId} data-x={columnId} data-y={rowId}></div>
                                }}
                            })}
                        </div>
                    )
                })}
            </div>
            {props.shadowBoard &&
            <div className="shadowBoard">
            {props.shadowBoard?.map((row, rowId) => {
                return(
                    <div key={rowId}>
                        {row.map((value, columnId) => {
                            {switch(value){
                                case 0: 
                                return <div className="tile tileNoShadow" key={columnId} data-x={columnId} data-y={rowId}></div>
                                case 1:
                                    return <div className="tile tileShadow" key={columnId} data-x={columnId} data-y={rowId}></div>
                                }}
                            })}
                        </div>
                    )
                })}
            </div>
            }
        </div>
    );

}

export default PlayerBoard