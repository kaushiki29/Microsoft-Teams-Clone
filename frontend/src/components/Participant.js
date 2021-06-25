import React, { useState, useEffect, useRef } from "react";

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [removed,setRemoved] = useState(false);
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
        setAudioTracks((audioTracks) => [ track]);
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


    const trackEnabled=(track)=>{
        console.log("trackEnabled");
    }

    const dis=()=>{
      console.log("disabled");
    }

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackStarted", trackSubscribed); // for video on
    participant.on("trackStopped",trackUnsubscribed);// for video off
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
      <h3>{participant.identity}</h3>
      <div style={{position: 'relative', width: 'fit-content'}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: "center", width: 200,position: 'absolute',margin: 'auto', bottom: 25, left: 'calc(50% - 100px)'}}>
        <button style={{margineft: 20}}>Audio</button> 
        <button style={{marginRight: 20}}>Video</button> 
        </div>
        {!removed && <video ref={videoRef} autoPlay={true} />}
        {removed && <div style={{width: 640,height: 480, display: 'flex',alignItems: 'center',justifyContent: 'center',backgroundColor: 'black'}}><h3 style={{color: 'white'}}>{participant.identity}</h3></div>}
        <audio ref={audioRef} autoPlay={true} mute={true} />
      </div>
    </div>
  );
};

export default Participant;
