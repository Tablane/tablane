import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { history } from '../../utils/history'
import { logOut } from './authReducer'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_HOST}/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem('access_token')

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    }
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)

    if (
        result?.error?.status === 403 &&
        result?.error?.data?.message === 'Invalid access token' &&
        !['/login', '/register'].includes(window.location.pathname)
    ) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()

            try {
                const refreshResult = await baseQuery(
                    { credentials: 'include', url: 'user/refresh' },
                    api,
                    extraOptions
                )

                if (refreshResult.data) {
                    localStorage.setItem(
                        'access_token',
                        refreshResult.data.accessToken
                    )
                    // Retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(logOut())
                    localStorage.removeItem('access_token')
                    history.push('/login')
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }

    return result
}
export const api = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({})
})
