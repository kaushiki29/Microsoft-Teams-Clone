import React, { useState, Component } from "react";
import "../css/ChatList.css";
import ChatListItems from "./ChatListItems";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, withStyles } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    textAlign: 'center',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  margin: {
    margin: theme.spacing(1)
  },
}));


export default function ChatList(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = useState(false);
  const classes = useStyles();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div style={{ paddingLeft: isMobile ? '8%' : '2%', width: isMobile ? '100%' : '320px' }} className="main__chatlist">
      <Button variant="outlined" className="btn" style={{ height: "33px", marginBottom: "5%" }} onClick={handleOpen}>
        <AddIcon style={{ paddingRight: "3%", }} />Start Chat
      </Button>


      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h3 style={{ paddingTop: "3%", paddingBottom: "3%" }}>
              <div style={{ color: "gray" }}>Step 1: Go to common team</div> <br />
              <div style={{ color: "gray" }}>Step 2: Go to Team Participants Tab</div> <br />
              <div style={{ color: "gray" }}>Step 3: Click on Message Icon </div> <br />
            </h3>
            <Button size="small" variant="outlined" onClick={handleClose} style={{ backgroundColor: "#464775", color: "white", height: "33px", marginTop: "5px" }}>
              Okay
            </Button>
          </div>
        </Fade>
      </Modal>



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
              unseenMsgCount={item.unseen_messages_count}
            // image={"https://www.paintingcontest.org/components/com_djclassifieds/assets/images/default_profile.png"}
            />
          );
        })}
      </div>
    </div>
  );
}
