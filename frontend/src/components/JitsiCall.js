import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import axios from 'axios';
import { api } from '../screen/Helper'
import WarningModal from './WarningModal';


export default function JitsiCall(props) {
    const history = useHistory();
    const [jitsi, setJitsi] = React.useState();
    const [userName, setUserName] = useState("");
    const [teamSlug, setTeamSlug] = useState("");
    const [permission, setPermission] = useState(false);
    const [meetingName, setMeetingName] = useState("");
    const { meeting_slug } = useParams();
    const [open, setOpen] = useState(false);
    const loadJitsiScript = () => {
        let resolveLoadJitsiScriptPromise = null;

        const loadJitsiScriptPromise = new Promise((resolve) => {
            resolveLoadJitsiScriptPromise = resolve;
        });

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = resolveLoadJitsiScriptPromise
        document.body.appendChild(script);

        return loadJitsiScriptPromise;
    };
    const initialiseJitsi = async () => {
        if (!window.JitsiMeetExternalAPI) {
            await loadJitsiScript();
        }

        const _jitsi = new window.JitsiMeetExternalAPI("meet.jit.si", {
            parentNode: document.getElementById("jitsicall"),
            roomName: meeting_slug,
            userInfo: {
                // email: 'email@jitsiexamplemail.com',
                displayName: userName
            },
            configOverwrite: {
                toolbarButtons: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'shareaudio', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'shortcuts',
                    'tileview', 'select-background', 'mute-everyone', 'mute-video-everyone', 'security'
                ],
                defaultLanguage: 'en',
            }
        });

        setJitsi(_jitsi)
    };

    useEffect(() => {
        if (jitsi) {
            jitsi.on('videoConferenceLeft', () => {
                console.log("here left the call");
                jitsi.dispose();
                history.push("/teams/" + teamSlug);
            })
            jitsi.addEventListener('passwordRequired', () => {
                jitsi.executeCommand('password', "dsvbfinldskjhgsad");
            });

            // when local user has joined the video conference 
            jitsi.addEventListener('videoConferenceJoined', (response) => {
                jitsi.executeCommand('password', "dsvbfinldskjhgsad");
                // add code for adding videocall participant.
            });
            
        }
    }, [jitsi])

    React.useEffect(() => {
        checkPermissions();


        return () => jitsi?.dispose?.();
    }, []);
    const handleClose = () => {
        console.log("close");
    }
    const checkPermissions = () => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
                meeting_slug: meeting_slug,
            },
            url: api + "communication/check_permissions",
            headers: {
                Authorization: "Token " + token
            }
        })
        .then(res => {
            console.log(res.data);
            setUserName(res.data.user_name);
            setTeamSlug(res.data.team_slug);
            setPermission(res.data.has_permissions);
            setMeetingName(res.data.meeting_name);
            if (res.data.has_permissions) {
                initialiseJitsi();
            }
            else {
                setOpen(true);
            }
            // initialiseJitsi();
        })
        .catch(err => {
            console.log(err);
        })
    }



    return (
        <React.Fragment>
            <WarningModal open={open} handleClose={handleClose} text={"You are not authorized to join this call"} redirect={"/home"} />
            <div id="jitsicall" style={{ height: "100vh", width: "100vw" }}>

            </div>
        </React.Fragment>
    )
}
