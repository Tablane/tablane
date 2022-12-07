import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PostHog() {
    const location = useLocation()

    posthog.init('phc_qdnUk6V672Fj9dotrGxne2N1LqyW5Gljftm6HcxvMIm', {
        api_host: 'https://eu.posthog.com'
    })

    useEffect(() => {
        posthog.capture('$pageview')
    }, [location.pathname])

    return <></>
}
