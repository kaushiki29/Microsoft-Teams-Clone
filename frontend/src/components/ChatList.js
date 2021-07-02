import React, { Component } from "react";
import "../css/ChatList.css";
import ChatListItems from "./ChatListItems";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

export default function ChatList(props) {


  return (
    <div className="main__chatlist">
      {/* <Button variant="outlined" className="btn" style={{ height: "33px", marginBottom: "5%" }}>
        <AddIcon style={{ paddingRight: "3%", }} />New Conversation
      </Button> */}
      <div className="chatlist__heading">
        <h2>Chats</h2>
        <button className="btn-nobg">
          <i className="fa fa-ellipsis-h"></i>
        </button>
      </div>
      <div className="chatlist__items">
        {props.allChatUsers.length == 0 &&
          <div>
            <p style={{ color: "gray", fontSize: "bold" }}>No chats to show.</p>
            <p style={{ color: "gray", fontSize: "bold" }}>Start a new conversation!</p>
          </div>
        }
        {props.allChatUsers.map((item, index) => {
          return (
            <ChatListItems
              name={item.other_user_name}
              key={index}
              thread_id={item.thread_id}
              animationDelay={index + 1}
              active={item.active ? "active" : ""}
              isOnline={item.isOnline ? "active" : ""}
              fun={props.setCurrChatuuid}
              unseenMsgCount = {item.unseen_messages_count}
            // image={"https://www.paintingcontest.org/components/com_djclassifieds/assets/images/default_profile.png"}
            />
          );
        })}
      </div>
    </div>
  );
}
