import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_HOST}/api`,
    credentials: 'include'
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)

    if (
        result?.error?.status === 403 &&
        result?.error?.data?.message === 'Invalid access token'
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
                    // Retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    console.log('auth failed - logging out..')
                    // api.dispatch(logout());
                    window.location.href = '/login'
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
