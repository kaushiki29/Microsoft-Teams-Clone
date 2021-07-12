import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import '../css/Login.css'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { api } from './Helper';
import ReCAPTCHA from "react-google-recaptcha";


// CSS style

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            // width: '38ch',

        },
        image: {
            width: "99px",
            height: "99px",
        }
    },
}));



function SignupComp(props) {
    const classes = useStyles();
    const history = useHistory();
    const [isVerified, setVerified] = useState(process.env.REACT_APP_DJANGO_URL ? true : false);
    const [firstName, setFirstName] = useState({
        value: "",
        error: false,
        helperText: ""
    });
    const [lastName, setLastName] = useState({
        value: "",
        error: false,
        helperText: ""
    });
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
    const [confirmPass, setConfirmPass] = useState({
        value: "",
        error: false,
        helperText: ""
    });



    const handleFirstName = (e) => {
        setFirstName({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }


    const handleLastName = (e) => {
        setLastName({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }


    const handleEmail = (e) => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (e.target.value !== "") {
            if (!pattern.test(e.target.value)) {
                setEmail({
                    value: e.target.value,
                    error: true,
                    helperText: "Please enter valid email address."
                })
            }
            else {
                setEmail({
                    value: e.target.value,
                    helperText: "",
                    error: false
                })
            }
        }

    }


    const handlePassword = (e) => {
        if (confirmPass.value === "") {
            setPassword({
                value: e.target.value,
                error: false,
                helperText: ""
            })
        }

        else if (confirmPass.value !== "" && confirmPass.value === e.target.value) {
            setPassword({
                value: e.target.value,
                error: false,
                helperText: ""
            })
            setConfirmPass({
                value: confirmPass.value,
                error: false,
                helperText: ""
            })
        }
        else if (confirmPass.value !== "" && confirmPass.value !== e.target.value) {
            console.log(confirmPass.value)
            console.log("OK");
            setPassword({
                value: e.target.value,
                error: false,
                helperText: ""
            })
            setConfirmPass({
                value: confirmPass.value,
                error: true,
                helperText: "Confirm password does not match password"
            })
        }

    }


    const handleConfirmPassword = (e) => {
        if (e.target.value === "") {
            setConfirmPass({
                value: e.target.value,
                error: false,
                helperText: ""
            })
        }
        if (e.target.value !== password.value && e.target.value !== "") {
            setConfirmPass({
                value: e.target.value,
                error: true,
                helperText: "Confirm password does not match password"
            })
        }
        else if (e.target.value === password.value) {
            setConfirmPass({
                value: e.target.value,
                error: false,
                helperText: ""
            })
        }

    }



    const handleSubmit = () => {
        console.log("Reached signup");
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!firstName.value) {
            setFirstName({
                value: firstName.value,
                error: true,
                helperText: "First Name cannot be left blank"
            })
        }
        if (!lastName.value) {
            setLastName({
                value: lastName.value,
                error: true,
                helperText: "Last Name cannot be left blank"
            })
        }
        if (!email.value) {
            setEmail({
                value: email.value,
                error: true,
                helperText: "Email cannot be left blank"
            })
        }
        if (!pattern.test(email.value)) {
            setEmail({
                value: email.value,
                error: true,
                helperText: "Enter a valid email address"
            })
        }
        if (!password.value) {
            setPassword({
                value: password.value,
                error: true,
                helperText: "Password cannot be left blank"
            })
        }
        if (!confirmPass.value) {
            setConfirmPass({
                value: confirmPass.value,
                error: true,
                helperText: "Password cannot be left blank"
            })
        }
        if (firstName.value && lastName.value && email.value && password.value && confirmPass.value && confirmPass.value == password.value) {
            axios({
                method: 'post',
                url: api + 'auth/signup',
                data: {
                    first_name: firstName.value,
                    last_name: lastName.value,
                    email: email.value,
                    password: password.value,
                },
                headers: {

                }
            })
                .then(res => {
                    console.log(res);
                    if (res.data.error) {
                        setEmail({
                            value: email.value,
                            error: true,
                            helperText: res.data.message
                        })
                    }
                    else {
                        localStorage.setItem("token", res.data.token);
                        console.log("Signup success")
                        props.refreshToken();
                        history.push('/home');
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    const handleCaptcha = (value) => {
        // console.log("Captcha value:", value);
        setVerified(true);
    }


    const handleLogin = () => {
        history.push("/login");
    }


    return (
        <div className="login">
            <div className="form">
                <img src="https://img.icons8.com/fluent/48/000000/microsoft-teams-2019.png" alt="MS-Teams Icon" className="image" />
                <h1 style={{ margin: 0, marginTop: "3%", marginBottom: "3%" }}>Sign-Up</h1>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                        id="outlined-basic"
                        label="First Name"
                        variant="outlined"
                        type="text"
                        name="firstName"
                        error={firstName.error}
                        helperText={firstName.helperText}
                        onChange={handleFirstName} />
                    <TextField
                        id="outlined-basic"
                        label="Last Name"
                        variant="outlined"
                        type="text"
                        name="lastName"
                        error={lastName.error}
                        helperText={lastName.helperText}
                        onChange={handleLastName} />
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        type="email"
                        name="email"
                        onChange={handleEmail}
                        error={email.error}
                        helperText={email.helperText} />
                    <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        name="password"
                        onChange={handlePassword}
                        error={password.error}
                        helperText={password.helperText} />
                    <TextField
                        id="outlined-basic"
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        name="confirmPassword"
                        onChange={handleConfirmPassword}
                        error={confirmPass.error}
                        helperText={confirmPass.helperText} />
                    {!process.env.REACT_APP_DJANGO_URL &&
                        <ReCAPTCHA
                            sitekey="6Leib2QbAAAAAECYwqLcdJ2SEhQFE4KSfRORWIA2"
                            onChange={handleCaptcha}
                        />
                    }
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!isVerified}>
                        Sign-Up
                    </Button>
                    <Button onClick={handleLogin} color="primary" style={{ display: "grid" }} >
                        Already a member? <div style={{ fontWeight: "bolder" }}> Login here</div>
                    </Button>
                </form>
            </div>
        </div>

    );
}

export default SignupComp;