import { Alert, Modal } from '@mantine/core'
import { Button } from '@mantine/core'

function EmailManageModal({ open, setOpen, enabled }) {
    const handleSubmit = e => {
        e.preventDefault()
        console.log('initiating email method disable...')
    }

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            title="Manage Email"
        >
            {enabled ? (
                <>
                    <Alert title="Enabled" color="teal">
                        This two-step login provider is enabled on your account.
                    </Alert>
                    <form onSubmit={handleSubmit}>
                        <Button mt="xl" color="red" type="submit">
                            Disable
                        </Button>
                    </form>
                </>
            ) : (
                <Button type="submit">Enable</Button>
            )}
        </Modal>
    )
}

export default EmailManageModal
