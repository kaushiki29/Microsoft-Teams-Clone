import React, { useEffect } from "react";
import Avatar from "../components/Avatar";

export default function ChatListItems(props) {
  useEffect(()=>{
    // console.log(props.active);
  },[props])
  const selectChat = (e) => {
    props.fun(props.thread_id);
    for (
      let index = 0;
      index < e.currentTarget.parentNode.children.length;
      index++
    ) {
      e.currentTarget.parentNode.children[index].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
  };

    return (
      <div
        style={{ animationDelay: `0.${props.animationDelay}s`, alignItems: "center" }}
        onClick={selectChat}
        className={`chatlist__item ${props.active ? props.active : ""} `}
      >
        <Avatar
          image={
            props.image ? props.image : "http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
          }
          isOnline={props.isOnline}
        />

        <div className="userMeta" >
          <p>{props.name}</p>
          {/* <span className="activeTime">32 mins ago</span> */}
        </div>
      </div>
    );
}
