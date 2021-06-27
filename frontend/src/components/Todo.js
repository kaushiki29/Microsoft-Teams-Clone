import React, { useState } from 'react';
import TodoForm from './TodoForm';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { api } from '../screen/Helper';

function Todo({ todos, setTodos, team_slug, reloadTodos }) {

  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

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

  if (todos.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <img
          style={{ height: "240px" }}
          src="https://media.istockphoto.com/vectors/young-business-woman-relaxing-on-coffee-break-sitting-on-huge-cup-vector-id1161935533?b=1&k=6&m=1161935533&s=170667a&w=0&h=VsFmAhUAQz_7AkGSjJ6jMzphlIf_HKNas375cP6gGuM=" />
      </div>
    )
  }
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
  // const date = new Date(item.expectedTime);
  return todos.map((item) => (
    <div
      className={item.is_completed ? 'todo-row complete' : 'todo-row'}
      key={item.id}
    >
      <div key={item.id}>
        <div>Assigned to: {item.assigned_to}</div>
        <div>Task: {item.todo_item}</div>
        <div>Completed by: {item.completed_by ? item.completed_by : " "}</div>
        <div>Deadline: {formatAMPM(new Date(item.expected_time))}, {new Date(item.expected_time).getDate()} {month[new Date(item.expected_time).getMonth()]} {new Date(item.expected_time).getFullYear()}</div>
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
  ));
};

export default Todo;
