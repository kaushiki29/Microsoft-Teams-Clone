import React, { useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';

function TodoList(props) {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState("")
  const [completed, setCompleted] = useState("")
  const [editTodo, setEditTodo] = useState(null)
  const [assigned, setAssigned] = useState("")

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
        editTodo={editTodo}
        setEditTodo={setEditTodo}
        allUsers={props.allUsers} />

      <Todo
        todos={todos}
        setTodos={setTodos}
        editTodo={editTodo}
        setEditTodo={setEditTodo}
      />
    </>
  );
}

export default TodoList;
