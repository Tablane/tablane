import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PostHog() {
    const location = useLocation()

    useEffect(() => {
        posthog.capture('$pageview')
    }, [location.pathname])

    return <></>
}
