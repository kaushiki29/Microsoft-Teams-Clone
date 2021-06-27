import React, {useState, createRef, useEffect } from "react";

import "../css/ChatContent.css";
import Avatar from "../components/Avatar";
import AddIcon from '@material-ui/icons/Add';
import ChatItem from "./ChatItem";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { api } from "../screen/Helper";
export default function ChatContent(props) {
  const messagesEndRef = createRef(null);
  const [chat,setChat] = useState([]);
  const [msg,setMsg] = useState('');
  const chatItms = props.chatItms;
  useEffect(()=>{
    setChat(props.chatItms);
  },[props])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(()=> {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        if (msg != "") {
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
            key: 1,
            type: "",
            msg: msg,
            image:
              "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
          });
          setChat(chatItms)
          scrollToBottom();
          setMsg('');
        }
      }
    });
    scrollToBottom();
  },[])
  const onStateChange = (e) => {
    setMsg(e.target.value);
  };

  
    return (
      <div className="main__chatcontent">
        <div className="content__header">
          <div className="blocks">
            <div className="current-chatting-user">
              <Avatar
                isOnline="active"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
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
        <div className="content__body">
          <div className="chat__items">
            {chat.map((itm, index) => {
              return (
                <ChatItem
                  animationDelay={index + 2}
                  key={itm.key}
                  user={itm.type ? itm.type : "me"}
                  msg={itm.msg_text}
                  image={"http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"}
                  time = {itm.sent_time}
                />
              );
            })}
            <div ref={messagesEndRef} />
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
              value={msg}
            />
            <button className="btnSendMsg" id="sendMsgBtn">
              <SendIcon style={{ color: "white" }} />
            </button>
          </div>
        </div>
      </div>
    );
  
}
