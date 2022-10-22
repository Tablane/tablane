import { Alert, Modal, TextInput } from '@mantine/core'
import { Button } from '@mantine/core'
import useInputState from '../../../modules/hooks/useInputState'
import {
    useDisableTotpMutation,
    useSetupTotpMutation
} from '../../../modules/services/userSlice'

function TOTPManageModal({ open, setOpen, enabled, totpSetupData }) {
    const [setupTotp] = useSetupTotpMutation()
    const [disableTotp] = useDisableTotpMutation()
    const [token, changeToken] = useInputState('')

    const handleDisable = e => {
        e.preventDefault()
        disableTotp()
        setOpen(false)
    }

    const handleEnable = e => {
        e.preventDefault()
        setupTotp({ token })
    }

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            title="Manage Authenticator App"
        >
            {enabled ? (
                <>
                    <Alert title="Enabled" color="teal">
                        This two-step login provider is enabled on your account.
                    </Alert>
                    <form onSubmit={handleDisable}>
                        <Button mt="xl" color="red" type="submit">
                            Disable
                        </Button>
                    </form>
                </>
            ) : (
                <div>
                    <div>qr code of totp</div>
                    <span>{totpSetupData?.secret}</span>
                    <form onSubmit={handleEnable}>
                        <TextInput
                            onChange={changeToken}
                            my="xl"
                            type="text"
                            placeholder="Enter authenticator Code"
                        />
                        <Button type="submit">Enable</Button>
                    </form>
                </div>
            )}
        </Modal>
    )
}

export default TOTPManageModal
