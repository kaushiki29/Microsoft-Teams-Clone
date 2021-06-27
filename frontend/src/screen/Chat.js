import React from 'react'
import Navbar from '../components/Navbar'
import ChatIcon from '@material-ui/icons/Chat';
import CallIcon from '@material-ui/icons/Call';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';
import Sidebar from '../components/Sidebar';

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
        marginTop: "56px"

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

function Chat() {
    const classes = useStyles();
    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
                <Sidebar />
            </div>
            <div className={classes.subComponent} >
                <ChatList />
                <ChatContent />
            </div>
        </div>
    )
}

export default Chat
