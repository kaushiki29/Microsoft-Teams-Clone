import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import { createLocalVideoTrack } from 'twilio-video';

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [isMuted,setMuted] = useState(false);
  const [isVideo,setVideo] = useState(true);
  const [changes,setChanges] = useState(1);
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

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  const handleAudio=()=>{
    if(!isMuted){
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
        console.log("muted and track disabled");
      });
    }
    else{
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });
    }
    setMuted(!isMuted);
  }

  const handleVideo=()=>{
    if(isVideo){
      room.localParticipant.videoTracks.forEach(publication => {
        // publication.track.disable();
        publication.track.stop();
        publication.unpublish();
      });
    }
    else{

      // room.localParticipant.videoTracks.forEach(publication => {
      //   publication.track.enable();
      // });
      createLocalVideoTrack().then(localVideoTrack => {
        return room.localParticipant.publishTrack(localVideoTrack);
      }).then(publication => {
        console.log('Successfully unmuted your video:', publication);
      });
      setChanges(changes+1);
    }
    setVideo(!isVideo);
  }

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Leave</button>
      <button onClick={handleAudio}>Mute/Unmute</button>
      <button onClick={handleVideo}>Video On/Off</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}/>
          
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
