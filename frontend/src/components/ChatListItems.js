import React, { useEffect } from "react";
import Avatar from "../components/Avatar";


export default function ChatListItems(props) {
  useEffect(() => {
    // console.log(props.active);
  }, [props])


  // Select particular chat to render


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
          props.image ? props.image : "https://simg.nicepng.com/png/small/128-1280406_view-user-icon-png-user-circle-icon-png.png"
        }
        isOnline={props.isOnline}
      />

      <div className="userMeta" >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>{props.name}</p>
          {props.unseenMsgCount > 0 && <div style={{ marginLeft: 7, width: 15, height: 15, backgroundColor: 'red', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ margin: 0, color: 'white', fontSize: 10 }}>{props.unseenMsgCount > 99 ? '99+' : props.unseenMsgCount}</p></div>}
        </div>
      </div>
    </div>
  );
}
