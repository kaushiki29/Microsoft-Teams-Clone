import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../screen/Helper';
import Video from "twilio-video";
import Room from './Room';
import { useParams, useHistory } from 'react-router-dom';
import WarningModal from './WarningModal';

export default function TwilioCall() {
    const history = useHistory();
    const [twilioToken, setTwilioToken] = useState();
    const [teamSlug, setTeamSlug] = useState("");
    const { meeting_slug } = useParams();
    const [room, setRoom] = useState();
    const [open, setOpen] = useState(false);
    const [warningText, setWarningText] = useState("");
    useEffect(() => {
        call();
    }, [])
    const call = () => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
                meeting_slug: meeting_slug
                // name: meetName.value,
            },
            url: api + "communication/get_twilio_token",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data);
                if (res.data.error) {
                    setOpen(true);
                    setWarningText(res.data.error_msg);
                }
                else {
                    setTwilioToken(res.data.access_token);
                    setTeamSlug(res.data.team_slug);

                    Video.connect(res.data.access_token, {
                        name: res.data.meeting_slug,
                    })
                        .then((room) => {
                            //   setConnecting(false);
                            console.log(room);
                            setRoom(room);
                        })
                        .catch((err) => {
                            console.error(err);
                            //   setConnecting(false);
                        });
                }


            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleLogout = () => {
        console.log("logout");
        setRoom((prevRoom) => {
            if (prevRoom) {
                prevRoom.localParticipant.tracks.forEach((trackPub) => {
                    trackPub.track.stop();
                });
                prevRoom.disconnect();
            }
            return null;
        });
        history.push("/teams/" + teamSlug);
    }
    const handleClose = () => {

    }
    return (
        <div style={{ height: "100%" }}>
            <WarningModal open={open} handleClose={handleClose} text={warningText} redirect={"/home"} />
            {room && <Room roomName={meeting_slug} room={room} handleLogout={handleLogout} />}
        </div>
    )
}
