import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { api } from '../screen/Helper'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
}));

function Invite(props) {
    const classes = useStyles();
    const token = localStorage.getItem("token");
    const [email, setEmail] = useState({
        value: "",
        error: false,
        helperText: ""
    });

    const handleSubmit = () => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!email.value) {
            setEmail({
                value: email.value,
                error: true,
                helperText: "Please enter valid email address."
            })
        }
        else {
            if (!pattern.test(email.value)) {
                setEmail({
                    value: email.value,
                    error: true,
                    helperText: "Please enter valid email address."
                })
            }
            else {
                console.log("submitted")
                axios({
                    method: 'post',
                    data: {
                        team_slug: props.team_slug,
                        email: email.value
                    },
                    url: api + "teams/invite_member",
                    headers: {
                        Authorization: "Token " + token
                    }
                })
                    .then(res => {
                        console.log(res.data);
                        if (res.data.error) {
                            setEmail({
                                value: email.value,
                                error: true,
                                helperText: res.data.message
                            })
                        }
                        else {
                            setEmail({
                                value: "",
                                error: false,
                                helperText: ""
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }

    const handleChange = (e) => {
        // console.log(e.target.value);
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

    const handleInitChat=(username)=>{
        axios({
            method: 'post',
            data: {
                receiver_username: username
            },
            url: api + "communication/init_chat",
            headers: {
                Authorization: "Token " + token
            }
        })
        .then(res => {
            console.log(res.data);
            
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <div>
                <TextField
                    id="standard-basic"
                    label="Type email here"
                    style={{ width: "100%" }}
                    // value={email.value}
                    error={email.error}
                    helperText={email.helperText}
                    onChange={handleChange}
                />
                <Button variant="contained" color="primary" style={{ marginTop: "2%", height: "33px", backgroundColor: "#464775" }} onClick={handleSubmit}>Add to Team</Button>
            </div>
            <div>
                <h2 style={{ paddingTop: "5%", paddingBottom: "2%" }}>Team Participants</h2>
                {props.allUsers.map((i, index) => {
                    return (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px" }}>
                            <div>{i.name}</div>
                            <div>{i.email}</div>
                            <div style={{margin: 0,cursor: 'pointer'}} onClick={()=>{handleInitChat(i.email)}}>Message</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Invite
