import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { api } from '../screen/Helper';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

//
//
// CSS files
//
//

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    width: "300px",
    marginBottom: "1%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

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


//
//
// Todo Form function for taking User Input of Tasks
//
//

function TodoForm({ allUsers, pendingTodos, setPendingTodos, task, setTask, assigned, setAssigned, expectedTime, setExpectedTime, team_slug, reloadTodos, id, setId }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  //
  //
  // Error Modal open and close
  //
  //

  const handleErrorOpen = () => {
    setErrorOpen(true);
  };
  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  //
  //
  // Task Modal Open and close
  //
  //
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTask("");
    setAssigned("")
    setExpectedTime("")
    document.getElementById('datetime-local').value = "";
  };

  //
  //
  //Handling task
  //
  //

  const handleTask = (e) => {
    setTask(e.target.value);
  }

  //
  //
  //Handling time
  //
  //
  const handleTime = (e) => {
    setExpectedTime(e.target.value);
  }

  //
  //
  //Handing Assigned to
  //
  //
  const handleAssigned = e => {
    setAssigned(e.target.value)
  }


  //
  //
  //Handling Submit
  //
  //

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    if (new Date(expectedTime).getTime() - new Date().getTime() > 0) {
      axios({
        method: 'post',
        data: {
          team_slug: team_slug,
          todo_item: task,
          is_completed: false,
          expected_completion_unix_time: new Date(expectedTime).getTime(),
          email_assigned_to: assigned,
        },
        url: api + "teams/add_todos_teams",
        headers: {
          Authorization: "Token " + token
        }
      })
        .then(res => {
          console.log(res.data)
          const td = res.data;
          setPendingTodos([...pendingTodos, { id: td.id, task: td.todo_item, assigned: td.assigned_to, expectedTime: td.expected_time, done: td.is_completed }]);
          setTask("");
          setAssigned("")
          setExpectedTime("")
          document.getElementById('datetime-local').value = "";
          reloadTodos();
          handleClose()
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      console.log("Error")
      handleErrorOpen();
    }
  }



  return (
    <div style={{ textAlign: "center", paddingTop: "3%", paddingBottom: "3%" }}>
      <Button variant="outlined" color="primary" onClick={handleOpen} style={{ height: "33px" }}>
        Create a new task
      </Button>


      {/* Input Modal */}


      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className='todo-form' style={{ marginBottom: 0 }}>
              <>
                <>
                  <h1>What's the Plan ?</h1>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Assigned To</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={assigned}
                      onChange={handleAssigned}
                      label="Assigned To"
                    >

                      {allUsers.map(i => {
                        return <MenuItem value={i.email}>{i.name}-{i.email}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    id="outlined-basic"
                    placeholder='Add a task'
                    variant="outlined"
                    value={task}
                    label="Add a task"
                    multiline
                    onChange={handleTask}
                    name='task'
                    style={{ marginBottom: "4%", width: 300, marginTop: "4%", }}
                  />
                  <TextField
                    id="datetime-local"
                    label="Deadline"
                    type="datetime-local"
                    variant="outlined"
                    defaultValue=""
                    placeholder="YYYY-MM-DD HH:MM"
                    onChange={handleTime}
                    style={{ width: 300, marginBottom: "4%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <button onClick={handleSubmit} className='todo-button' style={{ width: "100px" }}>
                    <div>Add to List</div>
                  </button>
                </>
              </>
            </div>
          </div>
        </Fade>
      </Modal>


      {/* Error Modal */}


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

export default TodoForm;
