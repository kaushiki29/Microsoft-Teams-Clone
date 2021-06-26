import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { api } from '../screen/Helper';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    width: "300px",
    marginBottom: "1%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function TodoForm({ allUsers, todos, setTodos, task, setTask, completed, setCompleted, assigned, setAssigned, expectedTime, setExpectedTime, team_slug, reloadTodos }) {
  const classes = useStyles();

  const handleTask = (e) => {
    setTask(e.target.value);
  }
  const handleTime = (e) => {
    // const t = new Date(e.target.value).getTime()
    setExpectedTime(e.target.value);
  }
  const handleCompleted = e => {
    setCompleted(e.target.value)
  }
  const handleAssigned = e => {
    setAssigned(e.target.value)
  }

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    const id = (todos.length) ? todos[todos.length - 1].id + 1 : 0;
    setTodos([...todos, { id: id, task: task, completed: completed, assigned: assigned, expectedTime: expectedTime, done: false }]);
    axios({
      method: 'post',
      data: {
        team_slug: team_slug,
        todo_item: task,
        is_completed: false,
        expected_completion_unix_time: new Date(expectedTime).getTime(),
        email_assigned_to: assigned,
        email_completed_by: completed
      },
      url: api + "teams/add_todos_teams",
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data)
        setTask("");
        setCompleted("")
        setAssigned("")
        setExpectedTime("")
        document.getElementById('datetime-local').value = "";
        reloadTodos();
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className='todo-form'>
      <>
        <>
          {/* <div style={{ display: "flex", flexDirection: "row", width: "500px", paddingBottom: "2%" }}> */}
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
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Completed By</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={completed}
              onChange={handleCompleted}
              label="Completed By"
            >

              {allUsers.map(i => {
                return <MenuItem value={i.email}>{i.name}-{i.email}</MenuItem>
              })}
            </Select>
          </FormControl>
          {/* </div> */}
        </>
        <TextField
          id="outlined-basic"
          placeholder='Add a task'
          variant="outlined"
          value={task}
          multiline
          onChange={handleTask}
          name='task'
          style={{ marginBottom: "1%", width: 300 }}
        />
        <TextField
          id="datetime-local"
          label="Deadline"
          type="datetime-local"
          variant="outlined"
          defaultValue=""
          placeholder="YYYY-MM-DD HH:MM"
          onChange={handleTime}
          style={{ width: 300, marginBottom: "1%" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <button onClick={handleSubmit} className='todo-button'>
          <div>Add to my List</div>
        </button>
      </>
    </div>
  );
}

export default TodoForm;
