import { Alert, Modal } from '@mantine/core'
import { Button } from '@mantine/core'

function TOTPManageModal({ open, setOpen }) {
    const handleSubmit = e => {
        e.preventDefault()
        console.log('initiating totp method disable...')
    }

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            title="Manage Authenticator App"
        >
            <Alert title="Enabled" color="teal">
                This two-step login provider is enabled on your account.
            </Alert>
            <form onSubmit={handleSubmit}>
                <Button mt="xl" color="red" type="submit">
                    Disable
                </Button>
            </form>
        </Modal>
    )
}

export default TOTPManageModal
