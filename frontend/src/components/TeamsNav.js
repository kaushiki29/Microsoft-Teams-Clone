import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TodoList from './TodoList';
import Box from '@material-ui/core/Box';
import GeneralCard from '../components/GeneralCard';
import PostCard from '../components/PostCard';
import Invite from '../components/Invite';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import { api } from '../screen/Helper';
import axios from 'axios';

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#464775',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#464775',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#464775',
            },
            '&:hover fieldset': {
                borderColor: '#464775',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#464775',
            },
        },
    },
})(TextField);

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={4}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        display: "flex",
        paddingBottom: "6%",
        flexDirection: "column",
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "200px",
        paddingBottom: "6%"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    margin: {
        margin: theme.spacing(1),
        paddingBottom: "5%",
        width: "200px"
    },
    tabPanel: {
        backgroundColor: "rgb(245, 245, 245)",
        paddingLeft: "10%",
        paddingRight: "10%",
        marginTop: "13%",
        paddingBottom: "6%"
    },
    meetingStart: {
        fontSize: "12px",
        backgroundColor: "#464775",
        color: "white",
        '&:hover': {
            backgroundColor: "#53548a"
        },
        width: "100px",
        height: "35px"
    },
    paper: {
        backgroundColor: "white",
        border: '2px solid #464775',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: theme.shadows[5],
        padding: "2%",
    },
    footer: {
        position: "fixed",
        bottom: 0,
        backgroundColor: "#f5f5f5",
        width: "100%",
        color: "black",
        height: "90px"
    }
}));

export default function TeamsNav(props) {

    const [val, setVal] = useState(1)
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState(0);
    const [meetName, setMeetName] = useState({
        value: "",
        error: false,
        helperText: ""
    })
    const [date, setDate] = useState({
        value: "",
        error: false,
        helperText: ""

    });
    const [time, setTime] = useState({
        value: "",
        error: false,
        helperText: ""
    });

    const [allUsers, setAllUsers] = useState([])
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
                team_slug: props.team_slug,
            },
            url: api + "teams/get_users",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                setAllUsers(res.data.all_users);
            })
            .catch(err => {
                console.log(err);
            })
    }, [val])
    const reloadValue = () => {
        setVal(val + 1)
    }
    const [openScheduleModal, isScheduleModalOpen] = React.useState(false);
    const [openStartModal, isStartModalOpen] = useState(false);

    const handleStart = () => {

        if (!meetName.value) {
            setMeetName({
                value: meetName.value,
                error: true,
                helperText: "Meeting Name cannot be left blank"
            })
        }
        if (meetName.value) {
            console.log("Submitted");
            handleClose();
            call();

        }

    }

    const handleSchedule = () => {
        if (!meetName.value) {
            setMeetName({
                value: meetName.value,
                error: true,
                helperText: "Meeting Name cannot be left blank"
            })
        }
        if (!date.value) {
            setDate({
                value: date.value,
                error: true,
                helperText: "Date cannot be left blank"
            })
        }
        if (!time.value) {
            setTime({
                value: time.value,
                error: true,
                helperText: "Time cannot be left blank"
            })
        }

        if (meetName.value && date.value && time.value) {
            console.log(date.value + " " + time.value);
            handleCloseScheduleModal();
            schedule();
        }
    }

    const handleClose = () => {
        isStartModalOpen(false);
        setMeetName({
            value: "",
            error: false,
            helperText: ""
        })
    };

    const handleCloseScheduleModal = () => {
        isScheduleModalOpen(false);
        setMeetName({
            value: "",
            error: false,
            helperText: ""
        })
        setTime({
            value: "",
            error: false,
            helperText: ""
        })
        setDate({
            value: "",
            error: false,
            helperText: ""
        })
    }

    const call = () => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
                team_slug: props.team_slug,
                name: meetName.value,
            },
            url: api + "communication/create_call",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data);
                history.push('/videocall/' + res.data.meeting_slug);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const schedule = () => {
        const token = localStorage.getItem("token");
        const scheduleTime = new Date(date.value + " " + time.value).getTime();
        axios({
            method: 'post',
            data: {
                team_slug: props.team_slug,
                name: meetName.value,
                schedule_time: scheduleTime
            },
            url: api + "communication/schedule_call",
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

    const handleMeetName = (e) => {
        setMeetName({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }


    const handleOpenStart = () => {
        isStartModalOpen(!openStartModal)
        setMeetName({
            value: "",
            error: false,
            helperText: ""
        })
        setTime({
            value: "",
            error: false,
            helperText: ""
        })
        setDate({
            value: "",
            error: false,
            helperText: ""
        })
    }

    const handleOpenSchedule = () => {
        isScheduleModalOpen(!openScheduleModal)
        setMeetName({
            value: "",
            error: false,
            helperText: ""
        })
        setTime({
            value: "",
            error: false,
            helperText: ""
        })
        setDate({
            value: "",
            error: false,
            helperText: ""
        })
    }

    const handleDate = (e) => {
        setDate({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }

    const handleTime = (e) => {
        setTime({
            value: e.target.value,
            error: false,
            helperText: ""
        })
    }
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default" style={{ zIndex: "10", position: "fixed", marginTop: "56px", marginBottom: "2%" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"

                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="General" style={{ fontWeight: "bolder" }} />
                    <Tab label="Scheduled Calls" style={{ fontWeight: "bolder" }} />
                    <Tab label="Tasks" style={{ fontWeight: "bolder" }} />
                    <Tab label="Team Participants" style={{ fontWeight: "bolder" }} />

                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} className={classes.tabPanel}>
                {props.allCalls.length > 0 && props.allCalls.map(i =>
                    <GeneralCard call={i} />
                )}
                {props.allCalls.length == 0 &&
                    <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                        <img src="https://slek-react.laborasyon.com/static/media/unselected-chat.cfb49f55.svg" style={{ height: "200px" }} />
                        <div style={{ paddingTop: "2%" }}>Nothing to do!</div>
                    </div>
                }
            </TabPanel>
            <TabPanel value={value} index={1} className={classes.tabPanel}>
                <PostCard />
            </TabPanel>
            <TabPanel value={value} index={2} className={classes.tabPanel}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "5%" }}>
                    <div style={{ backgroundColor: "white", borderRadius: "2%", paddingBottom: "4%" }}>
                        <TodoList allUsers={allUsers} team_slug={props.team_slug} />
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={3} className={classes.tabPanel}>
                <Invite team_slug={props.team_slug} allUsers={allUsers} reloadValue={reloadValue} isAdmin={props.isAdmin} />
            </TabPanel>
            <div className={classes.footer}>
                <Divider style={{ width: "80%" }} />
                <div style={{ paddingTop: "25px", paddingLeft: "10%", paddingRight: "10%" }}>
                    <Button size="small" style={{ width: "150px", marginRight: "2%" }} className={classes.meetingStart} onClick={handleOpenStart}>Start Meeting </Button>
                    <Button size="small" style={{ width: "150px" }} className={classes.meetingStart} onClick={handleOpenSchedule}>Schedule Meeting </Button>
                </div>
            </div>
            <Modal
                className={classes.modal}
                open={openScheduleModal}
                onClose={handleOpenSchedule}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openScheduleModal}>
                    <div className={classes.paper}>
                        <h2 style={{ margin: 0, paddingBottom: "2%" }} >Schedule a Meeting</h2>
                        <CssTextField
                            className={classes.margin}
                            label="Meeting Name"
                            value={meetName.value}
                            error={meetName.error}
                            helperText={meetName.helperText}
                            onChange={handleMeetName} />
                        <TextField
                            name="meetingDate"
                            label="Select a Date"
                            InputLabelProps={{ shrink: true, required: true }}
                            type="date"
                            onChange={handleDate}
                            error={date.error}
                            // value={date.value}
                            helperText={date.helperText}
                            style={{ paddingBottom: "5%", width: "200px" }}
                        // defaultValue="DD-MM-YYYY"
                        />
                        <TextField
                            id="time"
                            label="Select Meeting time"
                            type="time"
                            // defaultValue="HH:MM"
                            onChange={handleTime}
                            error={time.error}
                            helperText={time.helperText}
                            // value= {time.value}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 1200, // 5 min
                            }}
                        />
                        <Button size="small" className={classes.meetingStart} style={{ width: "120px" }} onClick={handleSchedule}>Schedule Now </Button>
                    </div>
                </Fade>
            </Modal>
            <Modal
                className={classes.modal}
                open={openStartModal}
                onClose={handleOpenStart}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openStartModal}>
                    <div className={classes.paper}>
                        <h2 style={{ margin: 0, paddingBottom: "2%" }} >Start a Meeting</h2>
                        <CssTextField
                            className={classes.margin}
                            label="Meeting Name"
                            value={meetName.value}
                            error={meetName.error}
                            helperText={meetName.helperText}
                            onChange={handleMeetName}
                        />
                        <Button size="small" className={classes.meetingStart} onClick={handleStart} style={{ width: "120px" }}>Start Now </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}