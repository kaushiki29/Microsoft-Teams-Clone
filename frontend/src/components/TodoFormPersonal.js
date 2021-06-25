import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    MuiAutocompleteEndAdornment: {
        top: 0
    }
}))

function TodoFormPersonal({ todos, setTodos, task, setTask, editTodo, setEditTodo }) {
    const classes = useStyles();

    useEffect(() => {
        if (editTodo) {
            setTask(editTodo.task);
        }
        else {
            setTask("")
        }
    }, [setTask, editTodo])

    const handleTask = (e) => {
        setTask(e.target.value);
    }

    const updateTodo = (task, id, done) => {
        const newTodo = todos.map((todo) => {
            if (todo.id === id) {
                return { task, id, done }
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
            setTodos([...todos, { id: id, task: task, done: false }]);
            setTask("");
        }
        else {
            updateTodo(task, editTodo.id, editTodo.done)
        }
    }

    return (
        <div className='todo-form'>
            <>
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

export default TodoFormPersonal;
