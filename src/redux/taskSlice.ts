import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    return response.data.slice(0, 8);
  });
  

// Add a new task
export const addTask = createAsyncThunk('tasks/addTask', async (taskName: string) => {
    const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
      title: taskName,
      completed: false,
    });
    return response.data;
  });
  

//update a task
export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
  const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${task?.id}`, {
    title: task.title,
    completed: task.completed,
  });
  return response.data; 
});

// Delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number) => {
  await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
