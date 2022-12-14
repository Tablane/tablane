import { api } from './api'
import { toast } from 'react-hot-toast'
import { setCurrentToken } from './authReducer'
import handleQueryError from '../../utils/handleQueryError'
import posthog from 'posthog-js'

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchUser: builder.query({
            query: () => 'user',
            providesTags: ['User']
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
                        posthog.identify(data.user._id, {
                            email: data.user.email,
                            username: data.user.username
                        })
                        console.log(data.user)
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
                } catch (err) {
                    handleQueryError({ err })
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
                } catch (err) {
                    handleQueryError({ err })
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
                    posthog.reset()
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
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        revokeSession: builder.mutation({
            query: ({ sessionId }) => ({
                url: `user/session/${sessionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Session']
        }),
        updateProfile: builder.mutation({
            query: ({ name, email, password }) => ({
                url: `user/profile`,
                method: 'PATCH',
                body: { name, email, password }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    if (data.message) toast(data.message)
                } catch (err) {
                    handleQueryError({ err })
                }
            }
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
                } catch (err) {
                    handleQueryError({ err })
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
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        setupEmail: builder.mutation({
            query: args => ({
                url: `user/mfa/email/setup`,
                method: 'POST',
                body: { ...args }
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        disableEmail: builder.mutation({
            query: args => ({
                url: `user/mfa/email`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        setupBackupCodes: builder.mutation({
            query: args => ({
                url: `user/mfa/backupCodes/setup`,
                method: 'POST',
                body: { ...args }
            }),
            invalidatesTags: ['User', 'BackupCodes'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        disableBackupCodes: builder.mutation({
            query: args => ({
                url: `user/mfa/backupCodes`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User', 'BackupCodes'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        regenerateBackupCodes: builder.mutation({
            query: args => ({
                url: `user/mfa/backupCodes/regenerate`,
                method: 'PUT'
            }),
            invalidatesTags: ['BackupCodes'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        }),
        fetchBackupCodes: builder.query({
            query: args => ({
                url: `user/mfa/backupCodes/codes`,
                method: 'GET'
            }),
            providesTags: ['BackupCodes'],
            transformResponse: response => response.codes
        }),
        fetchSession: builder.query({
            query: args => ({
                url: `user/session`,
                method: 'GET'
            }),
            providesTags: ['Session'],
            transformResponse: response => response.sessions
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
                } catch (err) {
                    handleQueryError({ err })
                }
            }
        })
    })
})

export const {
    useFetchUserQuery,
    useLoginUserMutation,
    useRegisterUserMutation,
    useLogoutUserMutation,
    useRevokeSessionMutation,
    useUpdateProfileMutation,
    useSetupTotpMutation,
    useDisableTotpMutation,
    useSetupEmailMutation,
    useDisableEmailMutation,
    useSudoModeMutation,
    useSetupBackupCodesMutation,
    useDisableBackupCodesMutation,
    useRegenerateBackupCodesMutation,
    useLazyFetchBackupCodesQuery,
    useFetchSessionQuery
} = userApi
