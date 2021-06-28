import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleIcon from '@material-ui/icons/People';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import CallIcon from '@material-ui/icons/Call';
import { useHistory } from 'react-router-dom';

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

    const handleTeams = () => {
        history.push('/home')
    }

    const handleChat = () => {
        history.push('/chat/all-conversations')
    }

    return (
        <div className={classes.sidebar}>
            <div className={classes.sidediv} onClick={handleTeams}>
                <PeopleIcon style={{ fontSize: "1.5rem", }} />
                <p className={classes.p}>Teams</p>
            </div>
            <div className={classes.sidediv} onClick={handleChat}>
                <ChatIcon style={{ fontSize: "1.5rem", }} />
                <p className={classes.p}>Chitchat</p>
            </div>
        </div>
    )
}

export default Sidebar
