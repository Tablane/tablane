import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWorkspace = createAsyncThunk('board/fetchWorkspace', async (workspaceId) => {
    const response = await axios({
        method: 'GET',
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/${workspaceId}`
    });
    return response.data
})

export const addBoard = createAsyncThunk('board/addBoard', async ({ workspaceId, spaceId, name, _id }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${workspaceId}/${spaceId}`,
        method: 'POST',
        withCredentials: true,
        data: { name, _id }
    })
    return response.data
})

export const editBoardName = createAsyncThunk('board/editBoardName', async ({ boardId, name }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${boardId}`,
        method: 'PATCH',
        withCredentials: true,
        data: { name }
    })
    return response.data
})

export const deleteBoard = createAsyncThunk('board/deleteBoard', async ({ workspaceId, spaceId, boardId }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${workspaceId}/${spaceId}/${boardId}`,
        method: 'DELETE',
        withCredentials: true,
    })
    return response.data
})

export const sortBoard = createAsyncThunk('board/sortBoard', async ({ workspaceId, result }) => {
    const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/drag/${workspaceId}`,
        method: 'PATCH',
        withCredentials: true,
        data: { result },
    })
    return response.data
})

const boardSlice = createSlice({
    name: 'board',
    initialState: { loading: 0 },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchWorkspace.pending, (state, action) => {
            state.workspace = null
            state.loading = state.loading + 1;
        }).addCase(fetchWorkspace.fulfilled, (state, action) => {
            state.workspace = action.payload
            state.loading = state.loading - 1;
        }).addCase(fetchWorkspace.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(addBoard.pending, (state, action) => {
            const { workspaceId, spaceId, name, _id } = action.meta.arg
            state.loading = state.loading + 1;

            const board = {
                _id,
                name,
                workspace: workspaceId,
                attributes: [],
                taskGroups: [],
                sharing: false
            }
            state.workspace.spaces.find(space => space._id === spaceId).boards.push(board)
        }).addCase(addBoard.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(addBoard.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(editBoardName.pending, (state, action) => {
            const { spaceId, boardId, name } = action.meta.arg

            state.loading = state.loading + 1;
            state.workspace.spaces
                .find(space => space._id === spaceId).boards
                .find(board => board._id === boardId).name = name
        }).addCase(editBoardName.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(editBoardName.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(deleteBoard.pending, (state, action) => {
            const { spaceId, boardId } = action.meta.arg

            state.loading = state.loading + 1;
            const space = state.workspace.spaces.find(x => x._id.toString() === spaceId)
            space.boards = space.boards.filter(board => board._id !== boardId)
        }).addCase(deleteBoard.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(deleteBoard.rejected, (state, action) => {
            state.loading = state.loading - 1;


        }).addCase(sortBoard.pending, (state, action) => {
            const { result } = action.meta.arg

            const source = state.workspace.spaces.find(x => x._id.toString() === result.source.droppableId)
            const destination = state.workspace.spaces.find(x => x._id.toString() === result.destination.droppableId)

            const [board] = source.boards.splice(result.source.index, 1)
            destination.boards.splice(result.destination.index, 0, board)


            state.loading = state.loading + 1;
        }).addCase(sortBoard.fulfilled, (state, action) => {
            state.loading = state.loading - 1;
        }).addCase(sortBoard.rejected, (state, action) => {
            state.loading = state.loading - 1;
        })
    }
})

export default boardSlice.reducer