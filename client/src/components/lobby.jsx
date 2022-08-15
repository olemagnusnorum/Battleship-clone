import React, { Component } from "react";
import "../css/lobby.css"

class Lobby extends Component {

    render(){
        return(
            <div className="lobby">
                <p>LOBBY CODE : {this.props.roomNumber}</p>
                <div className="input_wrapper">
                    <input maxLength="6" spellCheck="false" onChange={(event) =>{this.props.setNewRoomNumber(event.target.value);}}/>
                    <button onClick={this.props.sendJoinRoom}>JOIN</button>
                </div>
            </div>
        );
    }
}

export default Lobby

//https://codepen.io/Wyper/pen/rNjrxrG