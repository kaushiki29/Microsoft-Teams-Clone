import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import { createLocalVideoTrack } from 'twilio-video';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
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
      <h2>Room: {roomName}</h2>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant} />

        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
      <div style={{ backgroundColor: "white", left: 0, backgroundColor: "white", position: "fixed", bottom: 0, height: "65px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button onClick={handleAudio} style={{ height: "33px", marginLeft: "1%" }}>Mute/Unmute</button>
        <button onClick={handleVideo} style={{ height: "33px", marginLeft: "1%" }}>Video On/Off</button>
        <button onClick={handleLogout} style={{ height: "33px", marginLeft: "1%" }}>
          <ExitToAppIcon />
        </button>
      </div>
    </div>
  );
};

export default Room;
