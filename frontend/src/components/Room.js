import React, { useEffect, useState, useRef } from "react";
import Participant from "./Participant";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { createLocalVideoTrack, LocalVideoTrack } from 'twilio-video';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VideocamIcon from '@material-ui/icons/Videocam';
import Avatar from "../components/Avatar";
import ChatIcon from '@material-ui/icons/Chat';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import Button from '@material-ui/core/Button';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { CopyToClipboard } from "react-copy-to-clipboard";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';
import SendIcon from '@material-ui/icons/Send';
import { io } from "socket.io-client";
import axios from "axios";
import { api } from "../screen/Helper";


const videoType = 'video/webm';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Room = ({ roomName, room, handleLogout }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [dominantSpeaker, setDominantSpeaker] = useState();
  const messagesEndRef = useRef(null);
  const [isMuted, setMuted] = useState(false);
  const [isVideo, setVideo] = useState(true);
  const [changes, setChanges] = useState(1);
  const [showPart, setShowPart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [allMsg, setAllMsg] = useState([]);
  const [msg, setMsg] = useState('');
  const msgs = [];
  const socket = io("https://msteams.games:5000");
  const [sharing, setSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  // const [recording, setRecording] = useState(false);
  // const [recordedVideos, setRecordedVideos] = useState([])
  const isMobile = useMediaQuery('(max-width:600px)')


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


  // useEffect(() => {

  // async function recordVideo(){
  // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //   video.srcObject = stream;
  //   video.play();

  //   // init recording
  //   mediaRecorder = new MediaRecorder(stream, {
  //     mimeType: videoType,
  //   });
  //   // init data storage for video chunks
  //   chunks = [];
  //   // listen for data from media recorder
  //   mediaRecorder.ondataavailable = e => {
  //     if (e.data && e.data.size > 0) {
  //       chunks.push(e.data);
  //     }
  //   };

  // }

  //recordVideo();
  //   
  // }, [])



  // const startRecording = (e) => {
  //   e.preventDefault();
  //   // wipe old data chunks
  //   chunks = [];
  //   // start recorder with 10ms buffer
  //   mediaRecorder.start(10);
  //   // say that we're recording
  //   setRecording(true);
  // }


  // const stopRecording = (e) => {
  //   e.preventDefault();
  //   // stop the recorder
  //   mediaRecorder.stop();
  //   // say that we're not recording
  //   setRecording(false)
  //   // save the video to memory
  //   saveVideo();
  // }


  // const saveVideo = () => {
  //   // convert saved chunks to blob
  //   const blob = new Blob(chunks, { type: videoType });
  //   // generate video url from blob
  //   const videoURL = window.URL.createObjectURL(blob);
  //   // append videoURL to list of saved videos for rendering
  //   const videos = recordedVideos.concat([videoURL]);
  //   setRecordedVideos(videos)
  // }


  // const deleteVideo = (videoURL) => {
  //   // filter out current videoURL from the list of saved videos
  //   const videos = recordedVideos.filter(v => v !== videoURL);
  //   setRecordedVideos(videos)
  // }


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
      url: api + "communication/get_video_msg",
      data: {
        meeting_slug: roomName,
      },
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        setAllMsg(res.data.all_msgs)

      })
      .catch(err => {
        console.log(err);
      })
    return () => socket.disconnect();
  }, [])

  useEffect(() => {
    const participantConnected = (participant) => {
      console.log(participant)
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      console.log(participant)
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.on('dominantSpeakerChanged', participant => {
      handleSpeakerChange(participant);
    });
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };

  }, [room]);

  function removeDominantSpeaker() {
    console.log("Dominant speaker removed")
    setDominantSpeaker();
  }

  function assignDominantSpeaker(participant) {
    console.log("Dominant speaker assigned")
    setDominantSpeaker(participant)
    console.log(participant.sid)
  }

  function handleSpeakerChange(participant) {
    removeDominantSpeaker();
    if (participant != null)
      assignDominantSpeaker(participant);
  }

  useEffect(() => {
    console.log(participants.length);
  }, [participants]);

  const remoteParticipants = participants.map((participant) => (
    <Participant noPart={participants.length} key={participant.sid} participant={participant} reduceWidth={showPart || showChat} dominantSpeaker={dominantSpeaker} />
  ));

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
  const handleShowParticipants = () => {
    console.log('show');
    setShowChat(false);
    setShowPart(!showPart);
  }
  const handleShowChat = () => {
    console.log('show');
    setShowPart(false);
    setShowChat(!showChat);

  }
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

  const handleRecord = () => {
    console.log("Recordng reached")
  }


  const chatList = () => {
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
    const chatItem = (i, index) => {
      const date = new Date(i.timestamp);
      return (
        <div key={index} style={{ margin: 0, }}>
          <p style={{ marginLeft: 0, marginTop: 20, fontWeight: 'normal' }}><b>{i.sender_name}</b> &nbsp; {formatAMPM(new Date(i.sent_time))} </p>
          {i.type1 === 'txt' && <p style={{ marginLeft: 0, marginTop: 5, maxWidth: 250 }}>{i.msg_text}</p>}
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
    const sendMessage = () => {
      if (msg != '') {
        const token = localStorage.getItem('token');
        axios({
          method: 'post',
          url: api + 'communication/send_video_msg',
          data: {
            msg_text: msg,
            meeting_slug: roomName,
          },
          headers: { Authorization: 'Token ' + token }
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        })
        setMsg('');
        socket.emit('sendchat', roomName, msg, room.localParticipant.identity.split("!!!")[0], 'txt');
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [linkValue, setLinkValue] = useState("https://www.msteams.games/videocall/")
  const [isCopied, setCopied] = useState(false)
  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

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
                dominantSpeaker={dominantSpeaker}
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
      {/* <div>
        <h3>Recorded videos:</h3>
        {videos.map((videoURL, i) => (
          <div key={`video_${i}`}>
            <video style={{ width: 200 }} src={videoURL} autoPlay loop />
            <div>
              <button onClick={() => this.deleteVideo(videoURL)}>Delete</button>
              <a href={videoURL}>Download</a>
            </div>
          </div>
        ))}
      </div> */}
      <div style={{ backgroundColor: "#f1f1f1", left: 0, position: "fixed", bottom: 0, height: "65px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleOpen} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", justifyContent: 'flex-start' }}>
          <PersonAddIcon style={{ fontSize: "20px" }} /> <div style={{ fontSize: "10px" }}>Invite</div>
        </button>
        <button onClick={handleAudio} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white" }}>
          {isMuted ? <MicOffIcon style={{ fontSize: "20px" }} /> : <MicIcon style={{ fontSize: "20px" }} />} <div style={{ fontSize: "10px" }}>Mic</div>
        </button>
        <button onClick={handleVideo} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white" }}>
          {isVideo ? <VideocamIcon style={{ fontSize: "20px" }} /> : <VideocamOffIcon style={{ fontSize: "20px" }} />} <div style={{ fontSize: "10px" }}>Video</div>
        </button>
        <button onClick={handleShowParticipants} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", cursor: "pointer" }}>
          <PeopleIcon style={{ fontSize: "20px" }} /> <div style={{ fontSize: "10px" }}>Participants</div>
        </button>
        {/* <div>
          {!recording && <button onClick={e => startRecording(e)}>Record</button>}
          {recording && <button onClick={e => stopRecording(e)}>Stop</button>}
        </div> */}
        <button onClick={handleShowChat} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", cursor: "pointer" }}>
          <ChatIcon style={{ fontSize: "20px" }} /> <div style={{ fontSize: "10px" }}>Chat</div>
        </button>
        <button onClick={handleShare} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white", cursor: "pointer", }}>
          {!sharing ? <ScreenShareIcon style={{ fontSize: "20px" }} /> : <StopScreenShareIcon style={{ fontSize: "20px" }} />} <div style={{ fontSize: "10px" }}>ScreenShare</div>
        </button>
        <button onClick={handleLogout} style={{ height: "50px", width: "63px", borderRadius: "30%", marginLeft: "1%", backgroundColor: "white" }}>
          <ExitToAppIcon style={{ fontSize: "20px" }} /> <div style={{ fontSize: "10px" }}>Leave</div>
        </button>
      </div>
      <div>
        <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          style={{ textAlign: "center" }}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 style={{ paddingBottom: "2%" }}>Invite to call</h2>
              <TextField
                id="outlined-basic"
                variant="outlined"
                disabled
                value={linkValue + roomName}
                style={{ fontSize: "10px" }}
              />
              <CopyToClipboard onCopy={onCopy} text={linkValue + roomName}>
                <Button variant="outlined" color="primary">Copy Link</Button>
              </CopyToClipboard>
              {isCopied ? <div>Copied</div> : <div></div>}
            </div>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};

export default Room;
