import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import TeamsList from '../components/TeamsList';
import { makeStyles } from '@material-ui/core/styles';
import { messaging } from '../components/Firebase';


//CSS Styles


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
        height: "fit-content",
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingRight: "3%",
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        marginTop: "56px",
        paddingLeft: "3%",
        backgroundColor: "#f5f5f5",
        marginLeft: 78,
        '@media(max-width: 615px)': {
            paddingLeft: 0,
            paddingRight: "1%"
        }
    }
}));


function LandingPage() {
    const classes = useStyles();
    const [val, setVal] = useState(1);

    const reloadTeams = () => {
        setVal(val + 1);
    }



    return (
        <div style={{ height: '100%' }}>
            <Navbar />
            <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
                <Sidebar />
                <div className={classes.subComponent} >
                    <Navbar2 reloadTeams={reloadTeams} />
                    <TeamsList val={val} />
                </div>
            </div>
        </div>
    )
}

export default LandingPage
