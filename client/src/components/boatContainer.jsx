import React from "react";
import '../css/boatContainer.css'

function BoatContainer(props) {

    

    return (
        <div className="boatContainer">
            {props.shipsOffsets.map((shipOffset, shipOffsetId) => {
                return(
                    <button disabled={props.shipsPlaced.has(shipOffsetId)? true : false} onClick={() => props.handleSetCurrentShip(shipOffsetId)}>{"SHIP " + shipOffsetId}</button>
                )
            })}
        </div>
    );
}

export default BoatContainer
