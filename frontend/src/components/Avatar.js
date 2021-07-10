import React, { Component } from "react";
import useMediaQuery from '@material-ui/core/useMediaQuery';

function Avatar(props) {
  const isMobile = useMediaQuery('(max-width:600px)')

  if (isMobile) {
    return <div></div>
  }
  else
    return (
      <div className="avatar">
        <div className="avatar-img">
          <img src={props.image} alt="#" />
        </div>
        <span className={`isOnline ${props.isOnline}`}></span>
      </div>
    );
}

export default Avatar;
