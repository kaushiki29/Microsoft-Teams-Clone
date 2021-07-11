import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';


// Css files


const useStyles = makeStyles({
    root: {
        minWidth: 275,
        marginBottom: "7%",
        '@media(max-width: 389px)': {
            minWidth: 200
        },
    },
    header: {
        backgroundColor: "rgb(70, 71, 117)",
    },
    head: {
        display: 'flex',
        alignItems: 'center',
        '@media(max-width: 560px)': {
            flexDirection: "column"
        },
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bolder',
        paddingBottom: '13px',
        color: '#FFFFFF',
        flex: 1,
        '@media(max-width: 560px)': {
            textAlign: "center"
        },
    },
    time: {
        fontSize: 18,
        fontWeight: 'normal',
        paddingBottom: '13px',
        color: '#FFFFFF'
    },
    pos: {
        marginBottom: 12,
    },
    divider: {
        backgroundColor: 'white'
    },
    button: {
        fontSize: "12px",
        backgroundColor: "#464775",
        color: "white",
        width: "100px",
        height: "35px",
        marginTop: 20,
        '&:hover': {
            backgroundColor: "#53548a"
        },
    }
});

export default function SimpleCard(props) {
    const classes = useStyles();
    const history = useHistory();
    const [time, setTime] = useState();

    // Current ongoing call duration


    useEffect(() => {
        setInterval(() => updateSec(), 1000)
    }, [])

    // Handle join video call

    const handleJoin = () => {
        console.log(time);
        history.push('/videocall/' + props.call.meeting_slug);
    }


    const updateSec = () => {

        setTime(new Date());
    }


    const formatTime = () => {

        let t = (new Date().getTime() - props.call.started_at) / 1000;
        let hour = Math.floor(t / 3600);
        if (String(hour).length === 1) {
            hour = "0" + hour;
        }
        let min = Math.floor((t % 3600) / 60);
        if (String(min).length === 1) {
            min = "0" + min;
        }
        let sec = Math.floor(((t % 3600) % 60));
        if (String(sec).length === 1) {
            sec = "0" + sec;
        }

        return (hour + ":" + min + ":" + sec);
    }


    // Handle chat (Persistent chat feature)


    const handleChat = () => {
        history.push('/meeting/conversation/' + props.call.meeting_slug);
    }

    return (
        <Card className={classes.root}>
            <CardContent className={classes.header}>
                <div className={classes.head}>
                    <Typography className={classes.title}>
                        Meeting Started : {props.call.name}
                    </Typography>
                    <Typography className={classes.time}>
                        Call : {formatTime()}
                    </Typography>
                </div>
                <Divider className={classes.divider} />
            </CardContent>
            <CardActions>
                <Button size="small" className={classes.button} onClick={handleJoin} >Join Now </Button>
                <Button size="small" className={classes.button} style={{ width: 125, }} onClick={handleChat} >Conversation </Button>
            </CardActions>
        </Card>
    );
}
