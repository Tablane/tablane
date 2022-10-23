import { api } from './api'
import { toast } from 'react-hot-toast'
import { setCurrentToken } from './authReducer'

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchUser: builder.query({
            query: () => 'user',
            providesTags: ['User']
        }),
        fetchProfile: builder.query({
            query: () => 'user/profile',
            providesTags: ['UserProfile']
        }),
        loginUser: builder.mutation({
            query: args => ({
                url: 'user/login',
                method: 'POST',
                body: { ...args }
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
                    await queryFulfilled
                    localStorage.removeItem('access_token')
                    dispatch(setCurrentToken(null))
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
        }),
        revokeSession: builder.mutation({
            query: ({ sessionId }) => ({
                url: `user/session/${sessionId}`,
                method: 'DELETE'
            })
        }),
        updateProfile: builder.mutation({
            query: ({ name, email, password }) => ({
                url: `user/profile`,
                method: 'PATCH',
                body: { name, email, password }
            })
        }),
        setupTotp: builder.mutation({
            query: args => ({
                url: `user/mfa/totp/setup`,
                method: 'POST',
                body: { ...args }
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error.error.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        }),
        disableTotp: builder.mutation({
            query: args => ({
                url: `user/mfa/totp`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error.error.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        }),
        setupEmail: builder.mutation({
            query: args => ({
                url: `user/mfa/totp/setup`,
                method: 'POST',
                body: { ...args }
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error.error.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        }),
        disableEmail: builder.mutation({
            query: args => ({
                url: `user/mfa/totp`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error.error.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        }),
        sudoMode: builder.mutation({
            query: args => ({
                url: `user/sudoMode`,
                method: 'POST',
                body: { ...args }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCurrentToken(data.accessToken))
                    localStorage.setItem('access_token', data.accessToken)
                } catch (error) {
                    if (error?.error?.data?.message)
                        toast(error.error.data.message)
                    else if (error?.error?.status === 'FETCH_ERROR') {
                        toast('Cannot connect to server')
                    }
                }
            }
        })
    })
})

export const {
    useFetchUserQuery,
    useFetchProfileQuery,
    useLoginUserMutation,
    useRegisterUserMutation,
    useLogoutUserMutation,
    useRevokeSessionMutation,
    useUpdateProfileMutation,
    useSetupTotpMutation,
    useDisableTotpMutation,
    useSudoModeMutation
} = userApi
