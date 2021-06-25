import React from "react";

function ChatListItems(props) {
  const selectChat = (e) => {
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
    <div style={{ animationDelay: `0.${props.animationDelay}s` }} onClick={selectChat} className={`chatlist__item ${props.active ? props.active : ""} `}>
      <div className="userMeta" >
        <p style={{ fontWeight: 500, fontSize: "17px" }}>{props.name}</p>
        <span className="activeTime" style={{ paddingTop: "30%" }}>32 mins ago</span>
      </div>
    </div>
  );
}

export default ChatListItems