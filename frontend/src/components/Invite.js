import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { api } from '../screen/Helper';
import ChatIcon from '@material-ui/icons/Chat';
import { useHistory } from 'react-router-dom';


// CSS files

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    rootCard: {
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        maxWidth: 280,
        margin: 2,
        alignItems: "center",
        textAlign: "center",
        '@media(max-width: 1108px)': {
            minWidth: 240
        },
        '@media(max-width: 1008px)': {
            minWidth: 240
        },
        '@media(max-width: 651px)': {

        },
    },
    cards: {
        justifyContent: "space-between",
        '@media(max-width: 650px)': {
            justifyContent: "center"
        },

    },
    code: {
        '@media(max-width: 650px)': {
            justifyContent: "center",
            paddingTop: "5%"
        },
    },
    heading: {
        '@media(max-width: 651px)': {
            textAlign: "center"
        },
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));




function Invite(props) {
    const classes = useStyles();
    const history = useHistory();
    const token = localStorage.getItem("token");
    const [email, setEmail] = useState({
        value: "",
        error: false,
        helperText: ""
    });


    // Handle new user to add in team


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
                            props.reloadValue();

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


    // Handle start p2p chat on button click


    const handleInitChat = (username) => {
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
                history.push('/chat/' + res.data.thread_id);

            })
            .catch(err => {
                console.log(err);
            })
    }



    return (
        <div>


            {/* Team Admin - The one who created the team can add participants */}


            {props.isAdmin && (
                <div>
                    <TextField
                        id="standard-basic"
                        label="Type email here"
                        style={{ width: "100%" }}
                        value={email.value}
                        error={email.error}
                        helperText={email.helperText}
                        onChange={handleChange}
                    />
                    <Button variant="contained" color="primary" style={{ marginTop: "2%", height: "33px", backgroundColor: "#464775" }} onClick={handleSubmit}>Add to Team</Button>
                    <div style={{ paddingTop: "2%", display: "flex", paddingBottom: "5%" }} className={classes.code}>
                        Team Code: <div style={{ fontWeight: "bolder" }}>{props.uniqueCode} </div>
                    </div>
                </div>
            )}
            <div>
                <h2 style={{ paddingBottom: "2%" }} className={classes.heading}>Team Participants</h2>
                <div style={{ display: "flex", flexWrap: "wrap" }} className={classes.cards}>
                    {props.allUsers.map((i, index) => {
                        return (
                            <Card className={classes.rootCard}>
                                <CardContent style={{ paddingBottom: 0 }}>
                                    <Typography variant="h5" component="h2" style={{ fontSize: "18px" }}>
                                        {i.name}
                                    </Typography>
                                    <Typography component="h3" style={{ fontSize: "14px" }}>
                                        {i.email}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => { handleInitChat(i.email) }}><ChatIcon /></Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Invite




