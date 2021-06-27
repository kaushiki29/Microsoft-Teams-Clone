import React, { Component } from "react";
import "../css/chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";

export default class ChatBody extends Component {
  render() {
    return (
      <div className="main__chatbody">
        <ChatList />
        <ChatContent />
      </div>
    );
  }
}
