import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { createLocalVideoTrack } from 'twilio-video';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VideocamIcon from '@material-ui/icons/Videocam';

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [isMuted, setMuted] = useState(false);
  const [isVideo, setVideo] = useState(true);
  const [changes, setChanges] = useState(1);
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
    <Participant noPart = {participants.length} key={participant.sid} participant={participant} />
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

  return (
    <div className="room" style={{ backgroundColor: "#302e2e", height: "100%" }}>
      <div style={{ height: "45px", backgroundColor: "#f1f1f1", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Room: {roomName}</h2>
      </div>
      <div style={{display: 'flex',flexWrap: 'wrap', padding: 30,justifyContent: 'center'}}>
      <div className="local-participant" style={{ marginTop: "0px" }}>
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            isMuted={isMuted} 
            noPart = {participants.length}
          />

        ) : (
          ""
        )}
      </div>
      {remoteParticipants}
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
      </div>
    </div>
  );
};

export default Room;
