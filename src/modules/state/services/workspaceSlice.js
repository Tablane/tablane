import { api } from './api'

export const workspaceApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchWorkspace: builder.query({
            query: workspaceId => `workspace/${workspaceId}`
        }),
        addBoard: builder.mutation({
            query: ({ workspaceId, spaceId, name, _id }) => ({
                url: `board/${workspaceId}/${spaceId}`,
                method: 'POST',
                body: { name, _id }
            }),
            async onQueryStarted(
                { workspaceId, spaceId, name, _id },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            const board = {
                                _id,
                                name,
                                workspace: workspaceId,
                                attributes: [],
                                taskGroups: [],
                                sharing: false
                            }
                            workspace.spaces
                                .find(space => space._id === spaceId)
                                .boards.push(board)
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
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
                { workspaceId, spaceId, boardId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            workspace.spaces
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
                { workspaceId, spaceId, boardId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            const space = workspace.spaces.find(
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
                { workspaceId, result },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            const source = workspace.spaces.find(
                                x =>
                                    x._id.toString() ===
                                    result.source.droppableId
                            )
                            const destination = workspace.spaces.find(
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
                { workspaceId, name, _id },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            const space = {
                                _id,
                                name,
                                boards: []
                            }
                            workspace.spaces.push(space)
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
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
                { workspaceId, spaceId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
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
                { workspaceId, spaceId, name },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            workspace.spaces = workspace.spaces.filter(
                                space => space._id !== spaceId
                            )
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
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
                { workspaceId, result },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    workspaceApi.util.updateQueryData(
                        'fetchBoard',
                        workspaceId,
                        workspace => {
                            const [space] = workspace.spaces.splice(
                                result.source.index,
                                1
                            )
                            workspace.spaces.splice(
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
