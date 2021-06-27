import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { api } from '../screen/Helper'
import axios from 'axios';

function TodoList(props) {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState("")
  const [assigned, setAssigned] = useState("")
  const [id, setId] = useState();
  const [expectedTime, setExpectedTime] = useState();
  const [val, setVal] = useState(1);

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
        setTodos(res.data.pending_todos)
      })
      .catch(err => {
        console.log(err);
      })
  }, [val])


  const reloadTodos = () => {
    setVal(val + 1);
  }

  return (
    <>
      <h1>What's the Plan ?</h1>

      <TodoForm
        todos={todos}
        setTodos={setTodos}
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
        todos={todos}
        team_slug={props.team_slug}
        setTodos={setTodos}
        reloadTodos={reloadTodos}
      />
    </>
  );
}

export default TodoList;
