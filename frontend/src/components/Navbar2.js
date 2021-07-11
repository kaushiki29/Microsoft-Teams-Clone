import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CreateIcon from '@material-ui/icons/Create';
import TextField from "@material-ui/core/TextField";
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios from 'axios';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { api } from '../screen/Helper';


// CSS style

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#464775"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#464775"
      },
      "&:hover fieldset": {
        borderColor: "#464775"
      },
    }
  }
})(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },

  margin: {
    margin: theme.spacing(1)
  },

  teams: {
    height: "8%",
    width: "100%",
    backgroundColor: "#f5f5f5",
    display: "flex",
    marginTop: 20,
    alignItems: "center",
  },

  modalIcon: {
    height: "5rem",
    width: "5rem",
    color: "#464775",
  },

  options: {
    display: "flex",
    '@media(max-width: 615px)': {
      display: "none"
    }
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },

  optionsPhone: {
    display: 'none',
    '@media(max-width: 615px)': {
      display: "flex"
    }
  },

  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #464775',
    boxShadow: theme.shadows[5],
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    padding: theme.spacing(2, 4, 3),
  },

  title: {
    marginRight: "auto",
    fontSize: "2rem",
    fontWeight: "bolder",
    flex: 1,
  },

  join: {
    textAlign: "center",
    flex: 1,
  },

  create: {
    textAlign: "center",
    paddingRight: "3%",
    flex: 1,
  },

  buttonModal: {
    color: "white",
    backgroundColor: "#464775",

    "&:hover": {
      backgroundColor: "#434ab3",
    }
  }

}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);




function Navbar2(props) {
  const classes = useStyles();
  const [openJoin, setOpenJoin] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [teamCode, setTeamCode] = useState({
    value: "",
    error: false,
    helperText: ""
  });
  const [teamName, setTeamName] = useState({
    value: "",
    error: false,
    helperText: ""
  });


  // Handle team create and join modals

  const changeModalJoin = (e) => {
    setTeamCode({
      value: e.target.value,
      error: false,
      helperText: '',
    });
    console.log(e.target.value);
  }

  const changeModalCreate = (e) => {
    setTeamName({
      value: e.target.value,
      error: false,
      helperText: "",
    });
    // console.log(e.target.value);
  }



  // Handle join a team


  const handleJoin = () => {
    const token = localStorage.getItem("token");
    if (!teamCode.value) {
      setTeamCode({
        value: teamCode.value,
        error: true,
        helperText: "Team Code cannot be blank"
      })
    }
    else {
      const data = {
        unique_code: teamCode.value,
      }
      axios({
        method: 'post',
        url: api + "teams/join_team",
        data: data,
        headers: {
          Authorization: "Token " + token
        }
      })
        .then(res => {
          console.log(res);
          setTeamCode({
            value: "",
            error: false,
            helperText: "",
          });
          handleOpenJoin();
          props.reloadTeams();
        })
        .catch(err => {
          console.log(err);
        })
    }

  }


  // Handle create a team


  const handleCreate = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!teamName.value) {
      setTeamName({
        value: teamName.value,
        error: true,
        helperText: "Team name cannot be blank"
      })
    }
    else {
      const data = {
        team_name: teamName.value,
      }
      axios({
        method: 'post',
        url: api + "teams/create_team",
        data: data,
        headers: {
          Authorization: "Token " + token
        }
      })
        .then(res => {
          console.log(res);
          setTeamName({
            value: "",
            error: false,
            helperText: "",
          });
          handleOpenCreate();
          props.reloadTeams();
        })
        .catch(err => {
          console.log(err);
        })
    }

    console.log({ teamName });
  }


  // Handle Open Join Team Modal


  const handleOpenJoin = () => {
    setOpenJoin(!openJoin);
    handleClose()
    setTeamCode({
      value: "",
      error: false,
      helperText: "",
    });

  };


  // Handle Open Create Team Modal


  const handleOpenCreate = () => {
    setOpenCreate(!openCreate);
    handleClose()
    setTeamName({
      value: "",
      error: false,
      helperText: "",
    });
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleClickO1 = () => {
    console.log("o1 clicked")
  }
  return (
    <div className={classes.teams}>
      <div className={classes.title}>Teams</div>
      <div className={classes.options}>
        <div className={classes.join} style={{ marginRight: 20 }}>
          <Button variant="outlined" style={{ width: 190 }} onClick={handleOpenJoin} ><PersonAddIcon style={{ paddingRight: "5px" }} /> Join a Team</Button>

          {/* Join a team Modal */}


          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openJoin}
            onClose={handleOpenJoin}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openJoin}>
              <div className={classes.paper}>
                <GroupWorkIcon className={classes.modalIcon} />
                <h2 id="transition-modal-title">Join a team with Code</h2>
                <p id="transition-modal-description">
                  <CssTextField
                    value={teamCode.value}
                    className={classes.margin}
                    id="custom-css-standard-input"
                    error={teamCode.error}
                    helperText={teamCode.helperText}
                    label="Type code here"
                    onChange={changeModalJoin}
                  />
                </p>
                <Button variant="contained" className={classes.buttonModal} onClick={handleJoin} >Join</Button>
              </div>
            </Fade>
          </Modal>
        </div>
        <div className={classes.create} style={{}}>
          <Button variant="outlined" style={{ width: 190 }} onClick={handleOpenCreate}><CreateIcon style={{ paddingRight: "5px" }} />Create a Team</Button>


          {/* Create a team Modal */}


          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openCreate}
            onClose={handleOpenCreate}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openCreate}>
              <div className={classes.paper}>
                <GroupWorkIcon className={classes.modalIcon} />
                <h2 id="transition-modal-title">Create a team</h2>
                <p id="transition-modal-description">
                  <CssTextField
                    className={classes.margin}
                    // value={teamName.value}
                    error={teamName.error}
                    helperText={teamName.helperText}
                    id="custom-css-standard-input"
                    label="Type Team Name here"
                    onChange={changeModalCreate}
                  />
                </p>
                <Button variant="contained" className={classes.buttonModal} onClick={handleCreate}>Create</Button>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>

      <div className={classes.optionsPhone}>
        {/* <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          style={{ backgroundColor: "transparent", height: "33px" }}
         
        > */}
        <MoreVertIcon onClick={handleClick} />
        {/* </Button> */}
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem onClick={handleOpenJoin}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Join a team" />
          </StyledMenuItem>
          <StyledMenuItem onClick={handleOpenCreate}>
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="Create a team" />
          </StyledMenuItem>
        </StyledMenu>
      </div>
    </div>
  )
}

export default Navbar2
