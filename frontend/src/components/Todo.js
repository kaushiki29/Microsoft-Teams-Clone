import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { makeStyles } from '@material-ui/core/styles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { api } from '../screen/Helper';


// Css style

const useStyles = makeStyles({
  pendingTodos: {
    height: "239px",
    '@media(max-width: 535px)': {
      height: 200
    },
    '@media(max-width: 535px)': {
      height: 190
    },
    '@media(max-width: 376px)': {
      height: 160
    },
    '@media(max-width: 334px)': {
      height: 140
    },
  },
})



function Todo({ pendingTodos, setPendingTodos, team_slug, reloadTodos, completedTodos, setCompletedTodos }) {
  const classes = useStyles();

  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


  // Handle Delete Tasks


  const handleDelete = ({ id }) => {
    const token = localStorage.getItem("token");
    axios({
      method: 'post',
      url: api + "teams/delete_todo",
      data: {
        team_slug: team_slug,
        id: id
      },
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        reloadTodos();
      })
      .catch(err => {
        console.log(err);
      })
  }


  // Handle complete tasks


  const handleComplete = ({ id }) => {
    const token = localStorage.getItem("token");
    axios({
      method: 'post',
      url: api + "teams/todo_completed",
      data: {
        id: id
      },
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data);
        reloadTodos();
      })
      .catch(err => {
        console.log(err);
      })
  }


  // Format for specifying date and time


  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }



  return (
    <div>
      <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>Pending Tasks</div>


      {/* Rending pending tasks */}


      {pendingTodos.length > 0 ?
        pendingTodos.map((item) => (
          <div
            className='todo-row'
            key={item.id}
          >
            <div key={item.id}>
              <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Created by: </p> {item.created_by}</div>
              <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Assigned to: </p>{item.assigned_to}</div>
              <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Task: </p>{item.todo_item}</div>
              <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Deadline: </p>{formatAMPM(new Date(item.expected_time))}, {new Date(item.expected_time).getDate()} {month[new Date(item.expected_time).getMonth()]} {new Date(item.expected_time).getFullYear()}</div>
            </div>

            <div className='icons'>
              <HighlightOffIcon
                onClick={() => handleDelete(item)}
                className='delete-icon'
              />
              <DoneIcon
                onClick={() => handleComplete(item)}
                className='delete-icon'
              />
            </div>
          </div>
        )) :
        <div style={{ textAlign: "center" }}>
          <img
            style={{}}
            className={classes.pendingTodos}
            src="https://img.freepik.com/free-vector/girl-sits-couch-learns-play-ukulele-notes_321061-373.jpg?size=626&ext=jpg" />
          <p style={{ color: "gray" }}>No pending tasks</p>
        </div>
      }
      <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", paddingTop: "3%" }}>Completed Tasks</div>


      {/* Rendering completed tasks */}


      {completedTodos.length > 0 ? completedTodos.map((item) => (
        <div
          className='todo-row'
          key={item.id}
        >
          <div key={item.id}>
            <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Created by: </p>{item.created_by}</div>
            <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Assigned to: </p>{item.assigned_to}</div>
            <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Task: </p>{item.todo_item}</div>
            <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Completed by: </p>{item.completed_by ? item.completed_by : " "}</div>
            <div style={{ display: 'flex', marginBottom: "1%" }}><p style={{ color: "antiquewhite" }}>Deadline: </p>{formatAMPM(new Date(item.expected_time))}, {new Date(item.expected_time).getDate()} {month[new Date(item.expected_time).getMonth()]} {new Date(item.expected_time).getFullYear()}</div>
          </div>

          <div className='icons'>
            <HighlightOffIcon
              onClick={() => handleDelete(item)}
              className='delete-icon'
            />
          </div>
        </div>
      )) :
        <div style={{ textAlign: "center" }}>
          <img
            className={classes.pendingTodos}
            src="https://media.istockphoto.com/vectors/girl-with-laptop-on-the-chair-freelance-or-studying-concept-cute-in-vector-id1178761712?k=6&m=1178761712&s=612x612&w=0&h=Gk_EzskIIO1ncZRBjeGQweDr4z70yyPEum9I8ftukUw=" />
          <p style={{ color: "gray" }}>No completed tasks</p>
        </div>
      }
    </div>
  )
};

export default Todo;