import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useHistory } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import { CardActionArea } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

// CSS

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "293px",
    minHeight: "252px",
    marginBottom: "2%",
    minWidth: "260px",

    '@media(max-width: 1209px)': {
      minWidth: "320px",
      maxWidth: "320px"
    },
    '@media(max-width: 1150px)': {
      minWidth: "300px",
      maxWidth: "300px"
    },
    '@media(max-width: 1099px)': {
      minWidth: "280px",
      maxWidth: "280px"
    },
    '@media(max-width: 1077px)': {
      minWidth: "260px",
      maxWidth: "280px"
    },
    '@media(max-width: 934px)': {
      minWidth: "350px",
      maxWidth: "350px"
    },
    '@media(max-width: 831px)': {
      minWidth: "320px",
      maxWidth: "320px"
    },
    '@media(max-width: 798px)': {
      minWidth: "300px",
      maxWidth: "300px"
    },
    '@media(max-width: 741px)': {
      minWidth: "280px",
      maxWidth: "280px"
    },
    '@media(max-width: 720px)': {
      minWidth: "260px",
      maxWidth: "260px"
    },
    '@media(max-width: 645px)': {
      minWidth: "320px",
      maxWidth: "260px"
    },
    '@media(max-width: 424px)': {
      minWidth: "280px",
      maxWidth: "280px"
    },
    // '@media(max-width: 925px)': {
    //   minHeight: "240px",
    //   minWidth: "240px",
    //   maxWidth: "250px"
    // },
    // '@media(max-width: 855px)': {
    //   minHeight: "220px",
    //   minWidth: "220px",
    //   maxWidth: "230px"
    // },
    // '@media(max-width: 533px)': {
    //   minHeight: "200px",
    //   minWidth: "200px",
    //   maxWidth: "210px"
    // },
    // '@media(max-width: 483px)': {
    //   minHeight: "230px",
    //   minWidth: "230px",
    //   maxWidth: "240px"
    // }
  },
  cardActionArea: {
    height: "100%",
    display: "flex"
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  colorDiv: {
    height: "91px",
    width: "130px",
    borderRadius: "4%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // '@media(max-width: 483px)': {
    //   height: "85px",
    //   width: "105px",
    // },
    // '@media(max-width: 533px)': {
    //   width: "100px",
    //   height: "72px"
    // },
  },
  typo: {
    textAlign: "center",
    paddingTop: "8%",
    fontWeight: "bolder"
  },
  para: {
    margin: 0,
    padding: 0,
    fontSize: "xxx-large",
    // '@media(max-width: 483px)': {
    //   fontSize: "xx-large"
    // },
    // '@media(max-width: 533px)': {
    //   fontSize: "xx-large"
    // },
  }
}));

export default function Cards({ teamName, admin, teamSlug, index }) {
  const history = useHistory();
  const classes = useStyles();
  // const { unique_code } = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // console.log(teamName + " " + teamSlug, index)

  const handleClick = (e) => {
    console.log("Card clicked")
    history.push("/teams/" + teamSlug);
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const background = ['#f34f1c', '#7fbc00', '#ffba01', '#00a4ef'];

  return (
    <Card className={classes.card} >
      <CardActionArea className={classes.cardActionArea} onClick={handleClick}>
        <CardContent className={classes.cardContent}>
          <div style={{ backgroundColor: background[index] }} className={classes.colorDiv}>
            <p className={classes.para}>{teamName.substring(0, 2).toUpperCase()}</p>
          </div>
          <Typography gutterBottom variant="h5" component="div" className={classes.typo}>
            {teamName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Unique Code :{teamSlug} <br /> */}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
