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


// CSS style


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
        width: "100px",
        height: "35px",
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


    // Handle Time Format


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


    // Handle delete calls


    const handleDelete = () => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            url: api + "communication/delete_call",
            data: {
                meeting_slug: props.call.meeting_slug
            },
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data)
                props.setScheduleVal(props.scheduleVal + 1)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleChat = () => {
        history.push('/meeting/conversation/' + props.call.meeting_slug);
    }

    const handleGoBack = () => {
        history.push("/teams/" + props.team_slug)
    }


    return (
        <Card className={classes.root} style={{ height: props.style ? props.style.height : "", marginBottom: props.style ? props.style.marginBottom : "" }}>
            <CardContent className={classes.header} style={{ padding: props.style ? props.style.padding : "" }}>
                <div className={classes.head}>
                    <Typography className={classes.title}>
                        Meeting Name : {props.call.name}
                    </Typography>
                </div>
                <div className={classes.header}>
                    <Typography className={classes.time}>
                        Time : {formatAMPM(new Date(props.call.time))}, {new Date(props.call.time).getDate()} {month[new Date(props.call.time).getMonth()]} {new Date(props.call.time).getFullYear()}
                    </Typography>
                </div>
                <Divider className={classes.divider} />
            </CardContent>
            <CardActions style={{ justifyContent: props.style ? props.style.justifyContent : "" }}>
                {props.vc ?
                    <Button size="small" className={classes.button} onClick={handleGoBack} style={{ height: 35, marginTop: props.style ? props.style.marginTop : "" }}>
                        Go back
                    </Button> :
                    <div>
                        <Button className={classes.button} onClick={handleDelete} style={{ marginTop: props.style ? props.style.marginTop : "", marginRight: "5px" }}>
                            Delete call
                        </Button>
                        <Button className={classes.button} style={{ width: 125, marginTop: props.style ? props.style.marginTop : "" }} onClick={handleChat} >
                            Conversation
                        </Button>
                    </div>
                }
            </CardActions>
        </Card>

    )

}

export default ScheduledCalls
