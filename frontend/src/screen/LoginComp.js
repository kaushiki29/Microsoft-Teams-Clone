import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { api } from './Helper';
import ReCAPTCHA from "react-google-recaptcha";
import { getToken } from '../components/Firebase';


//CSS Styles


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            // width: '38ch',

        },
    },

    image: {
        width: "99px",
        height: "99px",
    }
}));



function LoginComp(props) {
    const classes = useStyles();
    const history = useHistory();
    const [token, setToken] = useState();
    const [isTokenFound, setTokenFound] = useState();
    const [isVerified, setVerified] = useState(process.env.REACT_APP_DJANGO_URL?true:false);
    const [email, setEmail] = useState({
        value: "",
        error: false,
        helperText: ""
    });
    const [password, setPassword] = useState({
        value: "",
        error: false,
        helperText: ""
    });

    getToken(setTokenFound);


    // Set token on login

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [])



    // If token exists, redirect to homepage

    useEffect(() => {
        if (token) {
            history.push("/home");
        }
    }, [token])



    // Handle email and password


    const handleEmail = (e) => {
        setEmail({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }
    const handlePassword = (e) => {
        setPassword({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }



    //Handle login

    const handleLogin = () => {
        if (!email.value) {
            setEmail({
                value: email.value,
                error: true,
                helperText: "Email cannot be left blank"
            })
        }
        if (!password.value) {
            setPassword({
                value: password.value,
                error: true,
                helperText: "Password cannot be left blank"
            })
        }
        if (email.value && password.value) {
            console.log(email.value, password.value)
            axios({
                method: 'post',
                url: api + "auth/user_login",
                data: {
                    email: email.value,
                    password: password.value,
                    fcm_token: isTokenFound,
                },
                headers: {

                }
            })
                .then(res => {
                    console.log(res)
                    if (res.data.token) {
                        localStorage.setItem("token", res.data.token);
                        props.refreshToken();
                        history.push("/home");
                    }
                    else {
                        setEmail({
                            value: email.value,
                            error: true,
                            helperText: "Check your Email/Password"
                        });
                        setPassword({
                            value: password.value,
                            error: true,
                            helperText: "Check your Email/Password"
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        else {
            setEmail({
                value: email.value,
                error: true,
                helperText: "Invalid email or password"
            });
            setPassword({
                value: password.value,
                error: true,
                helperText: "Invalid email or password"
            })
        }

    }


    // Handle Captcha

    const handleCaptcha = (value) => {
        setVerified(true);
    }

    const handleSignup = () => {
        history.push('/signup');
    }



    if (!token) {
        return (
            <div className="login">
                <div className="form">
                    <img src="https://img.icons8.com/fluent/48/000000/microsoft-teams-2019.png" alt="MS-Teams Icon" className={classes.image} />
                    <h1 style={{ margin: 0, marginTop: "3%", marginBottom: "3%" }}>Sign-In</h1>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            type="email"
                            name="email"
                            error={email.error}
                            helperText={email.helperText}
                            onChange={handleEmail}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            error={password.error}
                            helperText={password.helperText}
                            onChange={handlePassword}
                        />
                        {!process.env.REACT_APP_DJANGO_URL &&
                        <ReCAPTCHA
                            sitekey="6Leib2QbAAAAAECYwqLcdJ2SEhQFE4KSfRORWIA2"
                            onChange={handleCaptcha}
                        />
                        }
                        <Button variant="contained" color="primary" onClick={handleLogin} disabled={!isVerified}>
                            Sign-In
                        </Button>
                        <Button onClick={handleSignup} color="primary" style={{ display: "grid" }}>
                            <div>No account? </div>
                            <div style={{ fontWeight: "bolder" }}>Create one!</div>
                        </Button>
                    </form>
                </div>
            </div>

        );
    }
    else {
        return (
            <div>

            </div>
        )
    }
}

export default LoginComp
