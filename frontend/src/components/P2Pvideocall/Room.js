import React, { useEffect, useState, useRef } from "react";
import Participant from "./Participant";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { createLocalVideoTrack, LocalVideoTrack } from 'twilio-video';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VideocamIcon from '@material-ui/icons/Videocam';
import Avatar from "../Avatar";
import ChatIcon from '@material-ui/icons/Chat';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SendIcon from '@material-ui/icons/Send';
import { io } from "socket.io-client";
import axios from 'axios';
import { api, socketUrl } from '../../screen/Helper'
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';



const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);
  const [isMuted, setMuted] = useState(false);
  const [isVideo, setVideo] = useState(true);
  const [changes, setChanges] = useState(1);
  const [openImg, setOpenImg] = useState(false);
  const [image, setImage] = useState();
  const [imgFile, setImgFile] = useState();
  const dropRef = useRef();
  const [showPart, setShowPart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [allMsg, setAllMsg] = useState([]);
  const [msg, setMsg] = useState('');
  const msgs = [];
  const socket = io(socketUrl);
  const [sharing, setSharing] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)')



  // Handling scroll to bottom on new-message


  useEffect(() => {
    if (showChat) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });
  const scrollToBottom = () => {
    if (showChat) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };





  // Handling chat update
  // Inside the p2p video call


  useEffect(() => {

    scrollToBottom();
    // if (props.thread_id && props.thread_id != 'all-conversations') {
    socket.on('connect', function () {
      socket.emit('uuid', roomName);
    });

    // }
    socket.on('updatechat', function (data, name, type) {
      console.log(data, name, type);
      let a;
      if (type == 'txt') {
        a = { sender_name: name, msg_text: data, sent_time: new Date(), type1: type }
      }
      else if (type == 'img') {
        a = { sender_name: name, img: data, sent_time: new Date(), type1: type }
      }
      setAllMsg(x => [...x, a]);
      scrollToBottom();
    });

    const token = localStorage.getItem("token");
    axios({
      method: 'post',
      url: api + "communication/get_thread_messages",
      data: {
        meeting_thread: roomName,
      },
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        setAllMsg([...res.data.all_msgs])

      })
      .catch(err => {
        console.log(err);
      })


    return () => socket.disconnect();
  }, [])

  // Handling participant connected, disconnected

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };






    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };

  }, [room]);


  // Handling list of participants


  useEffect(() => {
    console.log(participants.length);
  }, [participants]);



  // Handling list of remote participants
  // i.e. other users



  const remoteParticipants = participants.map((participant) => (
    <Participant noPart={participants.length} key={participant.sid} participant={participant} reduceWidth={showPart || showChat} />
  ));



  // Handle Audio feature



  const handleAudio = () => {
    if (!isMuted) {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
        console.log("muted and track disabled");
      });
    }
    else {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });
    }
    setMuted(!isMuted);
  }


  // Handling Video



  const handleVideo = () => {
    if (isVideo) {
      room.localParticipant.videoTracks.forEach(publication => {
        // publication.track.disable();
        publication.track.stop();
        publication.unpublish();
      });
      // setSharing(!sharing);
      if (sharing) {
        setSharing(false);
      }
    }
    else {

      // room.localParticipant.videoTracks.forEach(publication => {
      //   publication.track.enable();
      // });
      createLocalVideoTrack().then(localVideoTrack => {
        return room.localParticipant.publishTrack(localVideoTrack);
      }).then(publication => {
        // console.log('Successfully unmuted your video:', publication);
      });
      setChanges(changes + 1);
    }
    setVideo(!isVideo);
  }



  // Handle stop screenshare feature


  const stopScreenShare = () => {
    if (isVideo) {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.stop();
        publication.unpublish();
      });
      createLocalVideoTrack().then(localVideoTrack => {
        return room.localParticipant.publishTrack(localVideoTrack);
      }).then(publication => {
        // console.log('Successfully unmuted your video:', publication);
      });
      setChanges(changes + 1);
    }
  }



  // Handle Show Participants


  const handleShowParticipants = () => {
    console.log('show');
    setShowChat(false);
    setShowPart(!showPart);
  }


  // Handle Show chat


  const handleShowChat = () => {
    console.log('show');
    setShowPart(false);
    setShowChat(!showChat);

  }


  // Handle Participant list


  const partList = () => {

    const participantItem = (i, index) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 15, }} key={index}>
          <Avatar
            image={"https://simg.nicepng.com/png/small/128-1280406_view-user-icon-png-user-circle-icon-png.png"}
            isOnline={true}
          />
          <p style={{ margin: 0, marginLeft: 0, }}>{i.identity.split('!!!')[0]}</p>
        </div>
      )
    }
    return (
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <p style={{ margin: 0, marginTop: 20, color: "#000000", fontSize: 28 }}>Participants</p>
        <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
          {participantItem(room.localParticipant, -1)}
          {participants.map((i, index) =>
            participantItem(i, index)
          )}
        </div>
      </div>
    )
  }



  // Handle Chat list

  const chatList = () => {


    // Handle time format


    const formatAMPM = (date) => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }


    // Handle chat messages


    const chatItem = (i, index) => {
      const date = new Date(i.timestamp);
      return (
        <div key={index} style={{ margin: 0, }}>
          <p style={{ marginLeft: 0, marginTop: 20, fontWeight: 'normal' }}><b>{i.sender_name}</b> &nbsp; {formatAMPM(new Date(i.sent_time))} </p>
          {i.type1 === 'txt' && <p style={{ marginLeft: 0, marginTop: 5, maxWidth: 250, wordBreak: 'break-all' }}>{i.msg_text}</p>}
          {i.type1 === 'img' && <img src={'https://msteams.games:9000' + i.img} style={{ width: 150, height: 150, objectFit: 'contain', border: "1px solid rgb(232, 205, 65)", borderRadius: '10px' }} />}
        </div>
      )
    }

    const handleMsg = (e) => {
      setMsg(e.target.value);
    }
    const handleKeyDown = (e) => {
      if (e.keyCode === 13) {
        sendMessage();
      }
    }
    // const sendMessage = () => {
    //   if (msg != '') {
    //     setMsg('');
    //     socket.emit('sendchat', roomName, msg, room.localParticipant.identity.split("!!!")[0]);
    //   }

    // }



    // Handle Send Message inside video call



    const sendMessage = () => {

      if (msg != "") {
        socket.emit('sendchat', roomName, msg, room.localParticipant.identity.split("!!!")[0], 'txt');
        const token = localStorage.getItem('token');
        axios({
          method: 'post',
          url: api + 'communication/send_message',
          data: {
            msg_text: msg,
            meeting_thread: roomName,
          },
          headers: { Authorization: 'Token ' + token }
        })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err);
          })


        scrollToBottom();
        setMsg('');
      }
    }
    return (
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <p style={{ margin: 0, marginTop: 20, color: "#000000", fontSize: 28 }}>Chat</p>
        <div style={{ maxHeight: 'calc(100vh - 290px)', minHeight: 'calc(100vh - 290px)', overflowY: 'auto', }}>
          {
            allMsg.map((i, index) =>
              chatItem(i, index)
            )
          }
          <div ref={messagesEndRef} />
        </div >
        <div style={{ display: 'flex', alignItems: 'center' }} onPaste={handlePaste} ref={dropRef} >
          <input
            style={{ height: 45, borderRadius: 100, padding: 10, borderWidth: '0.5px', outline: 'none', marginTop: 10, width: '100%' }}
            type="text"
            placeholder="Type a message here"
            onChange={handleMsg}
            onKeyDown={handleKeyDown}
            value={msg} />
        </div>
      </div>
    )
  }



  // Handle screen share


  const handleShare = async () => {

    if (sharing) {
      stopScreenShare();
    }
    else {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      const screenTrack = new LocalVideoTrack(stream.getTracks()[0], { name: 'screen' });
      room.localParticipant.publishTrack(screenTrack);
    }
    setSharing(!sharing);
  }



  // Handle Image change


  const handleCloseImg = () => {
    setOpenImg(false);
  }
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImgFile(img);
      setImage(URL.createObjectURL(img))
    }
  }


  const handlePaste = (e) => {
    if (e.clipboardData.files.length) {
      console.log(e.clipboardData.files[0]);
      setOpenImg(true);
      setMsg('');
      setImage(URL.createObjectURL(e.clipboardData.files[0]));
      setImgFile(e.clipboardData.files[0]);
    }
  }


  const handleUploadImage = () => {
    console.log('upload');
    let form_data = new FormData();
    if (!imgFile) {
      return (
        alert("Please attach a media first.")
      )
    }
    form_data.append('img', imgFile);
    form_data.append('meeting_thread', roomName);
    handleCloseImg();
    axios({
      method: 'post',
      url: api + 'communication/send_img',
      data: form_data,
      headers: { Authorization: 'Token ' + localStorage.getItem('token') }
    })
      .then(res => {
        socket.emit('sendchat', roomName, res.data.imgUrl, room.localParticipant.identity.split("!!!")[0], 'img');
        scrollToBottom();
        setImage();
        setImgFile();
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }



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
      setOpenImg(true);
      setImage(URL.createObjectURL(img));
      setImgFile(img);
      e.dataTransfer.clearData();
    }
  }


  useEffect(() => {
    if (showChat) {
      let div = dropRef.current
      div.addEventListener('dragenter', handleDragIn)
      div.addEventListener('dragleave', handleDragOut)
      div.addEventListener('dragover', handleDrag)
      div.addEventListener('drop', handleDrop)
    }

  }, [showChat])



  const imgUploadModal = () => {

    return (
      <Modal open={openImg} onClose={handleCloseImg} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
        <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: "2%" }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div>Preview Image</div>
            <div style={{ display: "flex" }}>
              <div style={{ width: 205, height: 205, borderRadius: "2%", borderColor: "#464775", borderStyle: "solid", backgroundColor: "#f1f1f1" }}>
                <img src={image} style={{ width: 202, height: 202, objectFit: 'contain' }} />
              </div>
            </div>
            {!imgFile ? <div style={{ paddingTop: "5%", paddingBottom: "2%" }}>Choose an Image</div> : <div style={{ paddingTop: "5%", paddingBottom: "2%" }}>Choose Some Other Image</div>}

            <input type="file" name="myImage" id="contained-button-file" onChange={onImageChange} style={{ display: 'none' }} />
            <label htmlFor="contained-button-file" style={{ paddingBottom: "15%" }}>
              <Button variant="contained" color="primary" component="span" style={{ backgroundColor: "#464775", height: "33px" }}>
                Choose
              </Button>
            </label>
            {/* <button style={{ width: 200 }} >Done!</button> */}
            <Button variant="outlined" color="primary" onClick={handleUploadImage} style={{ height: "33px", color: "#464775" }}>
              Upload!
            </Button>
          </div>
        </div>
      </Modal>
    )
  }


  return (
    <div className="room" style={{ backgroundColor: "#302e2e", height: "100%" }}>
      <div style={{ height: "45px", backgroundColor: "#f1f1f1", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Room: {roomName}</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: isMobile && (showPart || showChat) ? 'none' : 'flex', flexWrap: 'wrap', padding: 30, justifyContent: 'center' }}>
          <div className="local-participant" style={{ marginTop: "0px" }}>
            {room ? (
              <Participant
                key={room.localParticipant.sid}
                participant={room.localParticipant}
                isMuted={isMuted}
                noPart={participants.length}
                reduceWidth={showPart || showChat}
              />

            ) : (
              ""
            )}
          </div>
          {remoteParticipants}
        </div>
        {(showPart || showChat) &&
          <div style={{ height: 'calc(100vh - 170px)', minWidth: '300px', backgroundColor: '#FFFFFF', marginTop: 30, marginBottom: 30, borderRadius: 10, marginRight: 10 }}>
            {showPart && partList()}
            {showChat && chatList()}
          </div>
        }
      </div>

      {/* List of feature buttons in the video call */}

      <div style={{ backgroundColor: "#f1f1f1", left: 0, position: "fixed", bottom: 0, height: "65px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button onClick={handleAudio} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white" }}>
          {isMuted ? <MicOffIcon style={{ fontSize: "20px" }} /> : <MicIcon style={{ fontSize: "20px" }} />} <div style={{ fontSize: "10px" }}>Mic</div>
        </button>
        <button onClick={handleVideo} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white" }}>
          {isVideo ? <VideocamIcon style={{ fontSize: "20px" }} /> : <VideocamOffIcon style={{ fontSize: "20px" }} />} <div style={{ fontSize: "10px" }}>Video</div>
        </button>
        <button onClick={handleShowParticipants} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", cursor: "pointer" }}>
          <PeopleIcon style={{ fontSize: "20px" }} /><div style={{ fontSize: "10px" }}>Participants</div>
        </button>
        <button onClick={handleShowChat} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", cursor: "pointer" }}>
          <ChatIcon style={{ fontSize: "20px" }} /><div style={{ fontSize: "10px" }}>Chat</div>
        </button>
        <button onClick={handleShare} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", cursor: "pointer", display: isMobile ? "none" : "" }}>
          {!sharing ? <ScreenShareIcon style={{ fontSize: "20px" }} /> : <StopScreenShareIcon style={{ fontSize: "20px" }} />}<div style={{ fontSize: "10px" }}>ScreenShare</div>
        </button>
        <button onClick={handleLogout} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white" }}>
          <ExitToAppIcon style={{ fontSize: "20px" }} /><div style={{ fontSize: "10px" }}>Leave</div>
        </button>
      </div>
      {imgUploadModal()}
    </div>
  );
};

export default Room;
