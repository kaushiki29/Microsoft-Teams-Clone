import React, { useState, useEffect } from 'react'
// import './Navbar.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router-dom';
import { api } from '../screen/Helper';
import axios from 'axios';


// CSS

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: '13%',
    height: '34px',
    width: "80%",
    backgroundColor: '#cdcdd5',
  },
  nav: {
    display: "flex",
    backgroundColor: "#464775",
    color: " white",
    alignItems: "center",
    height: "56px",
    zIndex: "1000",
    position: 'fixed',
    width: "100%",
    top: "0",
  },
  icon: {
    paddingLeft: "1%",
    paddingRight: "2%",
    flex: "0.4",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    // width: "80%"
  },
  imag: {
    width: "64px",
    paddingLeft: "22%",
    paddingRight: "23%",
    '@media(max-width: 928px)': {
      display: "none",
    }
  },
  appName: {
    flex: "1",
    marginRight: "2%",
    fontSize: "x-large",
    cursor: "pointer",
    fontWeight: "bolder",
    '@media(max-width: 928px)': {
      paddingLeft: "2%",
    }
  },
  search: {
    flex: "3",
    '@media(max-width: 780px)': {
      display: "none",
    }
  },

  profile: {
    marginLeft: "auto",
    cursor: "pointer",
    backgroundColor: "#343458"
    // minWidth: "125px"
  },
  button: {
    marginLeft: "auto",
    // paddingRight: "2%",
    color: "white"
  }

}));



function Navbar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const [username, setUsername] = useState("")


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  // Fetch username from database


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



  // Function to handle logout



  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios({
      method: 'post',
      url: api + "auth/logout",
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res);

      })
      .catch(err => {
        console.log(err);
      })
    localStorage.removeItem("token");
    history.push('/login');

  }

  const handleHeading = () => {
    history.push('/home')
  }
  return (
    <div className={classes.nav} >
      <div className="icon">
        <img className={classes.imag} src="https://img.icons8.com/fluent/48/000000/microsoft-teams-2019.png" alt="Icon" onClick={handleHeading} />
      </div>
      <div className={classes.appName} onClick={handleHeading}>Microsoft Teams</div>
      <div className={classes.search}>
        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      <div className={classes.profile}>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.button}>
          {username || "User"}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default Navbar
