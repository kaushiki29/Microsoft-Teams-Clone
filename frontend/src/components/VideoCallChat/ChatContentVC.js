import React, { useState, useEffect, useRef } from "react";
import "../../css/ChatContent.css";
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { api, socketUrl } from "../../screen/Helper";
import { useHistory, useParams } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { io } from "socket.io-client";
import { Modal } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ChatItemTeam from "../ChatItemTeam";
import WarningModal from "../WarningModal";
import OldCalls from '../OldCalls';
import ScheduledCalls from "../ScheduledCalls";


//CSS Style

const useStyles = makeStyles({
  input: {
    display: "none"
  }
})


export default function ChatContentVC(props) {
  const { meeting_slug } = useParams();
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)')
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState();
  const [imgFile, setImgFile] = useState();
  const [call, setCall] = useState([{
    name: "",
    time: ""
  }]);
  const dropRef = useRef();
  const [tabActive, setTabActive] = useState(true);
  const socket = io(socketUrl);
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState();
  const chatItms = [];



  useEffect(() => {
    console.log(props.name);
  }, [props.name])


  // Fetch messages in the video call
  // Persistent chatting feature


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios({
      method: 'post',
      url: api + "communication/get_video_msg",
      data: {
        meeting_slug: meeting_slug,
      },
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        if (res.data.error) {
          setOpenError(true);
          setErrorMsg(res.data.msg);
        }
        else {
          setChat(res.data.all_msgs);
          setError(false);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, [])





  const onFocus = () => {
    setTabActive(true);
  }

  const onBlur = () => {
    setTabActive(false);
    console.log('Tab is blurred');
  };



  //Handling Chat Scroll

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };




  //Handling multimedia in chat


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


  // Handle new message and list updation


  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener('blur', onBlur);
    scrollToBottom();
    if (meeting_slug && meeting_slug != 'all-conversations') {
      socket.on('connect', function () {
        socket.emit('uuid', meeting_slug);
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
      else {
        const x = {
          type: "",
          msg_text: type == 'txt' ? data : null,
          type1: type,
          img: type == 'img' ? data : null,
          sent_time: new Date(),
          sender_name: name1,
        }

        setChat(c => [...c, x]);
      }
      scrollToBottom();

    });



    let div = dropRef.current
    div?.addEventListener('dragenter', handleDragIn)
    div?.addEventListener('dragleave', handleDragOut)
    div?.addEventListener('dragover', handleDrag)
    div?.addEventListener('drop', handleDrop)
    return () => {
      socket.disconnect();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener('blur', onBlur);
    }
  }, [])

  const onStateChange = (e) => {
    setMsg(e.target.value);
  };



  //Sending new message


  const sendMessage = () => {

    if (msg != "") {
      socket.emit('sendchat', meeting_slug, msg, props.name, 'txt');
      const token = localStorage.getItem('token');
      axios({
        method: 'post',
        url: api + 'communication/send_video_msg',
        data: {
          msg_text: msg,
          meeting_slug: meeting_slug,
        },
        headers: { Authorization: 'Token ' + token }
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        })


      // let c = [...chat];
      // c.push({
      //   type: "",
      //   msg_text: msg,
      //   type1: "txt",
      //   img: null,
      //   sent_time: new Date(),
      //   sender_name: props.name,
      // })
      // setChat([...c])
      scrollToBottom();
      setMsg('');
    }
  }
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  }




  //Handing meeting name

  const [team_slug, setTeamSlug] = useState("")
  useEffect(() => {
    axios({
      method: 'post',
      url: api + 'communication/get_meet_name',
      data: {
        meeting_slug: meeting_slug
      },
      headers: { Authorization: 'Token ' + localStorage.getItem('token') }
    })
      .then(res => {
        setCall({
          name: res.data.name,
          time: res.data.time
        })
        setTeamSlug(res.data.team_slug)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])


  // Handling select different image


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


  // Handle Upload image


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
    form_data.append('meeting_slug', meeting_slug);
    handleClose();
    axios({
      method: 'post',
      url: api + 'communication/send_video_img',
      data: form_data,
      headers: { Authorization: 'Token ' + localStorage.getItem('token') }
    })
      .then(res => {
        socket.emit('sendchat', meeting_slug, res.data.imgUrl, props.name, 'img');
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

  const openModal = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setImgFile();
    setImage();
  }



  //Handling pasting images from clipboard


  const handlePaste = (e) => {
    if (e.clipboardData.files.length) {
      console.log(e.clipboardData.files[0]);
      setOpen(true);
      setMsg('');
      setImage(URL.createObjectURL(e.clipboardData.files[0]));
      setImgFile(e.clipboardData.files[0]);
    }
  }
  const handleCloseError = () => {

  }

  const handleGoBack = () => {
    history.push("/teams/" + team_slug)
  }

  return (

    <div style={{ paddingLeft: isMobile ? '10px' : '20px', marginTop: 71, marginLeft: 68 }} className="main__chatcontent">
      {/* <div><Button variant="outlined" color="primary" onClick={handleGoBack} style={{ height: 33 }}>Go back</Button></div> */}
      {/* <div><OldCalls call={{}}  /></div> */}
      <div style={{ justifyContent: "center", alignItems: "center", height: "160px", textAlign: "center", position: "sticky", top: "56px", fontSize: "24px", zIndex: 1000 }}>
        <ScheduledCalls call={call} style={{ height: "150px", marginBottom: 0, marginTop: 0, padding: "10px", justifyContent: "center" }} team_slug={team_slug} back_option={true} vc={true} />
      </div>
      {!error &&
        <React.Fragment>
          <div className="content__body" style={{ maxHeight: 'calc(113vh - calc(115vh / 2))', minHeight: 'calc(113vh - calc(115vh / 2))' }} >
            <div className="chat__items" >
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
          <div className="content__footer" style={{ position: "sticky", bottom: 0 }}>
            <div className="sendNewMessage" onPaste={handlePaste} ref={dropRef}>
              <button className="addFiles" onClick={openModal}>
                <AddIcon style={{ color: "white" }} />
              </button>
              <input
                type="text"
                placeholder="Type a message here"
                onChange={onStateChange}
                onKeyDown={handleKeyDown}
                value={msg}
              />
              <button className="btnSendMsg" id="sendMsgBtn" onClick={sendMessage}>
                <SendIcon style={{ color: "white" }} />
              </button>
            </div>
          </div>
          <Modal open={open} onClose={handleClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
            <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: "2%" }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div>Preview Image</div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: 205, height: 205, borderRadius: "2%", borderColor: "#464775", borderStyle: "solid", backgroundColor: "#f1f1f1" }}>
                    <img src={image} style={{ width: 202, height: 202, objectFit: 'contain' }} />
                  </div>
                </div>
                {!imgFile ? <div style={{ paddingTop: "5%", paddingBottom: "2%" }}>
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
                {/* <button style={{ width: 200 }} >Done!</button> */}
                <Button variant="outlined" color="primary" onClick={handleUploadImage} style={{ height: "33px", color: "#464775" }}>
                  Done!
                </Button>
              </div>
            </div>
          </Modal>
        </React.Fragment>
      }
      {error && <WarningModal open={openError} handleClose={handleCloseError} text={errorMsg} redirect={"/home"} />}
    </div>

  );

}