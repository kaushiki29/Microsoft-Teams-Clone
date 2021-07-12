import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TodoList from './TodoList';
import Box from '@material-ui/core/Box';
import GeneralCard from '../components/GeneralCard';
import ScheduledCalls from './ScheduledCalls';
import Invite from '../components/Invite';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import { api } from '../screen/Helper';
import axios from 'axios';
import TeamChat from './TeamChat';
import OldCalls from './OldCalls';


// CSS Styles


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});


// Dialog box styling


const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


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



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        // display: "flex",
        // paddingBottom: "6%",
        // flexDirection: "column",
    },
    tabPanelFrame: {
        '@media(max-width: 1030px)': {
            padding: 0
        },
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
        // marginTop: "108px",
        paddingTop: "31px",
        marginBottom: "91px",
        // paddingBottom: "6%",
        '@media(max-width: 550px)': {
            paddingLeft: 0,
            paddingRight: 0,
        }
    },
    tab: {
        fontWeight: "bolder",
        paddingLeft: 0,
        minWidth: "140px",
        '@media(max-width: 1227px)': {
            minWidth: "120px"
        },
        '@media(max-width: 1143px)': {
            minWidth: "90px"
        },
        '@media(max-width: 1048px)': {
            minWidth: "50px"
        },
        '@media(max-width: 987px)': {
            minWidth: "30px"
        }
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
    },
    tabsPhone: {
        height: "45px",
        alignItems: "center"
    },

    footer1: {
        paddingTop: "25px",
        paddingLeft: "10%",
        paddingRight: "10%",
        '@media(max-width: 468px)': {
            paddingLeft: "0%"
        },
        '@media(max-width: 378px)': {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "10px"
        },
    },

    startMediaQuery: {
        width: "150px",
        marginRight: "2%",
        fontSize: "12px",
        backgroundColor: "#464775",
        color: "white",
        '&:hover': {
            backgroundColor: "#53548a"
        },
        width: "150px",
        height: "35px",
        '@media(max-width: 378px)': {
            marginRight: 0,
            width: "150px",
            marginBottom: "2px"
        }
    },

}));



// Function for handling Tabs
// Taken from Material UI



function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
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

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}


// Teams Nav function


export default function TeamsNav(props) {
    const options = {
        chat: 0,
        general: 1,
        old_calls: 2,
        scheduled_calls: 3,
        tasks: 4,
        participants: 5,
    }
    const [val, setVal] = useState(1)
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState(0);
    const [username, setUsername] = useState();
    const [openScheduleModal, isScheduleModalOpen] = useState(false);
    const [openStartModal, isStartModalOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [scheduleVal, setScheduleVal] = useState(1);
    const [scheduledCalls, setScheduledCalls] = useState([])
    const [oldCalls, setOldCalls] = useState([]);
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


    // Fetch all the users of the team


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (window.location.hash.substr(1) && options[window.location.hash.substr(1)]) {
            setValue(options[window.location.hash.substr(1)]);
        }
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



    // Fetch username from the backend



    useEffect(() => {
        const token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: api + "auth/get_username",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data);
                setUsername(res.data.username)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])



    const getKeyByValue = (object, value) => {
        return Object.keys(object).find(key => object[key] === value);
    }


    // Real time rendering for list of users


    const reloadValue = () => {
        setVal(val + 1);
    }


    // Handle Error modal


    const handleErrorOpen = () => {
        setErrorOpen(true);
    };
    const handleErrorClose = () => {
        setErrorOpen(false);
    };


    // Handle Start Meeting functionality


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


    // Handle Schedule Meeting functionality


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
            schedule();
            handleCloseScheduleModal();

        }
    }



    // Handle close Start Meeting Modal


    const handleClose = () => {
        isStartModalOpen(false);
        setMeetName({
            value: "",
            error: false,
            helperText: ""
        })
    };



    // Handle close Scheduled meeting modal


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



    // Function to create a new call
    // when start meeting button is clicked



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


    // Function to schedule a call


    const schedule = () => {
        const token = localStorage.getItem("token");
        const scheduleTime = new Date(date.value + " " + time.value).getTime();
        if (scheduleTime - new Date().getTime() > 0) {
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
                    reloadScheduleCalls();
                })
                .catch(err => {
                    console.log(err);
                })
        }
        else {
            console.log("error")
            handleErrorOpen()
        }
    }



    // Fetch a list of all the scheduled calls


    useEffect(() => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
                team_slug: props.team_slug
            },
            url: api + "communication/get_scheduled_calls",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data.scheduled_calls);
                setScheduledCalls(res.data.scheduled_calls.reverse());
                setOldCalls(res.data.old_calls);
            })
            .catch(err => {
                console.log(err);
            })
    }, [scheduleVal])



    // For real-time rendering of scheduled calls

    const reloadScheduleCalls = () => {
        setScheduleVal(scheduleVal + 1);
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
        var url_ob = new URL(document.URL);
        url_ob.hash = '#' + getKeyByValue(options, newValue);
        var new_url = url_ob.href;
        document.location.href = new_url;
    }



    // Handle Start Meeting Modal


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


    // Handle Schedule Meeting Modal



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

            {/* Tabs inside the team page */}

            <AppBar position="static" color="default" style={{ zIndex: "10", position: "fixed", marginTop: "56px", marginBottom: "2%" }} className={classes.appbar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    className={classes.tabsPhone}
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Conversation" className={classes.tab} />
                    <Tab label="General" className={classes.tab} />
                    <Tab label="Call-Log" className={classes.tab} />
                    <Tab label="Scheduled-Calls" className={classes.tab} />
                    <Tab label="Tasks" className={classes.tab} />
                    <Tab label="Team-Participants" className={classes.tab} />

                </Tabs>
            </AppBar>

            {/* List of the tabs, here 5 tabs */}


            {/* Conversations Tab */}

            <TabPanel value={value} index={0} className={classes.tabPanel} >
                {username && <TeamChat name={username} style={{ paddingBottom: "10px" }} />}
            </TabPanel>


            {/* General Tab */}

            <TabPanel value={value} index={1} className={classes.tabPanel} style={{ paddingTop: "91px" }}>
                {props.allCalls.length > 0 && props.allCalls.map(i =>
                    <GeneralCard call={i} />
                )}
                {props.allCalls.length == 0 &&
                    <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                        <img src="https://slek-react.laborasyon.com/static/media/unselected-chat.cfb49f55.svg" style={{ height: "200px" }} />
                        <div style={{ paddingTop: "2%", color: "gray" }}>Nothing to do!</div>
                    </div>
                }
            </TabPanel>


            {/* Call Logs Tab */}

            <TabPanel value={value} index={2} className={classes.tabPanel} style={{ paddingTop: "91px" }}>
                {oldCalls.map(i => <OldCalls call={i} scheduleVal={scheduleVal} setScheduleVal={setScheduleVal} />)}
                {oldCalls.length == 0 &&
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src="https://www.kindpng.com/picc/m/58-585203_graphic-with-table-and-four-people-sitting-around.png" style={{ height: "200px" }} />
                        <div style={{ paddingTop: "2%", color: "gray" }}>No Old meeting!</div>
                    </div>
                }
            </TabPanel>


            {/* Scheduled Calls Tab */}

            <TabPanel value={value} index={3} className={classes.tabPanel} style={{ paddingTop: "91px" }}>
                {scheduledCalls.map(i => <ScheduledCalls call={i} scheduleVal={scheduleVal} setScheduleVal={setScheduleVal} />)}
                {scheduledCalls.length == 0 &&
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src="https://uiillustrations.net/wp-content/uploads/2020/11/Screenshot-371-1024x792.png" style={{ height: "200px", borderRadius: "5%" }} />
                        <div style={{ paddingTop: "2%", color: "gray" }}>No scheduled meeting!</div>
                    </div>
                }
            </TabPanel>


            {/* Tasks tab */}


            <TabPanel value={value} index={4} className={classes.tabPanel} style={{ paddingTop: "91px" }}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", }}>
                    <div style={{ backgroundColor: "white", borderRadius: "2%", paddingBottom: "4%" }}>
                        <TodoList allUsers={allUsers} team_slug={props.team_slug} />
                    </div>
                </div>
            </TabPanel>


            {/* Team Participants tab */}


            <TabPanel value={value} index={5} className={classes.tabPanel} style={{ paddingTop: "91px" }}>
                <Invite team_slug={props.team_slug} allUsers={allUsers} reloadValue={reloadValue} isAdmin={props.isAdmin} uniqueCode={props.uniqueCode} />
            </TabPanel>





            {/* Fixed footer inside the teams screen */}


            <div className={classes.footer}>
                <Divider style={{ width: "80%" }} />
                <div style={{}} className={classes.footer1}>
                    <Button size="small" className={classes.startMediaQuery} onClick={handleOpenStart}>Start Meeting </Button>
                    <Button size="small" style={{ width: "150px" }} className={classes.meetingStart} onClick={handleOpenSchedule}>Schedule Meeting </Button>
                </div>
            </div>


            {/* Schedule call modal */}

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


            {/* Start a new call modal */}


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


            {/* Invalid date dialog box */}


            <Dialog onClose={handleErrorClose} aria-labelledby="customized-dialog-title" open={errorOpen}>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        You are selecting a past date or time, please try again with different date or time!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleErrorClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}