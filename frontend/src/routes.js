import React, { useEffect, useState } from 'react'
import SignupComp from '../src/screen/SignupComp'
import '../src/css/Login.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import LoginComp from '../src/screen/LoginComp';
import TeamScreen from '../src/screen/TeamScreen';
import LandingPage from '../src/screen/LandingPage';
import Chat from '../src/screen/Chat'
import TwilioCall from '../src/components/TwilioCall';
import Call from '../src/components/P2Pvideocall/Call';
import { messaging } from '../src/components/Firebase';
import WarningModal from '../src/components/WarningModal';
import CallModal from '../src/components/CallModal';
import axios from 'axios';
import { api } from '../src/screen/Helper';
import CallerTune from '../src/static/ringtone.mp3';
import { withRouter } from 'react-router-dom';
import Tasks from '../src/screen/Tasks'
import VideoCallChat from '../src/screen/VideoCallChat';

function MainRoute() {
    const [token, setToken] = useState();
    const [open, setOpen] = useState(false);
    const [audio, setAudio] = useState(new Audio(CallerTune));
    const [callUUID, setCallUUID] = useState();
    const [person, setPerson] = useState();


    useEffect(() => {
        refreshToken();
    }, [])


    // Setup of firebase notification

    messaging.onMessage((payload) => {
        console.log(payload);
        if (payload.data.type == 'call') {
            setPerson(payload.data.person);
            setCallUUID(payload.data.uuid);
            setOpen(true);
            audio.play();
            setTimeout(() => {
                setOpen(false);
                setPerson();
                setCallUUID();
                audio.pause();
            }, 20000)
        }
    })



    const refreshToken = () => {
        setToken(localStorage.getItem("token"));

    }
    const handleClose = () => {
        setOpen(false);
        audio.pause();
    }
    return (
        <Router>
            <Switch>
                <Route path="/login"  ><LoginComp refreshToken={refreshToken} /></Route>
                <Route path="/signup" ><SignupComp refreshToken={refreshToken} /></Route>
                {(localStorage.getItem("token") || token) ? <Route path="/teams/:team_slug" component={TeamScreen} /> : <Redirect to="/login" />}
                {(localStorage.getItem("token") || token) ? <Route path="/home" component={LandingPage} /> : <Redirect to="/login" />}
                <Route path="/chat/:chat_uuid" component={Chat} />
                <Route path="/videocall/:meeting_slug" component={TwilioCall} />
                <Route path="/meeting/conversation/:meeting_slug" component={VideoCallChat} />
                <Route path="/call/:meeting_slug" component={Call} />
                <Route path="*">
                    <Redirect to="/login" />
                </Route>
            </Switch>
            <CallModal open={open} handleClose={handleClose} text={`Incoming call from ${person}`} answer={`/call/${callUUID}`} />
        </Router>
    )


}

export default withRouter(MainRoute);
