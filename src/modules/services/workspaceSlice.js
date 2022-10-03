import { api } from './api'
import { toast } from 'react-hot-toast'

export const workspaceApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchWorkspace: builder.query({
            query: workspaceId => `workspace/${workspaceId}`
        }),
        addBoard: builder.mutation({
            query: ({ workspace, spaceId, name, _id }) => ({
                url: `board/${workspace._id}/${spaceId}`,
                method: 'POST',
                body: { name, _id }
            }),
            async onQueryStarted(
                { workspace, spaceId, name, _id },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            const board = {
                                _id,
                                name,
                                workspace: workspace._id,
                                attributes: [],
                                taskGroups: [],
                                sharing: false
                            }
                            localWorkspace.spaces
                                .find(space => space._id === spaceId)
                                .boards.push(board)
                            return localWorkspace
                        }
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
        editBoardName: builder.mutation({
            query: ({ boardId, name }) => ({
                url: `board/${boardId}`,
                method: 'PATCH',
                body: { name }
            }),
            async onQueryStarted(
                { workspace, spaceId, boardId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            localWorkspace.spaces
                                .find(space => space._id === spaceId)
                                .boards.find(
                                    board => board._id === boardId
                                ).name = name
                        }
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
            query: ({ workspace, spaceId, boardId }) => ({
                url: `board/${workspace._id}/${spaceId}/${boardId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { workspace, spaceId, boardId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            const space = localWorkspace.spaces.find(
                                x => x._id.toString() === spaceId
                            )
                            space.boards = space.boards.filter(
                                board => board._id !== boardId
                            )
                        }
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
            query: ({ workspace, result }) => ({
                url: `board/drag/${workspace._id}`,
                method: 'PATCH',
                body: { result }
            }),
            async onQueryStarted(
                { workspace, result },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            const source = localWorkspace.spaces.find(
                                x =>
                                    x._id.toString() ===
                                    result.source.droppableId
                            )
                            const destination = localWorkspace.spaces.find(
                                x =>
                                    x._id.toString() ===
                                    result.destination.droppableId
                            )

                            const [board] = source.boards.splice(
                                result.source.index,
                                1
                            )
                            destination.boards.splice(
                                result.destination.index,
                                0,
                                board
                            )
                        }
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
            query: ({ workspace, name, _id }) => ({
                url: `space/${workspace._id}`,
                method: 'POST',
                body: { name, _id }
            }),
            async onQueryStarted(
                { workspace, name, _id },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            const space = {
                                _id,
                                name,
                                boards: []
                            }
                            localWorkspace.spaces.push(space)
                        }
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
            query: ({ workspace, spaceId, name }) => ({
                url: `space/${workspace._id}/${spaceId}`,
                method: 'PATCH',
                body: { name }
            }),
            async onQueryStarted(
                { workspace, spaceId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        workspace => {
                            workspace.spaces.find(
                                space => space._id === spaceId
                            ).name = name
                        }
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
            query: ({ workspace, spaceId }) => ({
                url: `space/${workspace._id}/${spaceId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(
                { workspace, spaceId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            localWorkspace.spaces =
                                localWorkspace.spaces.filter(
                                    space => space._id !== spaceId
                                )
                        }
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
            query: ({ workspace, result }) => ({
                url: `space/drag/${workspace._id}`,
                method: 'PATCH',
                body: { result }
            }),
            async onQueryStarted(
                { workspace, result },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchWorkspace',
                        workspace.id.toString(),
                        localWorkspace => {
                            const [space] = localWorkspace.spaces.splice(
                                result.source.index,
                                1
                            )
                            localWorkspace.spaces.splice(
                                result.destination.index,
                                0,
                                space
                            )
                        }
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
