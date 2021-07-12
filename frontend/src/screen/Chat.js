import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ChatIcon from '@material-ui/icons/Chat';
import CallIcon from '@material-ui/icons/Call';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import ChatList from '../components/ChatList';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatContent from '../components/ChatContent';
import Sidebar from '../components/Sidebar';
import { unmountComponentAtNode, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { api } from './Helper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { messaging } from '../components/Firebase';
import CallerTune from '../static/ringtone.mp3';
import CallModal from '../components/CallModal';



//CSS styles


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
        height: "100vh",
    },

    p: {
        margin: "0",
    },

    sidediv: {
        display: "flex",
        padding: "24%",
        alignItems: "center",
        cursor: "pointer",
        flexDirection: "column",
        '&:hover': {
            backgroundColor: "white",
        }
    },

    subComponent: {
        // alignItems: "center",
        // maxWidth: "90%",
        // minHeight: "94.5vh",
        boxSizing: "border-box",
        display: "flex",
        borderRadius: "10px",
        marginLeft: "68px",
        paddingBottom: 0,
        // justifyContent: "center",
        paddingLeft: 0,
        marginRight: "auto",
        // flexDirection: "column",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        marginTop: "56px",
        '@media(max-width: 600px)': {
            marginLeft: "70px"
        },

    },

    chatImage: {
        width: "350px",
        borderRadius: "2%",
        '@media(max-width: 742px)': {
            width: "300px"
        },
        '@media(max-width: 572px)': {
            width: "250px"
        },
        '@media(max-width: 512px)': {
            width: "200px"
        },
        '@media(max-width: 462px)': {
            width: "180px"
        },
    },

    message: {
        textAlign: "center"
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

    backButton: {
        height: "33px",
        position: 'absolute',
        top: 59,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "2%",
        marginRight: "10px"
    },
}));


//Chat function



function Chat() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const classes = useStyles();
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [chatuuid, setChatuuid] = useState();
    const [chatItms, setChatItms] = useState([]);
    const [otherUserName, setOtherUserName] = useState('');
    const [allChatUsers, setAllChatUsers] = useState([]);
    const [uName, setUName] = useState('');
    const [change, setChange] = useState(0);
    const { chat_uuid } = useParams();
    const [open, setOpen] = useState(false);
    const [audio, setAudio] = useState(new Audio(CallerTune));
    const [callUUID, setCallUUID] = useState();
    const [person, setPerson] = useState();


    useEffect(() => {
        fetchChatList();

        setChatuuid(chat_uuid);
    }, []);



    // Firebase Cloud Messaging setup to fetch
    // chatlist



    messaging.onMessage((payload) => {
        console.log(payload);
        if (payload.data.type === 'msg') {
            fetchChatList();
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



    useEffect(() => {
        setChatItms([]);
        fetchMsgs();
    }, [chatuuid]);



    // API call to fetch all the conversations
    // of a user



    const fetchMsgs = () => {
        if (chatuuid && chatuuid !== 'all-conversations') {
            // console.log(chatuuid)
            axios({
                method: 'post',
                url: api + 'communication/get_thread_messages',
                data: { 'thread_id': chatuuid },
                headers: { Authorization: 'Token ' + token }
            })
                .then(res => {
                    console.log(res.data);
                    setChatItms(res.data.all_msgs);
                    setOtherUserName(res.data.name);
                    setUName(res.data.username)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }



    const handleClose = () => {
        setOpen(false);
        audio.pause();
    }


    const fetchChatList = () => {
        console.log('here fetch')
        axios({
            method: 'post',
            url: api + 'communication/get_all_threads',
            headers: { Authorization: 'Token ' + token }
        })
            .then(res => {
                console.log(res.data);
                let obj = "";
                let all_uuid = res.data.all_uuid.map(i => {
                    if (i.thread_id === chat_uuid) {
                        obj = {
                            active: true,
                            has_unseen_messages: i.has_unseen_messages,
                            other_user: i.other_user,
                            thread_id: i.thread_id,
                            unseen_messages_count: 0,
                            other_user_name: i.other_user_name
                        }
                        return obj;
                        setChange(change + 1);
                    }
                    else {
                        return i;
                    }
                });
                setAllChatUsers(all_uuid);
            })
            .catch(err => {
                console.log(err);
            })
    }




    // Set currently opened chat


    const setCurrChatuuid = (uuid) => {
        if (uuid != chatuuid) {
            setChatuuid(uuid);
            setOtherUserName("");
            history.push('/chat/' + uuid);
            let users = [...allChatUsers];
            for (let i = 0; i < users.length; i++) {
                if (users[i].thread_id === uuid) {
                    users[i].unseen_messages_count = 0;
                    setChange(change + 1);
                }
            }
            setAllChatUsers([...users]);
        }
        // fetchChatList();
    }




    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
                <Sidebar change={change} />
            </div>
            <div style={{ overflowX: 'hidden' }} className={classes.subComponent} >
                {(isMobile && chat_uuid !== 'all-conversations') &&
                    <Button color="primary" className={classes.backButton} onClick={() => { history.push('/chat/all-conversations') }}>
                        <ArrowBackIcon style={{ fontSize: "1rem" }} /> Go Back
                    </Button>
                }
                {(!isMobile || chat_uuid === 'all-conversations') && <ChatList allChatUsers={allChatUsers} setCurrChatuuid={setCurrChatuuid} thread_id={chatuuid} />}
                {otherUserName && (!isMobile || chat_uuid !== 'all-conversations') &&
                    <ChatContent chatItms={chatItms} thread_id={chatuuid} setChatItms={setChatItms} uName={uName} name={otherUserName} />
                }
                {!otherUserName && !isMobile &&
                    <div style={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center", fontSize: "20px", color: "gray", fontWeight: "bold", flexDirection: "column" }}>
                        <img src="https://newyorkcityvoices.org/wp-content/uploads/2020/04/animated-chat-gifs-4.jpg" className={classes.chatImage} />
                        <div className={classes.message}>Please stay connected and continue chatting. </div>
                    </div>}
            </div>
            <CallModal open={open} handleClose={handleClose} text={`Incoming call from ${person}`} answer={`/call/${callUUID}`} />
        </div>
    )
}

export default Chat
