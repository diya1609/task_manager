import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaPlus, FaTrash } from 'react-icons/fa';
import { AppDispatch, RootState } from '../redux/store'; 
import { fetchTasks, addTask, updateTask, deleteTask } from '../redux/taskSlice';

const TaskManager = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const loading = useSelector((state: RootState) => state.tasks.loading);
    const [newTask, setNewTask] = useState('');
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
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-lg-6 col-md-8 col-sm-10 col-12'>
                    <h1 className='mb-4 text-center'>Task Manager App</h1>

                    {/* Input and Filter box side by side */}
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        {/* Input field */}
                        <div className='input-group me-2 flex-grow-1'>
                            <input
                                type='text'
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                className='form-control'
                                placeholder='Add a new Task'
                            />
                            <button
                                onClick={handleAddTask}
                                className='btn btn-success btn-sm ms-2'
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {/* Filter dropdown */}
                        <div className='input-group ms-2'>
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
                    <div className='task-list'>
                        {loading ? (
                            <div className='text-center'>Loading...</div>
                        ) : (
                            filteredTasks.map((item) => (
                                <div key={item.id} className='task-item p-2 mb-2 border bg-light rounded-3 d-flex justify-content-between align-items-center'>
                                    <span className={item.completed ? 'text-decoration-line-through' : ''}>
                                        {item.title}
                                    </span>

                                    <div>
                                        <button
                                            onClick={() => handleCheckAndUncheck(item)}
                                            className='btn btn-success btn-sm me-2'
                                            type='button'
                                        >
                                            <FaCheck />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(item.id)}
                                            className='btn btn-danger btn-sm'
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
            </div>
        </div>
    );
};

export default TaskManager;
