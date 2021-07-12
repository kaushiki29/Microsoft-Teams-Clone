import React, { useState, useEffect, useRef } from "react";
import "../css/ChatContent.css";
import Avatar from "../components/Avatar";
import AddIcon from '@material-ui/icons/Add';
import ChatItemTeam from "./ChatItemTeam";
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { api, socketUrl } from "../screen/Helper";
import { useHistory, useParams } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { io } from "socket.io-client";
import { Modal } from "@material-ui/core";
import VideoCallIcon from '@material-ui/icons/VideoCall';
import useMediaQuery from '@material-ui/core/useMediaQuery';


// CSS Style

const useStyles = makeStyles({
  input: {
    display: "none"
  },
  contentBody: {
    // '@media(max-height: 740px)': {
    //   maxHeight: "calc(100vh - calc(95vh / 2))",
    //   minHeight: "calc(110vh - calc(95vh / 2))",
    //   overflow: "auto",
    // }
  }
})


export default function ChatContent(props) {
  // const classes = useStyles()
  const { team_slug } = useParams();
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)')
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState();
  const [imgFile, setImgFile] = useState();
  const dropRef = useRef();
  const [tabActive, setTabActive] = useState(true);
  const socket = io(socketUrl);
  const chatItms = [];



  useEffect(() => {
    console.log(props.name);
  }, [props.name])


  // Get all the message of the current team


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios({
      method: 'post',
      url: api + "communication/get_team_msg",
      data: {
        team_slug: team_slug,
      },
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        setChat(res.data.all_msgs);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])


  // Manage tab change

  const onFocus = () => {
    setTabActive(true);
  }

  const onBlur = () => {
    setTabActive(false);
  };


  // Handle automatic scroll to bottom


  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };



  // Handling Image transfer in the chat
  // using drag and drop feature


  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log(e.dataTransfer.files)
      let img = e.dataTransfer.files[0];
      console.log(img);
      setOpen(true);
      setImage(URL.createObjectURL(img));
      setImgFile(img);
      e.dataTransfer.clearData();
    }
  }



  // Update teams chat


  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener('blur', onBlur);
    scrollToBottom();
    if (team_slug && team_slug != 'all-conversations') {
      socket.on('connect', function () {
        socket.emit('uuid', team_slug);
      });

    }
    socket.on('updatechat', function (data, name1, type) {
      console.log(data, name1, props.name);
      if (props.name != name1) {

        const x = {
          type: "other",
          msg_text: type == 'txt' ? data : null,
          type1: type,
          img: type == 'img' ? data : null,
          sent_time: new Date(),
          sender_name: name1,
        }

        setChat(c => [...c, x]);
      }

    });



    let div = dropRef.current
    div.addEventListener('dragenter', handleDragIn)
    div.addEventListener('dragleave', handleDragOut)
    div.addEventListener('dragover', handleDrag)
    div.addEventListener('drop', handleDrop)
    return () => {
      socket.disconnect();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener('blur', onBlur);
    }
  }, [])



  const onStateChange = (e) => {
    setMsg(e.target.value);
  };


  // Handle send message


  const sendMessage = () => {

    if (msg != "") {
      socket.emit('sendchat', team_slug, msg, props.name, 'txt');
      const token = localStorage.getItem('token');
      axios({
        method: 'post',
        url: api + 'communication/send_team_msg',
        data: {
          msg_text: msg,
          team_slug: team_slug,
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
        type1: "txt",
        img: null,
        sent_time: new Date(),
      });
      let c = [...chat];
      c.push({
        type: "",
        msg_text: msg,
        type1: "txt",
        img: null,
        sent_time: new Date(),
        sender_name: props.name,
      })
      setChat([...c])
      scrollToBottom();
      setMsg('');
    }
  }


  // Handling enter key to send

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  }



  // Handle selection of different image
  // from the currently chosen image


  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      // this.setState({
      //   image: URL.createObjectURL(img)
      // });
      setImgFile(img);
      setImage(URL.createObjectURL(img))
    }
  }



  // Handle upload image


  const handleUploadImage = () => {
    console.log('upload');
    // setImage();
    // setImgFile();
    let form_data = new FormData();
    if (!imgFile) {
      return (
        alert("Please attach a media first.")
      )
    }
    form_data.append('img', imgFile);
    form_data.append('team_slug', team_slug);
    handleClose();
    axios({
      method: 'post',
      url: api + 'communication/send_team_img',
      data: form_data,
      headers: { Authorization: 'Token ' + localStorage.getItem('token') }
    })
      .then(res => {
        socket.emit('sendchat', team_slug, res.data.imgUrl, props.name, 'img');
        chatItms.push({
          type: "",
          msg_text: null,
          type1: "img",
          img: res.data.imgUrl,
          sent_time: new Date(),
        });
        let c = [...chat];
        c.push({
          type: "",
          msg_text: null,
          type1: "img",
          img: res.data.imgUrl,
          sent_time: new Date(),
          sender_name: props.name
        })
        setChat([...c]);
        scrollToBottom();
        setImage();
        setImgFile();
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }


  // Handle upload image modal

  const openModal = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setImgFile();
    setImage();
  }


  // Handle pasting from clipboard


  const handlePaste = (e) => {
    if (e.clipboardData.files.length) {
      console.log(e.clipboardData.files[0]);
      setOpen(true);
      setMsg('');
      setImage(URL.createObjectURL(e.clipboardData.files[0]));
      setImgFile(e.clipboardData.files[0]);
    }
  }



  return (
    <div style={{ paddingLeft: isMobile ? '10px' : '20px', paddingBottom: 0, padding: 0 }} className="main__chatcontent">
      <div className="content__body" className={classes.contentBody}>
        <div className="chat__items" style={{ paddingTop: "58px" }} >

          {/* Rendering new chat message */}


          {chat.length === 0 &&
            <div style={{ paddingTop: "5%", paddingBottom: "5%", textAlign: "center", }}>
              <img
                src="https://thumbs.dreamstime.com/b/home-video-call-online-work-conference-virtual-class-team-remote-meeting-digital-business-chat-internet-education-vector-193808545.jpg"
                height="200px"
                style={{ borderRadius: "5%" }}
              />
              <div style={{ paddingTop: "2%", color: "gray" }}>Don't keep your thoughts in your mind. <br /> Share it with your team here.</div>
            </div>}


          {chat.map((itm, index) => {
            return (
              <ChatItemTeam
                animationDelay={index + 2}
                key={index}
                user={itm.type ? itm.type : "me"}
                msg={itm.msg_text}
                type={itm.type1}
                img={itm.img}
                image={"https://simg.nicepng.com/png/small/128-1280406_view-user-icon-png-user-circle-icon-png.png"}
                sent_time={itm.sent_time}
                // hasSeen = {itm.has_seen}
                sender_name={itm.sender_name}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>


      {/* Send Message Input modal */}


      <div className="content__footer" style={{ position: "sticky", bottom: "92px", paddingTop: 0 }}>
        <div className="sendNewMessage" onPaste={handlePaste} ref={dropRef}>
          <button className="addFiles" onClick={openModal}>
            <AddIcon style={{ color: "white" }} />
          </button>
          <input
            type="text"
            placeholder="Something in mind? Share here."
            onChange={onStateChange}
            onKeyDown={handleKeyDown}
            value={msg}
          />
          <button className="btnSendMsg" id="sendMsgBtn" onClick={sendMessage}>
            <SendIcon style={{ color: "white" }} />
          </button>
        </div>
      </div>


      {/* Upload image modal */}


      <Modal open={open} onClose={handleClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
        <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: "2%" }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div>Preview Image</div>
            <div style={{ display: "flex" }}>
              <div style={{ width: 205, height: 205, borderRadius: "2%", borderColor: "#464775", borderStyle: "solid", backgroundColor: "#f1f1f1" }}>
                <img src={image} style={{ width: 202, height: 202, objectFit: 'contain' }} />
              </div>
            </div>
            {!imgFile ?
              <div style={{ paddingTop: "5%", paddingBottom: "2%" }}>
                Choose an Image
              </div> :
              <div style={{ paddingTop: "5%", paddingBottom: "2%" }}>
                Choose Some Other Image
              </div>}

            <input type="file" name="myImage" id="contained-button-file" onChange={onImageChange} className={classes.input} />
            <label htmlFor="contained-button-file" style={{ paddingBottom: "15%" }}>
              <Button variant="contained" color="primary" component="span" style={{ backgroundColor: "#464775", height: "33px" }}>
                Upload
              </Button>
            </label>
            <Button variant="outlined" color="primary" onClick={handleUploadImage} style={{ height: "33px", color: "#464775" }}>
              Done!
            </Button>
          </div>
        </div>
      </Modal>
    </div>

  );

}
