import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const boardApi = createApi({
    reducerPath: 'boardApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/board/' }),
    tagTypes: ['Board'],
    endpoints: builder => ({
        fetchBoard: builder.query({
            query: boardId => '/:boardId'
        })
    })
})

export const { useFetchBoardQuery } = boardApi
