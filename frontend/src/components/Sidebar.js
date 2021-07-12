import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleIcon from '@material-ui/icons/People';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import CallIcon from '@material-ui/icons/Call';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { api } from '../screen/Helper';
import { messaging } from './Firebase';
import CallerTune from '../static/ringtone.mp3';
import CallModal from './CallModal';


//CSS 

const useStyles = makeStyles((theme) => ({
    sidebar: {
        width: "68px",
        boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ebebeb",
        color: "#6264a7",
        alignItems: "center",
        position: "fixed",
        left: "0",
        top: "56px",
        height: "100vh",
    },

    p: {
        margin: "0",
    },

    sidediv: {
        display: "flex",
        padding: "24%",
        width: "68px",
        alignItems: "center",
        cursor: "pointer",
        flexDirection: "column",
        '&:hover': {
            backgroundColor: "white",
        }
    },

    subComponent: {
        // alignItems: "center",
        maxWidth: "90%",
        minHeight: "94.5vh",
        boxSizing: "border-box",
        display: "flex",
        borderRadius: "10px",
        width: "100%",
        marginLeft: "68px",
        // justifyContent: "center",
        paddingLeft: 0,
        marginRight: "auto",
        // flexDirection: "column",
        backgroundColor: "#f5f5f5",
        padding: "20px"

    },

    webkitScrollbar: {
        width: "5px",
    },

    webkitScrollbarTrack: {
        backgroundColor: "#f1f1f1"
    },

    webkitScrollbarThumb: {
        backgroundColor: "purple",
        borderRadius: "10px"
    },


}));

function Sidebar() {
    const classes = useStyles();
    const history = useHistory();
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [audio, setAudio] = useState(new Audio(CallerTune));
    const [callUUID, setCallUUID] = useState();
    const [person, setPerson] = useState();
    const params = useParams();


    useEffect(() => {
        fetchCount();
    }, []);



    // Handling firebase notification
    // of both calls and messages


    if (!params.chat_uuid) {
        messaging.onMessage((payload) => {
            console.log(payload);
            if (payload.data.type === 'msg') {
                fetchCount();
            }
            else if (payload.data.type === 'call') {
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
    }


    // Function to handle Unseen
    // message count


    const fetchCount = () => {
        axios({
            method: 'post',
            url: api + 'communication/get_unseen_count',
            headers: { Authorization: 'Token ' + localStorage.getItem('token') }
        })
            .then(res => {
                console.log(res.data);
                setCount(res.data.count);
            })
            .catch(err => {
                console.log(err);
            })
    }


    const handleTeams = () => {
        history.push('/home')
    }


    const handleChat = () => {
        history.push('/chat/all-conversations')
    }


    const handleClose = () => {
        setOpen(false);
        audio.pause();
    }


    return (
        <div className={classes.sidebar}>
            <div className={classes.sidediv} onClick={handleTeams}>
                <PeopleIcon style={{ fontSize: "1.5rem", }} />
                <p className={classes.p}>Teams</p>
            </div>
            <div className={classes.sidediv} onClick={handleChat}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ChatIcon style={{ fontSize: "1.5rem", }} />
                    {count > 0 && !params.chat_uuid && <div style={{ width: 15, height: 15, backgroundColor: 'red', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ margin: 0, color: 'white', fontSize: 10 }}>{count > 99 ? '99+' : count}</p></div>}
                </div>
                <p className={classes.p}>Chitchat</p>
            </div>
            <CallModal open={open} handleClose={handleClose} text={`Incoming call from ${person}`} answer={`/call/${callUUID}`} />
        </div>
    )
}

export default Sidebar
