import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(() => ({
  MuiAutocompleteEndAdornment: {
    top: 0
  }
}))

function TodoForm({ allUsers, todos, setTodos, task, setTask, completed, setCompleted, assigned, setAssigned, editTodo, setEditTodo }) {
  const classes = useStyles();

  useEffect(() => {
    if (editTodo) {
      setTask(editTodo.task);
      setCompleted(editTodo.completed);
      setAssigned(editTodo.assigned);
    }
    else {
      setTask("")
      setCompleted("")
      setAssigned("")
    }
  }, [setTask, setCompleted, setAssigned, editTodo])

  const handleTask = (e) => {
    setTask(e.target.value);
  }
  const handleCompleted = e => {
    setCompleted(e.target.value)
  }
  const handleAssigned = e => {
    setAssigned(e.target.value)
  }
  const updateTodo = (task, completed, assigned, id, done) => {
    const newTodo = todos.map((todo) => {
      if (todo.id === id) {
        return { task, completed, assigned, id, done }
      }
      else {
        return todo
      }
    })
    setTodos(newTodo);
    setEditTodo("")
  }
  const handleSubmit = () => {
    const id = (todos.length) ? todos[todos.length - 1].id + 1 : 0;
    if (!editTodo) {
      setTodos([...todos, { id: id, task: task, completed: completed, assigned: assigned, done: false }]);
      setTask("");
      setCompleted("")
      setAssigned("")
    }
    else {
      updateTodo(task, completed, assigned, editTodo.id, editTodo.done)
    }
  }

  return (
    <div className='todo-form'>
      <>
        <>
          <div style={{ display: "flex", flexDirection: "row", width: "500px", paddingBottom: "2%" }}>
            <Autocomplete
              id="combo-box-demo"
              className={classes.MuiAutocompleteEndAdornment}
              options={allUsers}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Assigned To"
                  value={assigned}
                  onSelect={handleAssigned}
                  variant="outlined" />}
            />
            <Autocomplete
              id="combo-box-demo"
              options={allUsers}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Completed By"
                  value={completed}
                  onSelect={handleCompleted}
                  variant="outlined" />}
            />
          </div>
        </>
        <TextField
          id="outlined-basic"
          placeholder='Add a task'
          variant="outlined"
          value={task}
          multiline
          onChange={handleTask}
          name='task'
          style={{ marginBottom: "2%", width: 300 }}
        />
        <button onClick={handleSubmit} className='todo-button'>
          {!editTodo ? <div>Add to my List</div> : <div>Update my List</div>}
        </button>
      </>
    </div>
  );
}

export default TodoForm;
