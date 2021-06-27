import React, { useState, useEffect, useRef } from "react";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

const Participant = ({ participant, isMuted }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [removed, setRemoved] = useState(false);
  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {

      if (track.kind === "video") {
        setRemoved(false);
        setVideoTracks((videoTracks) => [track]);
      } else if (track.kind === "audio") {
        console.log("unmuted and enabled");
        setAudioTracks((audioTracks) => [track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        console.log("video off");
        setRemoved(true);
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };


    const trackEnabled = (track) => {
      console.log("trackEnabled");
    }

    const dis = () => {
      console.log("disabled");
    }

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackStarted", trackSubscribed); // for video on
    participant.on("trackStopped", trackUnsubscribed);// for video off
    participant.on("trackUnsubscribed", trackUnsubscribed);
    participant.on("trackEnabled", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      {/* <h3>{participant.identity.split('!!!')[0]}</h3> */}
      <div style={{ position: 'relative', width: 'fit-content' }}>
        <div style={{ display: 'flex', position: 'absolute', margin: 'auto', top: "10px", right: "10px", color: "gray" }}>
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </div>
        {!removed && <video ref={videoRef} autoPlay={true} style={{ border: "#e8cd41", borderStyle: "solid", borderWidth: "5px", borderRadius: "2%" }} />}
        {removed && <div style={{ width: 640, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', borderStyle: "solid", borderWidth: "5px", borderColor: "#e8cd41", borderRadius: "2%" }}>
          <div style={{ height: "200px", width: "200px", display: "flex", justifyContent: "center", alignItems: "center", borderStyle: "solid", borderRadius: "50%", backgroundColor: "#4470445c" }}>
            <h3 style={{ color: 'white' }}>{participant.identity.split('!!!')[0]}</h3>
          </div>
        </div>}
        <audio ref={audioRef} autoPlay={true} mute={true} />
      </div>
    </div>
  );
};

export default Participant;
