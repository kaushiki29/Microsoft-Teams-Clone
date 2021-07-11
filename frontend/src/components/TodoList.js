import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { api } from '../screen/Helper'
import axios from 'axios';

function TodoList(props) {
  const [pendingTodos, setPendingTodos] = useState([])
  const [completedTodos, setCompletedTodos] = useState([])
  const [task, setTask] = useState("")
  const [assigned, setAssigned] = useState("")
  const [id, setId] = useState();
  const [expectedTime, setExpectedTime] = useState();
  const [val, setVal] = useState(1);


  // Fetch all the tasks from backend

  useEffect(() => {
    const token = localStorage.getItem("token")
    axios({
      method: 'post',
      data: {
        team_slug: props.team_slug
      },
      url: api + "teams/get_todos_teams",
      headers: {
        Authorization: "Token " + token
      }
    })
      .then(res => {
        console.log(res.data)
        setPendingTodos(res.data.pending_todos)
        setCompletedTodos(res.data.completed_todos)
      })
      .catch(err => {
        console.log(err);
      })
  }, [val])


  // For real time rendering

  const reloadTodos = () => {
    setVal(val + 1);
  }

  return (
    <>
      <TodoForm
        pendingTodos={pendingTodos}
        setPendingTodos={setPendingTodos}
        task={task}
        assigned={assigned}
        setTask={setTask}
        setAssigned={setAssigned}
        expectedTime={expectedTime}
        setExpectedTime={setExpectedTime}
        allUsers={props.allUsers}
        team_slug={props.team_slug}
        reloadTodos={reloadTodos}
        id={id}
        setId={setId}
      />

      <Todo
        pendingTodos={pendingTodos}
        team_slug={props.team_slug}
        setPendingTodos={setPendingTodos}
        reloadTodos={reloadTodos}
        completedTodos={completedTodos}
        setCompletedTodos={setCompletedTodos}
      />
    </>
  );
}

export default TodoList;
