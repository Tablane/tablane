import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { ObjectId } from '../../../utils'

export const fetchBoard = createAsyncThunk(
    'board/fetchBoard',
    async boardId => {
        const response = await axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${boardId}`
        })
        return response.data
    }
)

export const setGroupBy = createAsyncThunk(
    'board/setGroupBy',
    async ({ boardId, _id }) => {
        const response = await axios({
            method: 'PATCH',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${boardId}`,
            data: { _id }
        })
        return response.data
    }
)

export const addTask = createAsyncThunk(
    'board/addTask',
    async ({ boardId, newTaskName, taskGroupId, _id }) => {
        const response = await axios({
            method: 'POST',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}`,
            data: {
                _id,
                name: newTaskName,
                taskGroupId
            }
        })
        return response.data
    }
)

export const editTaskField = createAsyncThunk(
    'board/editTaskName',
    async ({ boardId, taskId, type, value }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskId}`,
            method: 'PATCH',
            withCredentials: true,
            data: {
                type,
                value
            }
        })
        return response.data
    }
)

export const deleteTask = createAsyncThunk(
    'board/deleteTask',
    async ({ boardId, taskId }) => {
        const response = await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskId}`
        })
        return response.data
    }
)

export const sortTask = createAsyncThunk(
    'board/sortTask',
    async ({ result, destinationIndex, sourceIndex }, { getState }) => {
        const response = await axios({
            method: 'PATCH',
            withCredentials: true,
            data: {
                result,
                destinationIndex,
                sourceIndex
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${
                getState().board.board._id
            }`
        })
        return response.data
    }
)

export const editOptionsTask = createAsyncThunk(
    'board/editOptionsTask',
    async ({ taskId, column, value, type }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${
                getState().board.board._id
            }/${taskId}`,
            method: 'PATCH',
            withCredentials: true,
            data: {
                column,
                value,
                type
            }
        })
        return response.data
    }
)

export const addTaskComment = createAsyncThunk(
    'board/addTaskComment',
    async ({ taskId, text }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${
                getState().board.board._id
            }/${taskId}`,
            method: 'POST',
            withCredentials: true,
            data: {
                text
            }
        })
        return response.data
    }
)

export const clearStatusTask = createAsyncThunk(
    'board/clearStatusTask',
    async ({ boardId, taskId, optionId }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${boardId}/${taskId}/${optionId}`,
            method: 'DELETE',
            withCredentials: true
        })
        return response.data
    }
)

export const addAttribute = createAsyncThunk(
    'board/addAttribute',
    async ({ type, _id }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${
                getState().board.board._id
            }`,
            method: 'POST',
            withCredentials: true,
            data: { type, _id }
        })
        return response.data
    }
)

export const editAttributeName = createAsyncThunk(
    'board/editAttributeName',
    async ({ attributeId, name }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${
                getState().board.board._id
            }/${attributeId}`,
            method: 'PATCH',
            withCredentials: true,
            data: { name }
        })
        return response.data
    }
)

export const deleteAttribute = createAsyncThunk(
    'board/deleteAttribute',
    async ({ attributeId }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${
                getState().board.board._id
            }/${attributeId}`,
            method: 'DELETE',
            withCredentials: true
        })
        return response.data
    }
)

export const sortAttribute = createAsyncThunk(
    'board/sortAttribute',
    async ({ result }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${
                getState().board.board._id
            }`,
            method: 'PATCH',
            withCredentials: true,
            data: { result }
        })
        return response.data
    }
)

export const editAttributeLabels = createAsyncThunk(
    'board/editAttributeLabels',
    async ({ name, labels }, { getState }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${
                getState().board.board._id
            }`,
            method: 'PUT',
            withCredentials: true,
            data: { name, labels }
        })
        return response.data
    }
)

export const addWatcher = createAsyncThunk(
    'board/addWatcher',
    async ({ task, user }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/watcher/${task._id}`,
            method: 'POST',
            withCredentials: true,
            data: { userId: user._id }
        })
        return response.data
    }
)

export const removeWatcher = createAsyncThunk(
    'board/removeWatcher',
    async ({ task, user }) => {
        const response = await axios({
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/watcher/${task._id}`,
            method: 'DELETE',
            withCredentials: true,
            data: { userId: user._id }
        })
        return response.data
    }
)

const boardSlice = createSlice({
    name: 'board',
    initialState: { loading: 0 },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchBoard.pending, (state, action) => {
                state.board = null
                state.loading = state.loading + 1
            })
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.board = action.payload
                state.loading = state.loading - 1
            })
            .addCase(fetchBoard.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(setGroupBy.pending, (state, action) => {
                const { _id } = action.meta.arg

                state.board.groupBy = _id
                state.loading = state.loading + 1
            })
            .addCase(setGroupBy.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(setGroupBy.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addTask.pending, (state, action) => {
                const { newTaskName, taskGroupId, _id, author } =
                    action.meta.arg

                state.loading = state.loading + 1
                const task = {
                    _id,
                    name: newTaskName,
                    options: [],
                    watcher: [],
                    history: [
                        {
                            type: 'activity',
                            author,
                            text: 'created this task',
                            timestamp: new Date().getTime()
                        }
                    ]
                }
                if (state.board.groupBy) {
                    task.options.push({
                        column: state.board.groupBy,
                        value: taskGroupId
                    })
                }
                state.board.tasks.push(task)
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editTaskField.pending, (state, action) => {
                const { taskId, type, value } = action.meta.arg

                state.loading = state.loading + 1
                if (type === 'name') {
                    state.board.tasks.find(
                        x => x._id.toString() === taskId
                    ).name = value
                } else if (type === 'description') {
                    state.board.tasks.find(
                        x => x._id.toString() === taskId
                    ).description = value
                }
            })
            .addCase(editTaskField.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editTaskField.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(deleteTask.pending, (state, action) => {
                const { taskId } = action.meta.arg

                state.loading = state.loading + 1
                const task = state.board.tasks.find(
                    x => x._id.toString() === taskId
                )
                const taskIndex = state.board.tasks.indexOf(task)
                state.board.tasks.splice(taskIndex, 1)
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(sortTask.pending, (state, action) => {
                const { result, destinationIndex, sourceIndex } =
                    action.meta.arg

                state.loading = state.loading + 1
                const task = state.board.tasks.find(
                    x => x._id.toString() === result.draggableId
                )
                const column = task.options.find(
                    option => option.column.toString() === state.board.groupBy
                )
                if (column) column.value = result.destination.droppableId
                else if (
                    !(
                        state.board.groupBy === 'none' ||
                        !state.board.groupBy ||
                        result.destination.droppableId === 'empty'
                    )
                ) {
                    task.options.push({
                        column: state.board.groupBy,
                        value: result.destination.droppableId
                    })
                }

                state.board.tasks.splice(sourceIndex, 1)

                if (destinationIndex < 0) state.board.tasks.push(task)
                else state.board.tasks.splice(destinationIndex, 0, task)
            })
            .addCase(sortTask.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(sortTask.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editOptionsTask.pending, (state, action) => {
                const { column, value, type, taskId } = action.meta.arg

                state.loading = state.loading + 1
                const options = state.board.tasks.find(
                    x => x._id.toString() === taskId
                ).options
                const option = options.find(x => x.column.toString() === column)

                if (type === 'status') {
                    if (option) option.value = value
                    else options.push({ column, value, _id: ObjectId() })
                } else if (type === 'text') {
                    if (option) option.value = value
                    else options.push({ column, value, _id: ObjectId() })
                } else if (type === 'person') {
                    if (option) option.value = value
                    else options.push({ column, value })
                }
            })
            .addCase(editOptionsTask.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editOptionsTask.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addTaskComment.pending, (state, action) => {
                const { text, author, taskId } = action.meta.arg

                state.loading = state.loading + 1
                const comment = {
                    type: 'comment',
                    author,
                    timestamp: new Date().getTime(),
                    text
                }

                state.board.tasks
                    .find(task => task._id === taskId)
                    .history.push(comment)
            })
            .addCase(addTaskComment.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addTaskComment.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(clearStatusTask.pending, (state, action) => {
                const { taskId, optionId } = action.meta.arg

                state.loading = state.loading + 1
                const options = state.board.tasks.find(
                    x => x._id.toString() === taskId
                ).options

                const optionIndex = options.indexOf(
                    options.find(x => x.column.toString() === optionId)
                )
                if (optionIndex >= 0) options.splice(optionIndex, 1)
            })
            .addCase(clearStatusTask.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(clearStatusTask.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addAttribute.pending, (state, action) => {
                const { type, _id } = action.meta.arg

                state.loading = state.loading + 1

                let name = type.charAt(0).toUpperCase() + type.slice(1)
                while (
                    state.board.attributes.filter(x => x.name === name)
                        .length >= 1
                ) {
                    if (/ \d$/gm.test(name)) {
                        name =
                            name.substring(0, name.length - 1) +
                            ` ${parseInt(name.slice(-1)) + 1}`
                    } else name = name + ' 1'
                }

                let attribute = {
                    name,
                    type: type,
                    _id
                }
                if (type === 'status') attribute.labels = []
                state.board.attributes.push(attribute)
            })
            .addCase(addAttribute.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addAttribute.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editAttributeName.pending, (state, action) => {
                const { name, attributeId } = action.meta.arg

                state.loading = state.loading + 1
                state.board.attributes.find(
                    x => x._id.toString() === attributeId
                ).name = name
            })
            .addCase(editAttributeName.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editAttributeName.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(deleteAttribute.pending, (state, action) => {
                const { attributeId } = action.meta.arg

                state.loading = state.loading + 1
                const attributeIndex = state.board.attributes.indexOf(
                    state.board.attributes.find(
                        x => x._id.toString() === attributeId
                    )
                )
                if (attributeIndex > -1)
                    state.board.attributes.splice(attributeIndex, 1)

                state.board.tasks.map(
                    task =>
                        (task.options = task.options.filter(
                            option => option.column.toString() !== attributeId
                        ))
                )
            })
            .addCase(deleteAttribute.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(deleteAttribute.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(sortAttribute.pending, (state, action) => {
                const { result } = action.meta.arg

                state.loading = state.loading + 1
                const [attribute] = state.board.attributes.splice(
                    result.source.index,
                    1
                )
                state.board.attributes.splice(
                    result.destination.index,
                    0,
                    attribute
                )
            })
            .addCase(sortAttribute.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(sortAttribute.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editAttributeLabels.pending, (state, action) => {
                const { name, labels } = action.meta.arg

                state.loading = state.loading + 1
                state.board.attributes.find(x => x.name === name).labels =
                    labels
            })
            .addCase(editAttributeLabels.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(editAttributeLabels.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addWatcher.pending, (state, action) => {
                const { task, user } = action.meta.arg

                state.loading = state.loading + 1
                state.board.tasks
                    .find(x => x._id === task._id)
                    .watcher.push(user)
            })
            .addCase(addWatcher.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(addWatcher.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(removeWatcher.pending, (state, action) => {
                const { task, user } = action.meta.arg

                state.loading = state.loading + 1
                const localTask = state.board.tasks.find(
                    x => x._id === task._id
                )
                localTask.watcher = localTask.watcher.filter(
                    x => x._id !== user._id
                )
            })
            .addCase(removeWatcher.fulfilled, (state, action) => {
                state.loading = state.loading - 1
            })
            .addCase(removeWatcher.rejected, (state, action) => {
                state.loading = state.loading - 1
            })
    }
})

export default boardSlice.reducer
