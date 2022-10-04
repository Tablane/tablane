import { api } from './api'
import { toast } from 'react-hot-toast'
import socket from '../../socket/socket'

const addBoard = data => {
    const { workspace, workspaceId, spaceId, name, _id } = data
    const board = {
        _id,
        name,
        workspace: workspaceId,
        attributes: [],
        taskGroups: [],
        sharing: false
    }
    workspace.spaces.find(space => space._id === spaceId).boards.push(board)
    return workspace
}
const editBoardName = ({ workspace, spaceId, boardId, name }) => {
    workspace.spaces
        .find(space => space._id === spaceId)
        .boards.find(board => board._id === boardId).name = name
}
const deleteBoard = ({ workspace, spaceId, boardId }) => {
    const space = workspace.spaces.find(x => x._id.toString() === spaceId)
    space.boards = space.boards.filter(board => board._id !== boardId)
}
const sortBoard = ({ workspace, result }) => {
    const source = workspace.spaces.find(
        x => x._id.toString() === result.source.droppableId
    )
    const destination = workspace.spaces.find(
        x => x._id.toString() === result.destination.droppableId
    )

    const [board] = source.boards.splice(result.source.index, 1)
    destination.boards.splice(result.destination.index, 0, board)
}
const addSpace = ({ workspace, name, _id }) => {
    const space = {
        _id,
        name,
        boards: []
    }
    workspace.spaces.push(space)
}
const editSpaceName = ({ workspace, spaceId, name }) => {
    workspace.spaces.find(space => space._id === spaceId).name = name
}
const deleteSpace = ({ workspace, spaceId }) => {
    workspace.spaces = workspace.spaces.filter(space => space._id !== spaceId)
}
const sortSpace = ({ workspace, result }) => {
    const [space] = workspace.spaces.splice(result.source.index, 1)
    workspace.spaces.splice(result.destination.index, 0, space)
}

export const workspaceApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchWorkspace: builder.query({
            query: workspaceId => `workspace/${workspaceId}`,
            async onCacheEntryAdded(
                workspaceId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded
                    socket.emit('subscribe', workspaceId)

                    socket.on(workspaceId, ({ event, body }) => {
                        switch (event) {
                            case 'addBoard':
                                updateCachedData(workspace =>
                                    addBoard({
                                        workspace,
                                        workspaceId: data._id,
                                        ...body
                                    })
                                )
                                break
                            case 'deleteBoard':
                                updateCachedData(workspace =>
                                    deleteBoard({ workspace, ...body })
                                )
                                break
                            case 'editBoardName':
                                updateCachedData(workspace =>
                                    editBoardName({ workspace, ...body })
                                )
                                break
                            case 'sortBoard':
                                updateCachedData(workspace =>
                                    sortBoard({ workspace, ...body })
                                )
                                break
                            case 'addSpace':
                                updateCachedData(workspace =>
                                    addSpace({ workspace, ...body })
                                )
                                break
                            case 'editSpaceName':
                                updateCachedData(workspace =>
                                    editSpaceName({ workspace, ...body })
                                )
                                break
                            case 'deleteSpace':
                                updateCachedData(workspace =>
                                    deleteSpace({ workspace, ...body })
                                )
                                break
                            case 'sortSpace':
                                updateCachedData(workspace =>
                                    sortSpace({ workspace, ...body })
                                )
                                break
                            default:
                                console.log('unknown update:', event)
                        }
                    })
                } catch {}
                await cacheEntryRemoved
                socket.emit('unsubscribe', workspaceId)
            }
        }),
        addBoard: builder.mutation({
            query: ({ workspaceId, spaceId, name, _id }) => ({
                url: `board/${workspaceId}/${spaceId}`,
                method: 'POST',
                body: { name, _id }
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, spaceId, name, _id },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace =>
                            addBoard({
                                workspace,
                                workspaceId,
                                spaceId,
                                name,
                                _id
                            })
                    )
                )
                try {
                    await queryFulfilled
                } catch (err) {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        editBoardName: builder.mutation({
            query: ({ boardId, name }) => ({
                url: `board/${boardId}`,
                method: 'PATCH',
                body: { name }
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, spaceId, boardId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace =>
                            editBoardName({ workspace, spaceId, boardId, name })
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
        deleteBoard: builder.mutation({
            query: ({ workspaceId, spaceId, boardId }) => ({
                url: `board/${workspaceId}/${spaceId}/${boardId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, spaceId, boardId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace =>
                            deleteBoard({ workspace, spaceId, boardId })
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
        sortBoard: builder.mutation({
            query: ({ workspaceId, result }) => ({
                url: `board/drag/${workspaceId}`,
                method: 'PATCH',
                body: { result }
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, result },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace => sortBoard({ workspace, result })
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
        addSpace: builder.mutation({
            query: ({ workspaceId, name, _id }) => ({
                url: `space/${workspaceId}`,
                method: 'POST',
                body: { name, _id }
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, name, _id },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace => addSpace({ workspace, name, _id })
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
        editSpaceName: builder.mutation({
            query: ({ workspaceId, spaceId, name }) => ({
                url: `space/${workspaceId}/${spaceId}`,
                method: 'PATCH',
                body: { name }
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, spaceId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace => editSpaceName({ workspace, spaceId, name })
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
        deleteSpace: builder.mutation({
            query: ({ workspaceId, spaceId }) => ({
                url: `space/${workspaceId}/${spaceId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, spaceId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace => deleteSpace({ workspace, spaceId })
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
        sortSpace: builder.mutation({
            query: ({ workspaceId, result }) => ({
                url: `space/drag/${workspaceId}`,
                method: 'PATCH',
                body: { result }
            }),
            async onQueryStarted(
                { workspaceId, workspaceIdFriendly, result },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspaceIdFriendly.toString(),
                        workspace => sortSpace({ workspace, result })
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
    useFetchWorkspaceQuery,
    useAddBoardMutation,
    useEditBoardNameMutation,
    useDeleteBoardMutation,
    useSortBoardMutation,
    useAddSpaceMutation,
    useEditSpaceNameMutation,
    useDeleteSpaceMutation,
    useSortSpaceMutation
} = workspaceApi
