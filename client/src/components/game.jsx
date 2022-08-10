import React, { Component } from "react";

class Game extends Component {

    render(){
        return(
            <div>
                <p>THIS IS THE GAME: {this.props.roomNumber}</p>
            </div>
        )
    }
}

export default Game