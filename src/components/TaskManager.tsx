import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { AppDispatch, RootState } from '../redux/store'; 
import { fetchTasks, addTask, updateTask, deleteTask } from '../redux/taskSlice';

const TaskManager = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const loading = useSelector((state: RootState) => state.tasks.loading);
    const [newTask, setNewTask] = useState('');
    const [editTask, setEditTask] = useState<{ id: number; title: string } | null>(null);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleAddTask = () => {
        if (newTask.trim()) {
            dispatch(addTask(newTask));
            setNewTask('');
        }
    };

    const handleDeleteTask = (id: number) => {
        dispatch(deleteTask(id));
    };

    const handleCheckAndUncheck = (task: { id: number; title: string; completed: boolean }) => {
        dispatch(updateTask({
            ...task,
            completed: !task.completed 
        }));
    };

    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true; // 'all'
    });

    return (
        <div className='d-flex flex-column align-items-center w-50 m-auto mt-5'>
            <h1 className='mb-4'>Task Manager App</h1>
            {/* Input and Filter box */}
            <div className='d-flex justify-content-between align-items-center mb-4 w-100'>
                <div className='input-group flex-grow-1 me-2'>
                    <input
                        type='text'
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className='form-control me-1'
                        placeholder='Add a new Task'
                    />
                    <button
                        onClick={handleAddTask}
                        className='btn btn-success btn-sm me-2'
                    >
                        <FaPlus className='m-2' />
                    </button>
                </div>

                <div className='input-group flex-grow-1'>
                    <select
                        className='form-select'
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
                    >
                        <option value='all'>Show All</option>
                        <option value='completed'>Completed</option>
                        <option value='pending'>Pending</option>
                    </select>
                </div>
            </div>

            {/* List of items */}
            <div className='d-flex flex-column w-100'>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    filteredTasks.map((item) => (
                        <div key={item.id} className='m-2 p-2 border bg-light w-100 rounded-3 d-flex justify-content-between align-items-center'>
                            <span className={item.completed ? 'text-decoration-line-through' : ''}>
                                {item.title}
                            </span>

                            <div className=''>
                                <button
                                    onClick={() => handleCheckAndUncheck(item)}
                                    className='btn btn-success btn-sm me-2'
                                    type='button'
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(item.id)}
                                    className='btn btn-danger btn-sm me-2'
                                    type='button'
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskManager;
