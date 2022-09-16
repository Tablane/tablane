import { api } from './api'

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchUser: builder.query({
            query: () => 'user'
        }),
        loginUser: builder.mutation({
            query: (username, password) => ({
                url: 'user/login',
                method: 'POST',
                body: { username, password }
            })
        }),
        registerUser: builder.mutation({
            query: (username, password, email) => ({
                url: 'user/register',
                method: 'POST',
                body: { username, password, email }
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'user/logout',
                method: 'GET'
            })
        })
    })
})

export const {
    useFetchUserQuery,
    useLoginUserMutation,
    useRegisterUserMutation,
    useLogoutUserMutation
} = userApi
