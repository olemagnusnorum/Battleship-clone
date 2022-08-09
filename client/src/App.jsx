import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
// for socket.io
import io from 'socket.io-client'
const socket = io.connect('http://localhost:3000');
socket.emit('create_room', '0')

function App() {

  const [roomNumber, setRoomNumber] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("")
  const [message, setMessage] = useState("");
  const [messageResieved, setMessageResieved] = useState("");

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
  }, [socket]);
  
  return (
    <div className="App">
      <h1>Your current room:</h1>
      {roomNumber}
      <div>
        <input placeholder="Room number..." onChange={(event) => {setNewRoomNumber(event.target.value);}}/>
        <button onClick={sendJoinRoom}>SEND</button>
      </div>
      <div>
        <input placeholder="Message..." onChange={(event) => {setMessage(event.target.value);}}/>
        <button onClick={sendMessage}>SEND</button>
        <h1>Message:</h1>
        {messageResieved}
      </div>
    </div>
  )
}

export default App
