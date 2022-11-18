import { Button } from '@mantine/core'
import GoogleIcon from '../../../styles/assets/GoogleIcon'

function GoogleLogin() {
    const handleClick = () => {
        const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

        const options = {
            redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
            client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ].join(' ')
        }

        const qs = new URLSearchParams(options)

        const url = `${baseUrl}?${qs.toString()}`

        window.location.href = url
    }

    return (
        <Button
            onClick={handleClick}
            leftIcon={<GoogleIcon />}
            variant="default"
            color="gray"
            className="bg-[#868e96]"
            fullWidth
        >
            Sign in with Google
        </Button>
    )
}

export default GoogleLogin
