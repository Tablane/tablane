import { Alert, Modal, TextInput } from '@mantine/core'
import { Button } from '@mantine/core'

function AccountDeleteModal({
    accountDeletionModalOpen,
    setAccountDeletionModalOpen
}) {
    const handleSubmit = e => {
        e.preventDefault()
        console.log('initiating account deletion...')
    }

    return (
        <Modal
            opened={accountDeletionModalOpen}
            onClose={() => setAccountDeletionModalOpen(false)}
            title="Confirm Deletion"
        >
            <Alert title="Warning" color="red">
                Deleting your account is permanent. It cannot be undone.
            </Alert>
            <form onSubmit={handleSubmit}>
                <TextInput
                    my="xl"
                    type="password"
                    placeholder="Enter your Password"
                    autoComplete="current-password"
                />
                <Button className="bg-[#fa5252]" color="red" type="submit">
                    Confirm
                </Button>
            </form>
        </Modal>
    )
}

export default AccountDeleteModal
