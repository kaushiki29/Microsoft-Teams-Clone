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
        display: "grid",
        marginTop: "2%",
        minHeight: "250px",
        // flexWrap: "wrap",
        gridTemplateColumns: "repeat(auto-fit,minmax(14rem,16rem))",
        gap: "3.5rem",
        // justifyContent: "space-between",
        '@media(max-width: 2347px)': {
            gap: "3.3rem"
        },
        '@media(max-width: 2326px)': {
            gap: "3rem"
        },
        '@media(max-width: 2296px)': {
            gap: "2.5rem"
        },
        '@media(max-width: 2245px)': {
            gap: "2rem"
        },
        '@media(max-width: 2193px)': {
            gap: "1.5rem"
        },
        '@media(max-width: 2143px)': {
            gap: "1rem"
        },
        '@media(max-width: 2092px)': {
            gap: "0.5rem"
        },
        '@media(max-width: 2041px)': {
            gap: "3.5rem"
        },
        '@media(max-width: 2015px)': {
            gap: "3rem"
        },
        '@media(max-width: 1973px)': {
            gap: "2.5rem"
        },
        '@media(max-width: 1930px)': {
            gap: "2rem"
        },
        '@media(max-width: 1888px)': {
            gap: "1.5rem"
        },
        '@media(max-width: 1845px)': {
            gap: "1rem"
        },
        '@media(max-width: 1802px)': {
            gap: "5rem"
        },
        '@media(max-width: 1785px)': {
            gap: "4.5rem"
        },
        '@media(max-width: 1751px)': {
            gap: "4rem"
        },
        '@media(max-width: 1717px)': {
            gap: "3.5rem"
        },
        '@media(max-width: 1683px)': {
            gap: "3rem"
        },
        '@media(max-width: 1649px)': {
            gap: "2.5rem"
        },
        '@media(max-width: 1615px)': {
            gap: "2rem"
        },
        '@media(max-width: 1581px)': {
            gap: "1.5rem"
        },
        '@media(max-width: 1547px)': {
            gap: "1rem"
        },
        '@media(max-width: 1513px)': {
            gap: "6.5rem"
        },
        '@media(max-width: 1505px)': {
            gap: "6rem"
        },
        '@media(max-width: 1479px)': {
            gap: "5.5rem"
        },
        '@media(max-width: 1453px)': {
            gap: "5rem"
        },
        '@media(max-width: 1428px)': {
            gap: "4.5rem"
        },
        '@media(max-width: 1402px)': {
            gap: "4rem"
        },
        '@media(max-width: 1377px)': {
            gap: "3.5rem"
        },
        '@media(max-width: 1351px)': {
            gap: "3rem"
        },
        '@media(max-width: 1325px)': {
            gap: "2.5rem"
        },
        '@media(max-width: 1300px)': {
            gap: "2rem"
        },
        '@media(max-width: 1275px)': {
            gap: "1.5rem"
        },
        '@media(max-width: 1249px)': {
            gap: "1rem"
        },
        '@media(max-width: 1224px)': {
            gap: "0.6rem"
        },
        '@media(max-width: 1209px)': {
            gap: "7rem"
        },
        '@media(max-width: 1198px)': {
            gap: "6.5rem"
        },
        '@media(max-width: 1185px)': {
            gap: "6rem"
        },
        '@media(max-width: 1169px)': {
            gap: "5.5rem"
        },
        '@media(max-width: 1133px)': {
            gap: "5rem"
        },
        '@media(max-width: 1116px)': {
            gap: "4.5rem"
        },
        '@media(max-width: 1056px)': {
            gap: "4rem"
        },
        '@media(max-width: 1041px)': {
            gap: "3rem"
        },
        '@media(max-width: 1005px)': {
            gap: "2rem"
        },
        '@media(max-width: 971px)': {
            gap: "2rem"
        },
        '@media(max-width: 969px)': {
            gap: "1rem"
        },
        '@media(max-width: 934px)': {
            gap: "12rem"
        },
        '@media(max-width: 928px)': {
            gap: "11rem"
        },
        '@media(max-width: 913px)': {
            gap: "10rem"
        },
        '@media(max-width: 896px)': {
            gap: "8rem"
        },
        '@media(max-width: 862px)': {
            gap: "6rem"
        },
        '@media(max-width: 776px)': {
            gap: "5rem"
        },
        '@media(max-width: 759px)': {
            gap: "4rem"
        },
        '@media(max-width: 696px)': {
            gap: "3rem"
        },
        '@media(max-width: 680px)': {
            gap: "2rem"
        },
        '@media(max-width: 662px)': {
            gap: "1rem"
        },
        '@media(max-width: 645px)': {
            justifyContent: "center",
            gridTemplateColumns: "repeat(auto-fit,minmax(12rem,19.8rem))",
        },
        '@media(max-width: 424px)': {
            justifyContent: "center",
            gridTemplateColumns: "repeat(auto-fit,minmax(12rem,17.8rem))",
        },
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
            {myTeams.length == 0 &&
                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <img src="https://cdn.dribbble.com/users/132658/screenshots/14228126/media/1489a46d460a08048999d40ac44f3491.gif" style={{ borderRadius: "2%", }} className={classes.noTeamImage} />
                    <div style={{ color: "gray", fontWeight: "bold" }}>Create a team or join a team to start!</div>
                </div>
            }
            <div className={classes.cards}>
                {myTeams.map((i, index) => {
                    return <Cards teamName={i.team_name} admin={i.admin} teamSlug={i.team_slug} index={index % 4} />
                })}

            </div>
        </div>
    )
}

export default TeamsList
