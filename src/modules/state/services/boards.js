import { api } from './api'

export const boardApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchBoard: builder.query({
            query: boardId => `board/${boardId}`
        })
    })
})

export const { useFetchBoardQuery } = boardApi
