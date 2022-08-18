import React from "react";
import '../css/tile.css'
import '../css/playerBoard.css'
import '../css/boatContainer.css'

function BoatContainer(props) {

    return (
        <div className="boatContainer">
            {props.shipsOffsets.map((shipOffset, shipOffsetId) => {
                return(
                    <button onClick={() => props.handleSetCurrentShip(shipOffsetId)}>{shipOffsetId}</button>
                )
            })}
        </div>
    );
}

export default BoatContainer
