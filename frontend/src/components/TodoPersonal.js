import React, { useState } from 'react';
import TodoForm from './TodoForm';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';

function Todo({ todos, setTodos, editTodo, setEditTodo }) {
    const handleDelete = ({ id }) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    }

    const handleComplete = (item) => {
        setTodos(
            todos.map(todo => {
                if (todo.id === item.id) {
                    return { ...todo, done: !todo.done }
                }
                return todo;
            })
        )
    }

    const handleEdit = ({ id }) => {
        const findTodo = todos.find((todo) => todo.id === id);
        setEditTodo(findTodo)
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

    return todos.map((item) => (
        <div
            className={item.done ? 'todo-row complete' : 'todo-row'}
            key={item.id}
        >
            <div key={item.id}>
                <div>Task: {item.task}</div>
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
                <EditIcon
                    onClick={() => handleEdit(item)}
                    className='edit-icon'
                />
            </div>
        </div>
    ));
};

export default Todo;
