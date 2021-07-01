import React, { useState, useEffect, useRef } from "react";
import "../css/ChatContent.css";
import Avatar from "../components/Avatar";
import AddIcon from '@material-ui/icons/Add';
import ChatItem from "./ChatItem";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { api } from "../screen/Helper";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";


export default function ChatContent(props) {
  const history = useHistory();
  const messagesEndRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const chatItms = props.chatItms;
  const socket = io("https://msteams.games:5000");
  useEffect(() => {
    setChat(props.chatItms);
  }, [props])

 
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    // $("#chat_div").scrollTop($("#chat_div")[0].scrollHeight);
  };
  
  useEffect(() => {

    scrollToBottom();
    if (props.thread_id && props.thread_id != 'all-conversations') {
      socket.on('connect', function () {
        socket.emit('uuid', props.thread_id);
      });

    }
    socket.on('updatechat', function (data, name) {
      // console.log(data,name);
      if (name != props.name) {
        chatItms.push({
          type: "other",
          msg_text: data,
          sent_time: new Date(),
        });
        setChat([...chatItms])
      }
    });
    return () => socket.disconnect();
  }, [])

  const onStateChange = (e) => {
    setMsg(e.target.value);
  };


  const sendMessage = () => {

    if (msg != "") {
      socket.emit('sendchat', props.thread_id, msg, props.name);
      const token = localStorage.getItem('token');
      axios({
        method: 'post',
        url: api + 'communication/send_message',
        data: {
          msg_text: msg,
          thread_id: props.thread_id,
        },
        headers: { Authorization: 'Token ' + token }
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
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
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  }

  const startCall=()=>{
    const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
              username: props.uName,
            },
            url: api + "communication/create_p2p_call",
            headers: {
                Authorization: "Token " + token
            }
        })
        .then(res => {
            console.log(res.data);
            socket.emit('sendchat', props.thread_id, `Quick! Come join me in this call https://www.msteams.games/call/${res.data.meeting_slug}`, props.name);
            const token = localStorage.getItem('token');
            axios({
              method: 'post',
              url: api + 'communication/send_message',
              data: {
                msg_text: `Quick! Come join me in this call https://www.msteams.games/call/${res.data.meeting_slug}`,
                thread_id: props.thread_id,
              },
              headers: { Authorization: 'Token ' + token }
              })
              .then(res => {
                console.log(res.data);
              })
              .catch(err => {
                console.log(err);
              })

            chatItms.push({
              type: "",
              msg_text: msg,
              sent_time: new Date(),
            });
            setChat(chatItms)
            scrollToBottom();
            // setMsg('');
            history.push('/call/' + res.data.meeting_slug);
        })
        .catch(err => {
            console.log(err);
        })
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
            <p >{props.name}</p>
            <p onClick={startCall} style={{marginLeft: 200}}>Call</p>
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
        <div className="chat__items" >
          {chat.map((itm, index) => {
            return (
              <ChatItem
                animationDelay={index + 2}
                key={index}
                user={itm.type ? itm.type : "me"}
                msg={itm.msg_text}
                image={"http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"}
                sent_time={itm.sent_time}
              />
            );
          })}
          <div  ref = {messagesEndRef}/>
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
