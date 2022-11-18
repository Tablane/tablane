import { api } from './api'
import handleQueryError from '../../utils/handleQueryError'

export const boardApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchSharedBoard: builder.query({
            query: boardId => `board/share/${boardId}`,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err, silent: true })
                }
            }
        })
    })
})

export const { useFetchSharedBoardQuery } = boardApi
