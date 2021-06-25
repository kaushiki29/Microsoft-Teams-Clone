import React, { useState, useEffect } from "react";
import "../css/ChatContent.css";
import AddIcon from '@material-ui/icons/Add';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ChatItem from "./ChatItem";
import SendIcon from '@material-ui/icons/Send';

function ChatContent(props) {
  const chatItms = [
    {
      key: 1,
      image:
        "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      type: "",
      msg: "Hi Kaushiki, How are you?",
    },
    {
      key: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "I am fine.",
    },
    {
      key: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "What about you?",
    },
    {
      key: 4,
      image:
        "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      type: "",
      msg: "Awesome these days.",
    },
    {
      key: 5,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "Finally. What's the plan?",
    },
    {
      key: 6,
      image:
        "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      type: "",
      msg: "what plan mate?",
    },
    {
      key: 7,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "I'm taliking about the tutorial",
    },
  ];

  const [chat, setChat] = useState({
    chat: chatItms,
    msg: ""
  })


  const onStateChange = (e) => {
    setChat({ msg: e.target.value });
  };

  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <p style={{ fontSize: "x-large", cursor: "pointer" }}>Kaushiki</p>
            <div>

            </div>
          </div>
        </div>

        <div className="blocks">
          <div className="settings">
            <button className="btn-nobg">
              <VideoCallIcon style={{ fontSize: "1.5rem", color: "#6264a7" }} />
            </button>
          </div>
        </div>
      </div>
      <div className="content__body">
        <div className="chat__items" style={{ paddingTop: "2%" }}>
          {chatItms.map((itm, index) => {
            return (
              <ChatItem
                animationDelay={index + 2}
                key={itm.key}
                user={itm.type ? itm.type : "me"}
                msg={itm.msg}
                image={itm.image}
              />
            );
          })}
          <div />
        </div>
      </div>
      <div className="content__footer">
        <div className="sendNewMessage">
          <button className="addFiles">
            <AddIcon style={{ verticalAlign: "middle", color: "#464775" }} />
          </button>
          <input
            type="text"
            placeholder="Type a message here"
            onChange={onStateChange}
            value={chat.msg}
          />
          <button className="btnSendMsg" id="sendMsgBtn">
            <SendIcon style={{ verticalAlign: "middle", color: "#464775" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatContent;