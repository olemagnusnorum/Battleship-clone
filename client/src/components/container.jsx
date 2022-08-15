import { useState } from 'react';
import { useEffect } from 'react';
import React from "react";
import Lobby from './lobby';
import Game from './game';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000');
socket.emit('create_room', '0');

function Container() {
  
  const [roomNumber, setRoomNumber] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("")
  const [message, setMessage] = useState("");
  const [messageResieved, setMessageResieved] = useState("");
  const [inGame, setInGame] = useState(false);

  const sendMessage = () => {
    socket.emit('send_message', { message, roomNumber });
  }

  const sendJoinRoom = () => {
    socket.emit('join_room', { newRoomNumber })
  }

  useEffect(() => {
    socket.on('recive_message', (data) => {
      setMessageResieved(data.message)
      console.log("got message")
    });

    socket.on('assign_room', (data) => {
      console.log(data)
      setRoomNumber(data)
    });

    socket.on('update_room', (data) => {
      setRoomNumber(data.newRoomNumber);
    })

    socket.on('start_game', () => {
      setInGame(true);
    })
  }, [socket]);
  
  return (
    <div className="Container">
      {!inGame && <Lobby socket={socket} 
      useEffect={useEffect}
      setNewRoomNumber={setNewRoomNumber} 
      roomNumber={roomNumber} 
      sendJoinRoom={sendJoinRoom}
      />}
      {inGame && <Game roomNumber={roomNumber}
      socket={socket}/>}
    </div>
  )
}

export default Container