import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { api } from '../screen/Helper'
import axios from 'axios';

function TodoList(props) {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState("")
  const [completed, setCompleted] = useState("")
  const [assigned, setAssigned] = useState("")
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
        setTodos(res.data.todos)
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
      <h1>What's the Plan for Today?</h1>

      <TodoForm
        todos={todos}
        setTodos={setTodos}
        task={task}
        completed={completed}
        assigned={assigned}
        setTask={setTask}
        setCompleted={setCompleted}
        setAssigned={setAssigned}
        expectedTime={expectedTime}
        setExpectedTime={setExpectedTime}
        allUsers={props.allUsers}
        team_slug={props.team_slug}
        reloadTodos={reloadTodos}
      />

      <Todo
        todos={todos}
        setTodos={setTodos}
      />
    </>
  );
}

export default TodoList;
