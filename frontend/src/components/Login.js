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
import Tasks from '../screen/Tasks';
import UserVerification from '../screen/UserVerification';
import Call from './P2Pvideocall/Call';

function Login() {

    const [token, setToken] = useState();
    const [verified, isVerified] = useState(false);
    useEffect(() => {
        refreshToken();
    }, [])

    const refreshToken = () => {
        setToken(localStorage.getItem("token"));
    }
    return (
        <Router>
            <Switch>
                <Route path="/login"  ><LoginComp refreshToken={refreshToken} /></Route>
                <Route path="/signup" component={SignupComp} ></Route>
                {localStorage.getItem("token") || token ? <Route path="/home" component={LandingPage} /> : <Redirect to="/login" />}
                {localStorage.getItem("token") || token ? <Route path="/teams/:team_slug" component={TeamScreen} /> : <Redirect to="/login" />}
                {/* <Route path="/videocall/:meeting_slug" component={JitsiCall} /> */}
                <Route path="/chat/:chat_uuid" component={Chat} />
                {/* <Route path="/tasks" component={Tasks} /> */}
                <Route path="/verification" component={Verification} />
                <Route path="/verify/:email_uuid" component={UserVerification} />
                <Route path="/videocall/:meeting_slug" component={TwilioCall} />
                <Route path="/call/:meeting_slug" component={Call} />
                <Route path="*">
                    <Redirect to="/login" />
                </Route>
            </Switch>
        </Router>

    )
}

export default Login
