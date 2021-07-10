import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import ChatContentVC from '../components/VideoCallChat/ChatContentVC';
import { api } from './Helper';


export default function VideoCallChat() {
  const [username, setUsername] = useState();


  // Get username from the database


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios({
      method: 'get',
      url: api + "auth/get_username",
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        setUsername(res.data.username)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])


  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
        <Sidebar />
      </div>
      {username && <ChatContentVC name={username} />}
    </div>
  )
}
