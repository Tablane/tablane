import { api } from './api'

export const workspaceApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchWorkspace: builder.query({
            query: workspaceId => `workspace/${workspaceId}`
        }),
        loginUser: builder.mutation({
            query: (username, password) => ({
                url: 'workspace/',
                method: 'POST',
                body: { username, password }
            })
        }),
        registerUser: builder.mutation({
            query: (username, password, email) => ({
                url: 'workspace/ter',
                method: 'POST',
                body: { username, password, email }
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'workspace/t',
                method: 'GET'
            })
        })
    })
})

export const { useFetchWorkspaceQuery } = workspaceApi
