import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { api } from './Helper';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '38ch',

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
    useEffect(() => {
        setToken(localStorage.getItem("token"));

    }, [])

    useEffect(() => {
        if (token) {
            history.push("/home");
        }
    }, [token])
    const [cred, setCred] = useState({
        email: "k@1.com",
        password: "pass"
    })
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
            axios({
                method: 'post',
                url: api + "auth/user_login",
                data: {
                    email: email.value,
                    password: password.value,
                },
                headers: {

                }
            })
                .then(res => {
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

    const handleSignup = () => {
        history.push('/signup');
    }
    if (!token) {
        return (
            <div className="login">
                <div className="form">
                    <img src="https://img.icons8.com/fluent/48/000000/microsoft-teams-2019.png" alt="MS-Teams Icon" className={classes.image} />
                    <h1>Sign-In</h1>
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
                        <Button variant="contained" color="primary" onClick={handleLogin}>
                            Sign-In
                        </Button>
                        <Button onClick={handleSignup} color="primary" style={{ display: "grid" }}>
                            No account? <div style={{ fontWeight: "bolder" }}>Create-one</div>
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
