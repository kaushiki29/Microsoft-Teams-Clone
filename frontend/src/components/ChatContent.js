import React, {useState,useEffect,useRef } from "react";

import "../css/ChatContent.css";
import Avatar from "../components/Avatar";
import AddIcon from '@material-ui/icons/Add';
import ChatItem from "./ChatItem";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { api } from "../screen/Helper";

import { io } from "socket.io-client";


export default function ChatContent(props) {
  const messagesEndRef = useRef();
  const [chat,setChat  ] = useState([]);
  const [msg,setMsg] = useState('');
  const chatItms = props.chatItms;
  
  useEffect(()=>{
    setChat(props.chatItms);
  },[props])

  const scrollToBottom = () => {
    // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    var objDiv = document.getElementById("chat_div");
    objDiv.scrollTop = objDiv.scrollHeight;
  };
  const socket =io("https://msteams.games:5000");
  useEffect(()=> {
    scrollToBottom();
    
    if(props.thread_id && props.thread_id!='all-conversations'){
      socket.on('connect', function() {
        socket.emit('uuid', props.thread_id);
      });
      
    }
    socket.on('updatechat', function ( data,name) {
      // console.log(data,name);
      if(name!=props.name){
        chatItms.push({
          type: "other",
          msg_text: data,
          sent_time: new Date(),
        });
        setChat([...chatItms])
      }
    });
    return () => socket.disconnect();
  },[])

  const onStateChange = (e) => {
    setMsg(e.target.value);
  };

  
  const sendMessage=()=>{
    
    if (msg != "") {
      socket.emit('sendchat',props.thread_id,msg,props.name);
      const token = localStorage.getItem('token');
      axios({
        method: 'post',
        url: api + 'communication/send_message',
        data : {
          msg_text: msg,
          thread_id: props.thread_id,
        },
        headers: {Authorization: 'Token '+ token}
      })
      .then(res=>{
          console.log(res.data);
      })
      .catch(err=>{
          console.log(err);
      })

      chatItms.push({
        type: "",
        msg_text: msg,
        sent_time: new Date(),
      });
      setChat(chatItms)
      scrollToBottom();
      setMsg('');
    }
  }
  const handleKeyDown=(e)=>{
    // console.log(e);
    if(e.keyCode===13){
      sendMessage();
    }
  }
  
    return (
      <div className="main__chatcontent">
        <div className="content__header">
          <div className="blocks">
            <div className="current-chatting-user">
              <Avatar
                isOnline="active"
                image="http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
              />
              <p>{props.name}</p>
            </div>
          </div>

          <div className="blocks">
            <div className="settings">
              <button className="btn-nobg">
                <i className="fa fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="content__body" >
          <div className="chat__items" id="chat_div"> 
            {chat.map((itm, index) => {
              return (
                <ChatItem
                  animationDelay={index + 2}
                  key={index}
                  user={itm.type ? itm.type : "me"}
                  msg={itm.msg_text}
                  image={"http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"}
                  sent_time = {itm.sent_time}
                />
              );
            })}
            <div />
          </div>
        </div>
        <div className="content__footer">
          <div className="sendNewMessage">
            <button className="addFiles">
              <AddIcon style={{ color: "white" }} />
            </button>
            <input
              type="text"
              placeholder="Type a message here"
              onChange={onStateChange}
              onKeyDown={handleKeyDown}
              value={msg}
            />
            <button className="btnSendMsg" id="sendMsgBtn" onClick={sendMessage}>
              <SendIcon style={{ color: "white" }} />
            </button>
          </div>
        </div>
      </div>
    );
  
}
