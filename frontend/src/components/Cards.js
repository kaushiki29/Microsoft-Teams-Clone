import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useHistory } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import { CardActionArea } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "293px",
    minHeight: "252px",
    marginBottom: "2%",
    minWidth: "260px"
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
    justifyContent: "center"
  },
  typo: {
    textAlign: "center",
    paddingTop: "8%",
    fontWeight: "bolder"
  },
  para: {
    margin: 0,
    padding: 0,
    fontSize: "xxx-large"
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