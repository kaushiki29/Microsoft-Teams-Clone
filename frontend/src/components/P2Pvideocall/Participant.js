import React, { useState, useEffect, useRef } from "react";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

const Participant = ({ participant, isMuted, noPart, reduceWidth }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [removed, setRemoved] = useState(false);
  const videoRef = useRef();
  const audioRef = useRef();
  const [trackName, setTrackName] = useState('');
  const [st, setSt] = useState();
  const [isMute, setIsMute] = useState(false);
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();



  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);



  // Set height according to number of participants 



  useEffect(() => {
    console.log(Math.ceil(Math.sqrt(noPart + 1)))
    setWidth(Math.ceil(Math.sqrt(noPart + 1)));
    if (noPart < 2) {
      setHeight(1);
    }
    else if (noPart < 6) {
      setHeight(2)
    }
    else if (noPart < 12) {
      setHeight(3);
    }
    else if (noPart < 16) {
      setHeight(4);
    }
  }, [noPart])



  // Set audio, video and screen share track
  // for each participant of the team


  useEffect(() => {


    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));
    console.log(participant.videoTracks.size, 'track');
    if (!participant.videoTracks.size) {
      setRemoved(true);
    }
    // if(participant.videoTrack == {})
    const trackSubscribed = (track) => {
      console.log(track.name);
      setTrackName(track.name);
      if (track.name !== 'screen') {
        setSt();
      }
      if (track.kind === "video") {
        setRemoved(false);
        setVideoTracks((videoTracks) => [track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [track]);
      }
    };




    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        console.log("video off");
        setRemoved(true);
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        console.log('audio');
        setIsMute(false);
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };




    const trackEnabled = (track) => {
      if (track.kind === "audio") {
        console.log('audio');
        setIsMute(false);
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    }




    const trackDisabled = (track) => {
      if (track.kind == 'audio') {
        setIsMute(true);
      }

    }




    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackStarted", trackSubscribed); // for video on
    participant.on("trackStopped", trackUnsubscribed);// for video off
    participant.on("trackUnsubscribed", trackUnsubscribed);
    participant.on("trackDisabled", trackDisabled);
    participant.on("trackEnabled", trackEnabled);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);



  // Set video track of the participant in video call



  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      // setRemoved(false);
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
    else {
      // setRemoved(true);
    }

  }, [videoTracks]);



  // Set audio track of the participant in video call


  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);
  let height1 = `calc((100vh - 170px)/${height})`;
  let width1 = `calc((100vw - 75px)/${width})`;
  if (reduceWidth) {
    width1 = `calc((100vw - 75px - 310px)/${width})`;
  }
  // if(trackName==='screen'){
  //   height1 = `calc((100vh - 170px))`;
  //   width1 = `calc((100vw - 68px))`;
  // }



  // CSS for making video call responsive


  useEffect(() => {
    if (reduceWidth) {
      if (st) {
        setSt({
          border: "#e8cd41", borderStyle: "solid", borderWidth: "2px", borderRadius: "2%", height: `calc((100vh - 170px))`, width: `calc(100vw - 75px - 300px)`, position: 'fixed', top: 75, left: 30, background: '#000000', zIndex: 1000,
        });
      }
      else {
        setSt();
      }
    }
    else {
      if (st) {
        setSt({
          border: "#e8cd41", borderStyle: "solid", borderWidth: "2px", borderRadius: "2%", height: `calc((100vh - 170px))`, width: `calc(100vw - 60px)`, position: 'fixed', top: 75, left: 30, background: '#000000', zIndex: 1000
        });
      }
      else {
        setSt();
      }
    }
  }, [reduceWidth])




  // Css after screen share in on


  const handleClick = () => {
    console.log("hi");
    if (trackName === 'screen') {
      if (st) {
        setSt();
      }
      else {
        if (reduceWidth) {
          setSt({
            border: "#e8cd41", borderStyle: "solid", borderWidth: "2px", borderRadius: "2%", height: `calc((100vh - 170px))`, width: `calc(100vw - 75px - 300px)`, position: 'fixed', top: 75, left: 30, zIndex: 1000, background: '#000000'
          });
        }
        else {
          setSt({
            border: "#e8cd41", borderStyle: "solid", borderWidth: "2px", borderRadius: "2%", height: `calc((100vh - 170px))`, width: `calc(100vw - 60px)`, position: 'fixed', top: 75, left: 30, zIndex: 1000, background: '#000000'
          });
        }

      }

    }
  }

  return (
    <div className="participant" >
      {/* <h3>{participant.identity.split('!!!')[0]}</h3> */}
      <div style={{ position: 'relative', width: 'fit-content', }}>
        <div style={{ display: 'flex', position: 'absolute', margin: 'auto', top: "10px", right: "10px", color: "gray" }}>
          {isMute ? <MicOffIcon /> : <MicIcon />}
        </div>
        {!removed && <video onClick={handleClick} ref={videoRef} autoPlay={true} style={st ? st : { border: "#e8cd41", borderStyle: "solid", borderWidth: "2px", borderRadius: "2%", width: width1, height: height1 }} />}
        {removed && <div style={{ width: width1, height: height1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', borderStyle: "solid", borderWidth: "2px", borderColor: "#e8cd41", borderRadius: "2%" }}>
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
