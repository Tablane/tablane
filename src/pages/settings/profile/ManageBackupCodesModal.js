import { Alert, Modal } from '@mantine/core'
import { Button } from '@mantine/core'

function ManageBackupCodesModal({ open, setOpen }) {
    const handleSubmit = e => {
        e.preventDefault()
        console.log('initiating backup codes method disable...')
    }

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            title="Manage Backup Codes"
        >
            <Alert title="Enabled" color="teal">
                This two-step login provider is enabled on your account.
            </Alert>
            <form onSubmit={handleSubmit}>
                <Button
                    className="bg-[#fa5252]"
                    mt="xl"
                    color="red"
                    type="submit"
                >
                    Disable
                </Button>
            </form>
        </Modal>
    )
}

export default ManageBackupCodesModal
