import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {ObjectId} from "../../../utils";

export const fetchBoard = createAsyncThunk('board/fetchBoard', async (boardId) => {
    const response = await axios({
        method: 'GET',
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${boardId}`
    });
    return response.data
})

export const addTask = createAsyncThunk('board/addTask', async ({ boardId, taskGroupId, newTaskName, _id }) => {
    const response = await axios({
        method: 'POST',
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskGroupId}`,
        data: {
            _id,
            name: newTaskName
        }
    })
    return response.data
})

export const editTaskName = createAsyncThunk('board/editTaskName', async ({ boardId, taskGroupId, taskId, taskName }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskGroupId}/${taskId}`,
        method: 'PATCH',
        withCredentials: true,
        data: {
            type: 'name',
            name: taskName
        }
    })
    return response.data
})

export const deleteTask = createAsyncThunk('board/deleteTask', async ({ boardId, taskGroupId, taskId }) => {
    const response = await axios({
        method: 'DELETE',
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskGroupId}/${taskId}`
    })
    return response.data
})

export const sortTask = createAsyncThunk('board/sortTask', async ({ result }, { getState }) => {
    const response = await axios({
        method: 'PATCH',
        withCredentials: true,
        data: {
            result
        },
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${getState().board.board._id}`
    })
    return response.data
})

export const editOptionsTask = createAsyncThunk('board/editOptionsTask', async ({ taskGroupId, taskId, column, value, type }, { getState }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${getState().board.board._id}/${taskGroupId}/${taskId}`,
        method: 'PATCH',
        withCredentials: true,
        data: {
            column,
            value,
            type
        }
    })
    return response.data
})

export const clearStatusTask = createAsyncThunk('board/clearStatusTask', async ({ boardId, taskGroupId, taskId, optionId }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskGroupId}/${taskId}/${optionId}`,
        method: 'DELETE',
        withCredentials: true
    })
    return response.data
})

export const addTaskGroup = createAsyncThunk('board/addTaskGroup', async ({ name, _id }, { getState }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/taskgroup/${getState().board.board._id}`,
        method: 'POST',
        withCredentials: true,
        data: {
            _id,
            name
        },
    })
    return response.data
})

export const editTaskGroupName = createAsyncThunk('board/editTaskGroupName', async ({ boardId, taskGroupId, name }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/taskGroup/${boardId}/${taskGroupId}`,
        method: 'PATCH',
        withCredentials: true,
        data: { name }
    })
    return response.data
})

export const deleteTaskGroup = createAsyncThunk('board/deleteTaskGroup', async ({ boardId, taskGroupId }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/taskgroup/${boardId}/${taskGroupId}`,
        method: 'DELETE',
        withCredentials: true
    })
    return response.data
})

export const sortTaskGroup = createAsyncThunk('board/sortTaskGroup', async ({ result }, { getState }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/taskgroup/${getState().board.board._id}`,
        method: 'PATCH',
        withCredentials: true,
        data: { result }
    })
    return response.data
})

const boardSlice = createSlice({
    name: 'board',
    initialState: { loading: 0 },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchBoard.pending, (state, action) => {
            state.board = null
            state.loading = state.loading + 1;
        }).addCase(fetchBoard.fulfilled, (state, action) => {
            state.board = action.payload
            state.loading = state.loading - 1;
        }).addCase(fetchBoard.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(addTask.pending, (state, action) => {
            const { taskGroupId, newTaskName, _id } = action.meta.arg

            state.loading = state.loading + 1;
            const task = { _id, name: newTaskName, options: [] }
            state.board.taskGroups.find(x => x._id.toString() === taskGroupId).tasks.push(task)
        }).addCase(addTask.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(addTask.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(editTaskName.pending, (state, action) => {
            const { taskGroupId, taskId, taskName } = action.meta.arg

            state.loading = state.loading + 1;
            state.board.taskGroups
                .find(x => x._id.toString() === taskGroupId).tasks
                .find(x => x._id.toString() === taskId).name = taskName
        }).addCase(editTaskName.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(editTaskName.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(deleteTask.pending, (state, action) => {
            const { taskGroupId, taskId } = action.meta.arg

            state.loading = state.loading + 1;
            const taskGroup = state.board.taskGroups.find(x => x._id.toString() === taskGroupId)
            const task = taskGroup.tasks.find(x => x._id.toString() === taskId)
            const taskIndex = taskGroup.tasks.indexOf(task)
            taskGroup.tasks.splice(taskIndex, 1)
        }).addCase(deleteTask.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(deleteTask.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(sortTask.pending, (state, action) => {
            const { result } = action.meta.arg

            state.loading = state.loading + 1;
            const sourceTaskGroup = state.board.taskGroups.find(x => x._id.toString() === result.source.droppableId)
            const sourceIndex = sourceTaskGroup.tasks.findIndex(x => x._id.toString() === result.draggableId)
            const destinationTaskGroup = state.board.taskGroups.find(x => x._id.toString() === result.destination.droppableId)

            const task = sourceTaskGroup.tasks.splice(sourceIndex, 1)
            destinationTaskGroup.tasks.splice(result.destination.index, 0, task[0])
        }).addCase(sortTask.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(sortTask.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(editOptionsTask.pending, (state, action) => {
            const { column, value, type, taskGroupId, taskId } = action.meta.arg

            state.loading = state.loading + 1;
            const options = state.board.taskGroups
                .find(x => x._id.toString() === taskGroupId).tasks
                .find(x => x._id.toString() === taskId).options
            const option = options.find(x => x.column.toString() === column)

            if (type === 'status') {
                if (option) option.value = value
                else options.push({ column, value, _id: ObjectId() })
            } else if (type === 'text') {
                if (option) option.value = value
                else options.push({ column, value, _id: ObjectId() })
            }
        }).addCase(editOptionsTask.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(editOptionsTask.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(clearStatusTask.pending, (state, action) => {
            const { taskGroupId, taskId, optionId } = action.meta.arg

            state.loading = state.loading + 1;
            const options = state.board.taskGroups
                .find(x => x._id.toString() === taskGroupId).tasks
                .find(x => x._id.toString() === taskId).options

            const optionIndex = options.indexOf(options.find(x => x.column.toString() === optionId))
            if (optionIndex >= 0) options.splice(optionIndex, 1)
        }).addCase(clearStatusTask.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(clearStatusTask.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(addTaskGroup.pending, (state, action) => {
            const { name, _id } = action.meta.arg

            state.loading = state.loading + 1;
            const taskGroup = { name, tasks: [], _id }
            state.board.taskGroups.push(taskGroup)
        }).addCase(addTaskGroup.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(addTaskGroup.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(editTaskGroupName.pending, (state, action) => {
            const { taskGroupId, name } = action.meta.arg

            state.loading = state.loading + 1;
            state.board.taskGroups.find(x => x._id.toString() === taskGroupId).name = name
        }).addCase(editTaskGroupName.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(editTaskGroupName.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(deleteTaskGroup.pending, (state, action) => {
            const { taskGroupId } = action.meta.arg

            state.loading = state.loading + 1;
            const taskGroup = state.board.taskGroups.find(x => x._id.toString() === taskGroupId)
            state.board.taskGroups.splice(state.board.taskGroups.indexOf(taskGroup), 1)
        }).addCase(deleteTaskGroup.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(deleteTaskGroup.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(sortTaskGroup.pending, (state, action) => {
            const { result } = action.meta.arg

            state.loading = state.loading + 1;
            const [taskgroup] = state.board.taskGroups.splice(result.source.index, 1)
            state.board.taskGroups.splice(result.destination.index, 0, taskgroup)
        }).addCase(sortTaskGroup.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(sortTaskGroup.rejected, (state, action) => {
            state.loading = state.loading - 1;
        })
    }
})

export default boardSlice.reducer