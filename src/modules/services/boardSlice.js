import { api } from './api'
import { ObjectId } from '../../utils'
import { toast } from 'react-hot-toast'
import socket from '../../socket/socket'

const setGroupBy = ({ board, groupBy }) => {
    board.groupBy = groupBy
}
const addTask = ({ board, newTaskName, taskGroupId, _id, author }) => {
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
    if (board.groupBy && board.groupBy !== 'empty') {
        task.options.push({
            column: board.groupBy,
            value: taskGroupId
        })
    }
    board.tasks.push(task)
}
const editTaskField = ({ board, taskId, type, value }) => {
    if (type === 'name') {
        board.tasks.find(x => x._id.toString() === taskId).name = value
    } else if (type === 'description') {
        board.tasks.find(x => x._id.toString() === taskId).description = value
    }
}
const deleteTask = ({ board, taskId }) => {
    const task = board.tasks.find(x => x._id.toString() === taskId)
    const taskIndex = board.tasks.indexOf(task)
    board.tasks.splice(taskIndex, 1)
}
const sortTask = ({ board, result, destinationIndex, sourceIndex }) => {
    const task = board.tasks.find(x => x._id.toString() === result.draggableId)
    const column = task.options.find(
        option => option.column.toString() === board.groupBy
    )
    if (column) column.value = result.destination.droppableId
    else if (
        !(
            board.groupBy === 'none' ||
            !board.groupBy ||
            result.destination.droppableId === 'empty'
        )
    ) {
        task.options.push({
            column: board.groupBy,
            value: result.destination.droppableId
        })
    }

    board.tasks.splice(sourceIndex, 1)

    if (destinationIndex < 0) board.tasks.push(task)
    else board.tasks.splice(destinationIndex, 0, task)
}
const editOptionsTask = ({ board, column, value, type, taskId }) => {
    const options = board.tasks.find(x => x._id.toString() === taskId).options
    const option = options.find(x => x.column.toString() === column)

    if (type === 'status') {
        if (option) option.value = value
        else
            options.push({
                column,
                value,
                _id: ObjectId()
            })
    } else if (type === 'text') {
        if (option) option.value = value
        else
            options.push({
                column,
                value,
                _id: ObjectId()
            })
    } else if (type === 'person') {
        if (option) option.value = value
        else options.push({ column, value })
    }
}
const addTaskComment = ({ board, text, author, taskId }) => {
    const comment = {
        type: 'comment',
        author,
        timestamp: new Date().getTime(),
        text
    }

    board.tasks.find(task => task._id === taskId).history.push(comment)
}
const clearStatusTask = ({ board, taskId, optionId }) => {
    const options = board.tasks.find(x => x._id.toString() === taskId).options

    const optionIndex = options.indexOf(
        options.find(x => x.column.toString() === optionId)
    )
    if (optionIndex >= 0) options.splice(optionIndex, 1)
}
const addAttribute = ({ board, type, _id }) => {
    let name = type.charAt(0).toUpperCase() + type.slice(1)
    while (board.attributes.filter(x => x.name === name).length >= 1) {
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
    board.attributes.push(attribute)
}
const editAttributeName = ({ board, name, attributeId }) => {
    board.attributes.find(x => x._id.toString() === attributeId).name = name
}
const deleteAttribute = ({ board, attributeId }) => {
    const attributeIndex = board.attributes.indexOf(
        board.attributes.find(x => x._id.toString() === attributeId)
    )
    if (attributeIndex > -1) board.attributes.splice(attributeIndex, 1)

    board.tasks.map(
        task =>
            (task.options = task.options.filter(
                option => option.column.toString() !== attributeId
            ))
    )
}
const sortAttribute = ({ board, result }) => {
    const [attribute] = board.attributes.splice(result.source.index, 1)
    board.attributes.splice(result.destination.index, 0, attribute)
}
const editAttributeLabels = ({ board, name, labels }) => {
    board.attributes.find(x => x.name === name).labels = labels
}
const addWatcher = ({ board, task, user }) => {
    board.tasks.find(x => x._id === task._id).watcher.push(user)
}
const removeWatcher = ({ board, task, user }) => {
    const localTask = board.tasks.find(x => x._id === task._id)
    localTask.watcher = localTask.watcher.filter(x => x._id !== user._id)
}
const setSharing = ({ board, share }) => {
    board.sharing = share
}

export const boardApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchBoard: builder.query({
            query: boardId => `board/${boardId}`,
            async onCacheEntryAdded(
                boardId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded
                    socket.emit('subscribe', boardId)

                    socket.on(boardId, ({ event, body }) => {
                        switch (event) {
                            case 'setGroupBy':
                                updateCachedData(board =>
                                    setGroupBy({ board, ...body })
                                )
                                break
                            case 'addTask':
                                updateCachedData(board =>
                                    addTask({ board, ...body })
                                )
                                break
                            case 'editTaskField':
                                updateCachedData(board =>
                                    editTaskField({ board, ...body })
                                )
                                break
                            case 'deleteTask':
                                updateCachedData(board =>
                                    deleteTask({ board, ...body })
                                )
                                break
                            case 'sortTask':
                                updateCachedData(board =>
                                    sortTask({ board, ...body })
                                )
                                break
                            case 'editOptionsTask':
                                updateCachedData(board =>
                                    editOptionsTask({ board, ...body })
                                )
                                break
                            case 'addTaskComment':
                                updateCachedData(board =>
                                    addTaskComment({ board, ...body })
                                )
                                break
                            case 'clearStatusTask':
                                updateCachedData(board =>
                                    clearStatusTask({ board, ...body })
                                )
                                break
                            case 'addAttribute':
                                updateCachedData(board =>
                                    addAttribute({ board, ...body })
                                )
                                break
                            case 'editAttributeName':
                                updateCachedData(board =>
                                    editAttributeName({ board, ...body })
                                )
                                break
                            case 'deleteAttribute':
                                updateCachedData(board =>
                                    deleteAttribute({ board, ...body })
                                )
                                break
                            case 'sortAttribute':
                                updateCachedData(board =>
                                    sortAttribute({ board, ...body })
                                )
                                break
                            case 'editAttributeLabels':
                                updateCachedData(board =>
                                    editAttributeLabels({ board, ...body })
                                )
                                break
                            case 'addWatcher':
                                updateCachedData(board =>
                                    addWatcher({ board, ...body })
                                )
                                break
                            case 'removeWatcher':
                                updateCachedData(board =>
                                    removeWatcher({ board, ...body })
                                )
                                break
                            case 'setSharing':
                                updateCachedData(board =>
                                    setSharing({ board, ...body })
                                )
                                break
                            default:
                                console.log('unknown update:', event)
                        }
                    })
                } catch {}
                await cacheEntryRemoved
                socket.emit('unsubscribe', boardId)
            }
        }),
        setGroupBy: builder.mutation({
            query: ({ boardId, groupBy }) => ({
                url: `board/${boardId}`,
                method: 'PATCH',
                body: { groupBy }
            }),
            async onQueryStarted(
                { boardId, groupBy },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => setGroupBy({ board, groupBy })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        addTask: builder.mutation({
            query: ({ boardId, newTaskName, taskGroupId, _id }) => ({
                url: `task/${boardId}`,
                method: 'POST',
                body: {
                    _id,
                    name: newTaskName,
                    taskGroupId
                }
            }),
            async onQueryStarted(
                { boardId, newTaskName, taskGroupId, _id, author },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board =>
                            addTask({
                                board,
                                newTaskName,
                                taskGroupId,
                                _id,
                                author
                            })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        editTaskField: builder.mutation({
            query: ({ boardId, taskId, type, value }) => ({
                url: `task/${boardId}/${taskId}`,
                method: 'PATCH',
                body: {
                    type,
                    value
                }
            }),
            async onQueryStarted(
                { taskId, type, value, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => editTaskField({ board, taskId, type, value })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        deleteTask: builder.mutation({
            query: ({ boardId, taskId }) => ({
                url: `task/${boardId}/${taskId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { taskId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => deleteTask({ board, taskId })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        sortTask: builder.mutation({
            query: ({ result, destinationIndex, sourceIndex, boardId }) => ({
                url: `task/${boardId}`,
                method: 'PATCH',
                body: {
                    result,
                    destinationIndex,
                    sourceIndex
                }
            }),
            async onQueryStarted(
                { result, destinationIndex, sourceIndex, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board =>
                            sortTask({
                                board,
                                result,
                                destinationIndex,
                                sourceIndex,
                                boardId
                            })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        editOptionsTask: builder.mutation({
            query: ({ taskId, column, value, type, boardId }) => ({
                url: `task/${boardId}/${taskId}`,
                method: 'PATCH',
                body: {
                    column,
                    value,
                    type
                }
            }),
            async onQueryStarted(
                { column, value, type, taskId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board =>
                            editOptionsTask({
                                board,
                                column,
                                value,
                                type,
                                taskId
                            })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        addTaskComment: builder.mutation({
            query: ({ taskId, text, boardId }) => ({
                url: `task/${boardId}/${taskId}`,
                method: 'POST',
                body: {
                    text
                }
            }),
            async onQueryStarted(
                { text, author, taskId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board =>
                            addTaskComment({
                                board,
                                text,
                                author,
                                taskId,
                                boardId
                            })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        clearStatusTask: builder.mutation({
            query: ({ boardId, taskId, optionId }) => ({
                url: `task/${boardId}/${taskId}/${optionId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { taskId, optionId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => clearStatusTask({ board, taskId, optionId })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        addAttribute: builder.mutation({
            query: ({ boardId, type, _id }) => ({
                url: `attribute/${boardId}`,
                method: 'POST',
                body: { type, _id }
            }),
            async onQueryStarted(
                { type, _id, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => addAttribute({ board, type, _id })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        editAttributeName: builder.mutation({
            query: ({ attributeId, name, boardId }) => ({
                url: `attribute/${boardId}/${attributeId}`,
                method: 'PATCH',
                body: { name }
            }),
            async onQueryStarted(
                { name, attributeId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => editAttributeName({ board, name, attributeId })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        deleteAttribute: builder.mutation({
            query: ({ attributeId, boardId }) => ({
                url: `attribute/${boardId}/${attributeId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { attributeId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => deleteAttribute({ board, attributeId })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        sortAttribute: builder.mutation({
            query: ({ result, boardId }) => ({
                url: `attribute/${boardId}`,
                method: 'PATCH',
                body: { result }
            }),
            async onQueryStarted(
                { result, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => sortAttribute({ board, result })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        editAttributeLabels: builder.mutation({
            query: ({ name, labels, boardId }) => ({
                url: `attribute/${boardId}`,
                method: 'PUT',
                body: { name, labels }
            }),
            async onQueryStarted(
                { name, labels, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => editAttributeLabels({ board, name, labels })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        addWatcher: builder.mutation({
            query: ({ task, user }) => ({
                url: `task/watcher/${task._id}`,
                method: 'POST',
                body: { userId: user._id }
            }),
            async onQueryStarted(
                { task, user, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => addWatcher({ board, task, user })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        removeWatcher: builder.mutation({
            query: ({ task, user }) => ({
                url: `task/watcher/${task._id}`,
                method: 'DELETE',
                body: { userId: user._id }
            }),
            async onQueryStarted(
                { task, user, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => removeWatcher({ board, task, user })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        setSharing: builder.mutation({
            query: ({ boardId, share }) => ({
                url: `board/share/${boardId}`,
                method: 'PATCH',
                body: { share }
            }),
            async onQueryStarted(
                { boardId, share },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData(
                        'fetchBoard',
                        boardId,
                        board => setSharing({ board, share })
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        })
    })
})

export const {
    useFetchBoardQuery,
    useSetGroupByMutation,
    useAddTaskMutation,
    useEditTaskFieldMutation,
    useDeleteTaskMutation,
    useSortTaskMutation,
    useEditOptionsTaskMutation,
    useAddTaskCommentMutation,
    useClearStatusTaskMutation,
    useAddAttributeMutation,
    useEditAttributeNameMutation,
    useDeleteAttributeMutation,
    useSortAttributeMutation,
    useEditAttributeLabelsMutation,
    useAddWatcherMutation,
    useRemoveWatcherMutation,
    useSetSharingMutation
} = boardApi
