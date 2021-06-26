import React, { useState } from 'react';
import TodoFormPersonal from './TodoFormPersonal';
import TodoPersonal from './TodoPersonal';

function TodoListPersonal(props) {
    const [todos, setTodos] = useState([])
    const [task, setTask] = useState("")
    const [expectedTime, setExpectedTime] = useState();
    const [editTodo, setEditTodo] = useState(null)

    return (
        <>
            <h1>What's the Plan for Today?</h1>
            <TodoFormPersonal
                todos={todos}
                setTodos={setTodos}
                task={task}
                setTask={setTask}
                editTodo={editTodo}
                setEditTodo={setEditTodo}
                expectedTime={expectedTime}
                setExpectedTime={setExpectedTime}
            />

            <TodoPersonal
                todos={todos}
                setTodos={setTodos}
                editTodo={editTodo}
                setEditTodo={setEditTodo}
            />
        </>
    );
}

export default TodoListPersonal;
