import React from "react";
import '../css/gameOver.css'

function GameOver(props){
    return(
        <div className="gameOver">
            <div className="textContainer">
                { props.win == true &&
                    <div className="won">
                        <div className="title">
                            <p>GAME OVER</p>
                        </div>
                        <div className="won">
                            <p>YOU WON</p>
                        </div>
                    </div>
                }
                {props.win == false &&
                    <div className="lost">
                        <div className="title">
                            <p>GAME OVER</p>
                        </div>
                        <div className="lost">
                            <p>YOU LOST</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )

}

export default GameOver