import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

function TodoFormPersonal({ todos, setTodos, task, setTask, editTodo, setEditTodo, expectedTime, setExpectedTime }) {
    useEffect(() => {
        if (editTodo) {
            setTask(editTodo.task);
            setExpectedTime(editTodo.expectedTime)
        }
        else {
            setTask("")
            setExpectedTime()
        }
    }, [setTask, setExpectedTime, editTodo])

    const handleTask = (e) => {
        setTask(e.target.value);
    }

    const handleTime = (e) => {
        // const t = new Date(e.target.value).getTime()
        setExpectedTime(e.target.value);
    }
    const updateTodo = (task, expectedTime, id, done) => {
        const newTodo = todos.map((todo) => {
            if (todo.id === id) {
                return { task, expectedTime, id, done }
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
            setTodos([...todos, { id: id, task: task, expectedTime: expectedTime, done: false }]);
            setTask("");
            setExpectedTime(null)
        }
        else {
            updateTodo(task, expectedTime, editTodo.id, editTodo.done)
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
                    {!editTodo ? <div>Add to my List</div> : <div>Update my List</div>}
                </button>
            </>
        </div>
    );
}

export default TodoFormPersonal;
