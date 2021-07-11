import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Cards from './Cards';
import axios from 'axios';
import { api } from '../screen/Helper';


// Css Style

const useStyles = makeStyles((theme) => ({
    firstTeamList: {
        width: "100%",
        backgroundColor: "#f5f5f5",
        padding: "auto",
        '@media(max-width: 600px)': {
            textAlign: "center",
            marginTop: "5%"
        }
    },
    heading: {
        marginTop: "2%",
        fontSize: "1.5rem",
    },
    cards: {
        display: "flex",
        marginTop: "2%",
        minHeight: "250px",
        flexWrap: "wrap",
        justifyContent: "space-between",
        '@media(max-width: 600px)': {
            justifyContent: "space-around"
        },
        '@media(max-width: 785px)': {
            justifyContent: "space-around"
        }
    },
    noTeamImage: {
        width: "400px",
        height: "86%",
        '@media(max-width: 928px)': {
            width: "350px"
        },
        '@media(max-width: 710px)': {
            width: "280px"
        },
        '@media(max-width: 375px)': {
            width: "250px",
            height: "80 %"
        }
    }
}));




function TeamsList(props) {
    const classes = useStyles();
    const [myTeams, setMyTeams] = useState([]);
    const token = localStorage.getItem("token");


    useEffect(() => {
        getTeams();
    }, [])

    useEffect(() => {
        getTeams();
    }, [props.val])



    // Get all the teams


    const getTeams = () => {
        axios({
            method: 'get',
            url: api + 'teams/get_teams',
            headers: {
                Authorization: "Token " + token
            }
        })
            .then(res => {
                setMyTeams(res.data.my_teams)
                console.log(res.data)

            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={classes.firstTeamList}>
            <div className={classes.heading}>Your Teams</div>
            <div className={classes.cards}>
                {myTeams.map((i, index) => {
                    return <Cards teamName={i.team_name} admin={i.admin} teamSlug={i.team_slug} index={index % 4} />
                })}
                {myTeams.length == 0 &&
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <img src="https://cdn.dribbble.com/users/132658/screenshots/14228126/media/1489a46d460a08048999d40ac44f3491.gif" style={{ borderRadius: "2%", }} className={classes.noTeamImage} />
                        <div style={{ color: "gray", fontWeight: "bold" }}>Create a team or join a team to start!</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default TeamsList
