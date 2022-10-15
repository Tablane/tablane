import { api } from './api'
import { toast } from 'react-hot-toast'
import { setCurrentToken } from './authReducer'

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchUser: builder.query({
            query: () => 'user',
            providesTags: ['User']
        }),
        loginUser: builder.mutation({
            query: ({ email, password }) => ({
                url: 'user/login',
                method: 'POST',
                body: { email, password }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    if (data?.success) {
                        localStorage.setItem('access_token', data.accessToken)
                        dispatch(setCurrentToken(data.accessToken))
                        dispatch(
                            userApi.util.updateQueryData(
                                'fetchUser',
                                undefined,
                                user => data.user
                            )
                        )
                    }
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error?.error?.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        }),
        registerUser: builder.mutation({
            query: ({ username, password, email }) => ({
                url: 'user/register',
                method: 'POST',
                body: { username, password, email }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const patchResult = dispatch(
                        userApi.util.updateQueryData(
                            'fetchUser',
                            undefined,
                            user => {
                                return { ...data.user }
                            }
                        )
                    )
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error.error.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'user/logout',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    localStorage.removeItem('access_token')
                    dispatch(
                        userApi.util.updateQueryData(
                            'fetchUser',
                            undefined,
                            user => {
                                return { success: false, message: 'logged out' }
                            }
                        )
                    )
                } catch (e) {
                    console.log(e)
                }
            }
        })
    })
})

export const {
    useFetchUserQuery,
    useLoginUserMutation,
    useRegisterUserMutation,
    useLogoutUserMutation
} = userApi
