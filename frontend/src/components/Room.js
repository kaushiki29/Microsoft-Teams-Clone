import React, { useEffect, useState,useRef } from "react";
import Participant from "./Participant";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { createLocalVideoTrack,LocalVideoTrack } from 'twilio-video';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VideocamIcon from '@material-ui/icons/Videocam';
import Avatar from "../components/Avatar";
import SendIcon from '@material-ui/icons/Send';
import { io } from "socket.io-client";


const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);
  const [isMuted, setMuted] = useState(false);
  const [isVideo, setVideo] = useState(true);
  const [changes, setChanges] = useState(1);
  const [showPart,setShowPart] = useState(false);
  const [showChat,setShowChat] = useState(false);
  const [allMsg,setAllMsg] = useState([]);
  const [msg,setMsg] = useState('');
  const msgs = [];
  const socket = io("https://msteams.games:5000");
  const [sharing,setSharing] = useState(false);
  useEffect(() => {
    if(showChat){
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });
  const scrollToBottom = () => {
    if(showChat){
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };



  useEffect(() => {

    scrollToBottom();
    // if (props.thread_id && props.thread_id != 'all-conversations') {
      socket.on('connect', function () {
        socket.emit('uuid', roomName);
      });

    // }
    socket.on('updatechat', function (data, name) {
      console.log(data,name);
      msgs.push({username: name, msg: data});
      setAllMsg([...msgs]);
      scrollToBottom();
    });
    return () => socket.disconnect();
  }, [])

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

  useEffect(()=>{
    console.log(participants.length);
  },[participants]);

  const remoteParticipants = participants.map((participant) => (
    <Participant noPart = {participants.length} key={participant.sid} participant={participant} reduceWidth = {showPart || showChat} />
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
    }
    else {

      // room.localParticipant.videoTracks.forEach(publication => {
      //   publication.track.enable();
      // });
      createLocalVideoTrack().then(localVideoTrack => {
        return room.localParticipant.publishTrack(localVideoTrack);
      }).then(publication => {
        console.log('Successfully unmuted your video:', publication);
      });
      setChanges(changes + 1);
    }
    setVideo(!isVideo);
  }
  const stopScreenShare=()=>{
    room.localParticipant.videoTracks.forEach(publication => {
      publication.track.stop();
      publication.unpublish();
    });
    createLocalVideoTrack().then(localVideoTrack => {
      return room.localParticipant.publishTrack(localVideoTrack);
    }).then(publication => {
      console.log('Successfully unmuted your video:', publication);
    });
    setChanges(changes + 1);
  }
  const handleShowParticipants=()=>{
    console.log('show');
    setShowChat(false);
    setShowPart(!showPart);
  }
  const handleShowChat=()=>{
    console.log('show');
    setShowPart(false);
    setShowChat(!showChat);
    
  }
  const partList=()=>{

    const participantItem=(i,index)=>{
      return(
        <div style={{display: 'flex', alignItems: 'center',marginTop: 15,}} key={index}>
          <Avatar
            image={ "http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"}
            isOnline={true}
          />
          <p style={{margin: 0, marginLeft: 0, }}>{i.identity.split('!!!')[0]}</p>
        </div>
      )
    }
    return(
      <div style={{marginLeft: 20,marginRight: 20}}>
        <p style={{margin: 0,marginTop: 20,color: "#000000", fontSize: 28}}>Participants</p>
        <div style={{maxHeight: 'calc(100vh - 250px)',overflowY: 'auto'}}>
        {participantItem(room.localParticipant,-1)}
        {participants.map((i,index)=>
          participantItem(i,index)
        )}
        </div>
      </div>
    )
  }


  const chatList=()=>{
    
    const chatItem=(i,index)=>{
      return(
        <div key={index} style={{margin: 0,}}>
          <p style={{marginLeft: 0,marginTop: 20, fontWeight: 'bold'}}>{i.username}</p>
          <p style={{marginLeft: 0,marginTop: 5, maxWidth: 250}}>{i.msg}</p>
        </div>
      )
    }

    const handleMsg=(e)=>{
      setMsg(e.target.value);
    }
    const handleKeyDown = (e) => {
      if (e.keyCode === 13) {
        sendMessage();
      }
    }
    const sendMessage=()=>{
      if(msg!=''){
        setMsg('');
        socket.emit('sendchat', roomName, msg, room.localParticipant.identity.split("!!!")[0]);
      }
      
    }
    return(
      <div style={{marginLeft: 20,marginRight: 20}}>
        <p style={{margin: 0,marginTop: 20,color: "#000000", fontSize: 28}}>Chat</p>
        <div style={{maxHeight: 'calc(100vh - 290px)',minHeight: 'calc(100vh - 290px)',overflowY: 'auto',}}>
          {
            allMsg.map((i,index)=>
              chatItem(i,index)
            )
          }
          <div ref = {messagesEndRef} />
        </div >
        <div style={{display: 'flex', alignItems: 'center'}}>
          <input
            style={{height: 45, borderRadius: 100,padding: 10, borderWidth: '0.5px', outline: 'none',marginTop: 10,width: '100%'}}
            type="text" 
            placeholder="Type a message here"
            onChange={handleMsg}
            onKeyDown={handleKeyDown}
            value={msg} />
        </div>
      </div>
    )
  }
  
  const handleShare=async()=>{
  //   navigator.mediaDevices.getDisplayMedia().then(stream => {
  //     const screenTrack = new Twilio.Video.LocalVideoTrack(stream.getTracks()[0]);
  //     room.localParticipant.publishTrack(screenTrack);
  //     }).catch(() => {
  //         alert('Could not share the screen.')
  //     });
    if(sharing){
      stopScreenShare();
    }
    else{
      const stream = await navigator.mediaDevices.getDisplayMedia();
      const screenTrack = new LocalVideoTrack(stream.getTracks()[0], {name: 'screen'});
      room.localParticipant.publishTrack(screenTrack);
    }
    setSharing(!sharing);
    
  }
  return (
    <div className="room" style={{ backgroundColor: "#302e2e", height: "100%" }}>
      <div style={{ height: "45px", backgroundColor: "#f1f1f1", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Room: {roomName}</h2>
      </div>
      <div style={{display: 'flex',justifyContent: 'flex-end'}}>
        <div style={{display: 'flex',flexWrap: 'wrap', padding: 30,justifyContent: 'center'}}>
        <div className="local-participant" style={{ marginTop: "0px" }}>
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              isMuted={isMuted} 
              noPart = {participants.length}
              reduceWidth = {showPart || showChat}
            />

          ) : (
            ""
          )}
        </div>
        {remoteParticipants}
        </div>
        {(showPart || showChat) &&
          <div style={{height: 'calc(100vh - 170px)',minWidth: '300px',backgroundColor: '#FFFFFF', marginTop: 30, marginBottom: 30,borderRadius: 10,marginRight: 10}}>
            {showPart && partList()}
            {showChat && chatList()}
          </div>
        }
      </div>
      <div style={{ backgroundColor: "#f1f1f1", left: 0, position: "fixed", bottom: 0, height: "65px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white", justifyContent: 'flex-start' }}>
          Invite
        </button>
        <button onClick={handleAudio} style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white" }}>
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </button>
        <button onClick={handleVideo} style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white" }}>
          {isVideo ? <VideocamIcon /> : <VideocamOffIcon />}
        </button>
        <button onClick={handleLogout} style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white" }}>
          <ExitToAppIcon />
        </button>
        <button onClick={handleShowParticipants} style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white", cursor:"pointer" }}>
          Part
        </button>
        <button onClick={handleShowChat} style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white", cursor:"pointer" }}>
          Chat
        </button>
        <button onClick={handleShare} style={{ height: "50px", width: "50px", borderRadius: "50%", marginLeft: "1%", backgroundColor: "white", cursor:"pointer" }}>
          Share
        </button>
      </div>
    </div>
  );
};

export default Room;
