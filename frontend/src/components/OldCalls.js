import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { api } from '../screen/Helper'


// CSS Style

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
        width: "125px",
        height: "40px",
        marginTop: 20,

        '&:hover': {
            backgroundColor: "#53548a"
        },
    }
});

function ScheduledCalls(props) {
    const classes = useStyles();
    const history = useHistory();


    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const handleChat = () => {
        history.push('/meeting/conversation/' + props.call.meeting_slug)
    }

    return (
        <Card className={classes.root}>
            <CardContent className={classes.header}>
                <div className={classes.head}>
                    <Typography className={classes.title}>
                        Meeting Name : {props.call.name}
                    </Typography>
                </div>
                <div className={classes.header}>
                    <Typography className={classes.time}>
                        Started at: {formatAMPM(new Date(props.call.time))}, {new Date(props.call.time).getDate()} {month[new Date(props.call.time).getMonth()]} {new Date(props.call.time).getFullYear()} <span style={{ marginLeft: 10, color: 'gainsboro', fontSize: 14 }}>(Meeting ended)</span>
                    </Typography>
                </div>
                <Divider className={classes.divider} />
            </CardContent>
            <CardActions>
                <Button className={classes.button} onClick={handleChat}>Conversation</Button>
            </CardActions>
        </Card>

    )

}

export default ScheduledCalls
