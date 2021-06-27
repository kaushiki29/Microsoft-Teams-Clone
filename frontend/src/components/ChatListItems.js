import React, { Component } from "react";
import Avatar from "../components/Avatar";

export default class ChatListItems extends Component {
  constructor(props) {
    super(props);
  }
  selectChat = (e) => {
    this.props.fun(this.props.thread_id);
    for (
      let index = 0;
      index < e.currentTarget.parentNode.children.length;
      index++
    ) {
      e.currentTarget.parentNode.children[index].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
  };

  render() {
    return (
      <div
        style={{ animationDelay: `0.${this.props.animationDelay}s`, alignItems: "center" }}
        onClick={this.selectChat}
        className={`chatlist__item ${this.props.active ? this.props.active : ""} `}
      >
        <Avatar
          image={
            this.props.image ? this.props.image : "http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
          }
          isOnline={this.props.isOnline}
        />

        <div className="userMeta" >
          <p>{this.props.name}</p>
          {/* <span className="activeTime">32 mins ago</span> */}
        </div>
      </div>
    );
  }
}
