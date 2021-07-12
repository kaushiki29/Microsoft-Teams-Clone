import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import CallIcon from '@material-ui/icons/Call';
import Button from '@material-ui/core/Button';
import PeopleIcon from '@material-ui/icons/People';
import { useParams } from 'react-router-dom';
import TeamsNav from '../components/TeamsNav';
import { api } from '../screen/Helper';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import WarningModal from '../components/WarningModal';


// CSS Styles


const useStyles = makeStyles((theme) => ({
    sidebar: {
        width: "68px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ebebeb",
        color: "#6264a7",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        alignItems: "center",
        position: "fixed",
        left: "0",
        height: "100vh",
    },

    newSideDiv: {
        marginLeft: "68px",
        marginTop: "56px",
        width: "320px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        backgroundColor: "#e8e8e894",
        overflow: "overlay",
        position: "fixed",
        display: "flex",
        height: "100vh",
        '@media(max-width: 990px)': {
            width: "270px"
        },
        '@media(max-width: 930px)': {
            width: "250px"
        },
        '@media(max-width: 910px)': {
            width: "210px"
        },
        '@media(max-width: 870px)': {
            width: "180px"
        },
        '@media(max-width: 840px)': {
            width: "150px"
        },
        '@media(max-width: 770px)': {
            display: "none",

        },
    },
    newSideDivPhone: {
        display: "none",
        marginLeft: "68px",
        marginTop: "56px",
        height: "45px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        backgroundColor: "#e8e8e894",
        overflow: "overlay",
        position: "fixed",
        display: "flex",
        '@media(max-width: 770px)': {
            display: "flex",
            width: "-webkit-fill-available",
            zIndex: 1000,
            backgroundColor: "#ebebeb"
        },
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

    newSidedivData: {
        display: "flex",
        width: "100%",
        paddingTop: "10%",
        flexDirection: "column",
        backgroundColor: "#ebebeb"
    },

    newSidedivDataPhone: {
        display: "none",
        // flexDirection: "column",
        '@media(max-width: 770px)': {
            display: "flex",
            width: "100%",
            alignItems: "center",
        },
    },

    subComponent: {
        height: "fit-content",
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        marginLeft: 0,
        // '@media(max-width: 931px)': {
        //     padding: 0
        // },
    },

    subComponentPhone: {
        // height: "fit-content",
        // flexDirection: 'column',

        '@media(max-width: 770px)': {
            display: 'flex',
            width: '100%',
            marginLeft: 0,
            flex: 1,
        },
    },

    subComponentNav: {
        height: "fit-content",
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        marginLeft: "388px",
        '@media(max-width: 990px)': {
            marginLeft: "338px"
        },
        '@media(max-width: 930px)': {
            marginLeft: "318px"
        },
        '@media(max-width: 910px)': {
            marginLeft: "278px"
        },
        '@media(max-width: 870px)': {
            marginLeft: "248px"
        },
        '@media(max-width: 840px)': {
            marginLeft: "218px"
        },
        '@media(max-width: 770px)': {
            marginLeft: "68px",
            marginTop: "45px",
        },
        '@media(max-width: 556px)': {
            minWidth: "90px"
        }

    },

    button: {
        marginBottom: "20px",
        border: 0,
        alignSelf: "flex-start",
        padding: 0,
        marginLeft: "5%"
    },

    buttonPhone: {
        // marginBottom: "20px",
        border: 0,
        // alignSelf: "flex-start",
        padding: 0,
        paddingRight: "2%"
        // marginLeft: "5%"
    },

    teamNameDiv: {
        height: "72px",
        width: "72px",
        marginLeft: "5%",
        borderRadius: "4%",
        backgroundColor: "gold",
        fontWeight: "bolder",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },

    teamPara: {
        margin: 0,
        padding: 0,
        fontSize: "28px",
        cursor: "pointer"
    },

    titleTeam: {
        marginLeft: "5%",
        paddingTop: "25px",
        fontSize: "18px",
        cursor: "pointer",
        fontWeight: "bolder"
    },

    titleTeamPhone: {
        // marginLeft: "5%",
        // paddingTop: "25px",
        fontSize: "18px",
        cursor: "pointer",
        fontWeight: "bolder",
        paddingLeft: "2%"
    },

    titleGeneral: {
        cursor: "pointer",
        paddingLeft: "5%",
        alignItems: "center",
        display: "flex",
        height: "30px",
        marginTop: "25px",
        backgroundColor: "white",
        fontSize: "14px"
    },
}));


function TeamScreen() {
    const token = localStorage.getItem("token");
    const classes = useStyles();
    // const history = useHistory();
    const [teamName, setTeamName] = useState("");
    const [uniqueCode, setUniqueCode] = useState("");
    const [allCalls, setAllCalls] = useState([]);
    const [open, setOpen] = useState(false);
    const { team_slug } = useParams();
    const [userName, setUserName] = useState("");
    const [teamSlug, setTeamSlug] = useState("");
    const [isAdmin, setAdmin] = useState(false)
    const [permission, setPermission] = useState(false);



    useEffect(() => {
        checkPermissions();
        getAllCalls();

    }, []);


    // Get all the calls of the team from the database

    const getAllCalls = () => {
        axios({
            method: 'post',
            data: {
                team_slug: team_slug,
            },
            url: api + "communication/get_calls",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data);
                setAllCalls(res.data.my_calls);
                setTeamName(res.data.team_name);
            })
            .catch(err => {
                console.log(err);
            })
    }


    const handleClose = () => {
        console.log("Close")
    }


    // Check permission for entering into a team

    const checkPermissions = () => {
        const token = localStorage.getItem("token");
        axios({
            method: 'post',
            data: {
                team_slug: team_slug,
            },
            url: api + "teams/check_permissions",
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                console.log(res.data);
                setUserName(res.data.user_name);
                setTeamSlug(res.data.team_slug);
                setAdmin(res.data.is_admin);
                setUniqueCode(res.data.unique_code);
                setPermission(res.data.has_permissions);

                if (res.data.has_permissions) {
                    console.log(res.data);
                }
                else {
                    setOpen(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    if (permission) {
        return (
            <div style={{ height: "100%" }}>
                <Navbar />
                <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
                    <Sidebar />
                    <div className={classes.newSideDiv}>
                        <div className={classes.newSidedivData}>
                            <Button variant="outlined" color="primary" href="/home" className={classes.button}> All teams </Button>
                            <div className={classes.teamNameDiv}>
                                <p className={classes.teamPara}>{teamName.substr(0, 2).toUpperCase()}</p>
                            </div>
                            <div className={classes.subComponent} >
                                <div className={classes.titleTeam}>{teamName}</div>
                            </div>
                            <div className={classes.subComponent} >
                                <div className={classes.titleGeneral} >General</div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.newSideDivPhone}>
                        <div className={classes.newSidedivDataPhone}>
                            <div className={classes.subComponentPhone} >
                                <div className={classes.titleTeamPhone}>{teamName}</div>
                            </div>
                            <Button variant="outlined" color="primary" href="/home" className={classes.buttonPhone}> All teams </Button>
                        </div>
                    </div>
                    <div className={classes.subComponentNav} >
                        <TeamsNav team_slug={team_slug} allCalls={allCalls} isAdmin={isAdmin} uniqueCode={uniqueCode} />
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <WarningModal open={open} handleClose={handleClose} text={"You are not authorized to view this team"} redirect={"/home"} />
        )
    }
}

export default TeamScreen;
