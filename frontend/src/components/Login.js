import React, { useEffect, useState } from 'react'
import SignupComp from '../screen/SignupComp'
import '../css/Login.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import LoginComp from '../screen/LoginComp';
import TeamScreen from '../screen/TeamScreen';
import LandingPage from '../screen/LandingPage';
import Chat from '../screen/Chat'
import TwilioCall from './TwilioCall';
import Verification from '../screen/Verification';
import UserVerification from '../screen/UserVerification';
import Call from './P2Pvideocall/Call';
import {messaging} from './Firebase';
import WarningModal from './WarningModal';
import CallModal from './CallModal';
import CallerTune from '../static/telephone-ring-02.mp3';
import { withRouter } from 'react-router-dom';

function Login() {
    const [token, setToken] = useState();
    const [verified, isVerified] = useState(false);
    const [open,setOpen] = useState(false);
    const [audio,setAudio] = useState(new Audio(CallerTune));
    const [callUUID,setCallUUID] = useState();
    const [person,setPerson] = useState();
    useEffect(() => {
        refreshToken();        
    }, [])
    messaging.onMessage((payload) => {
        console.log(payload);
        if(payload.data.type=='call'){
            setPerson(payload.data.person);
            setCallUUID(payload.data.uuid);
            setOpen(true);
            audio.play();
            setTimeout(()=>{
                setOpen(false);
                setPerson();
                setCallUUID();
                audio.pause();
            },20000)
        }
    })
    const refreshToken = () => {
        setToken(localStorage.getItem("token"));
    }
    const handleClose=()=>{
        setOpen(false);
        audio.pause();
    }
    return (
            <Router>
                <Switch>
                    <Route path="/login"  ><LoginComp refreshToken={refreshToken} /></Route>
                    <Route path="/signup" component={SignupComp} ></Route>
                    <Route path="/verify/:email_uuid"><UserVerification refreshToken={refreshToken} /></Route>
                    {localStorage.getItem("token") || token ? <Route path="/home" component={LandingPage} /> : <Redirect to="/login" />}
                    {localStorage.getItem("token") || token ? <Route path="/teams/:team_slug" component={TeamScreen} /> : <Redirect to="/login" />}
                    <Route path="/chat/:chat_uuid" component={Chat} />
                    <Route path="/verification" component={Verification} />
                    <Route path="/videocall/:meeting_slug" component={TwilioCall} />
                    <Route path="/call/:meeting_slug" component={Call} />
                    <Route path="*">
                        <Redirect to="/login" />
                    </Route>
                </Switch>
                <CallModal open={open} handleClose={handleClose} text={`Incoming call from ${person}`} answer={`/call/${callUUID}`}/>
            </Router>
    )
}

export default withRouter(Login);
