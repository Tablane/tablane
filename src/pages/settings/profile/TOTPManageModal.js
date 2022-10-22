import { Alert, Modal, TextInput } from '@mantine/core'
import { Button } from '@mantine/core'
import useInputState from '../../../modules/hooks/useInputState'
import {
    useDisableTotpMutation,
    useSetupTotpMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SudoModeModal from '../../../utils/SudoModeModal'

function TOTPManageModal({ open, setOpen, enabled, totpSetupData }) {
    const [setupTotp] = useSetupTotpMutation()
    const [disableTotp] = useDisableTotpMutation()
    const [token, changeToken] = useInputState('')
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})

    const handleDisable = async e => {
        e.preventDefault()
        const { success, message } = await disableTotp().unwrap()
        if (!success && message === 'sudo mode required') {
            setSudoFn(() => () => handleDisable(e))
            setSudoModeModalOpen(true)
        }
        setOpen(false)
    }

    const handleEnable = e => {
        e.preventDefault()
        setupTotp({ token })
    }

    return (
        <>
            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Manage Authenticator App"
            >
                {}
                {enabled ? (
                    <>
                        <Alert title="Enabled" color="teal">
                            This two-step login provider is enabled on your
                            account.
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
            <SudoModeModal
                open={sudoModeModalOpen}
                setOpen={setSudoModeModalOpen}
                onConfirm={sudoFn}
            />
        </>
    )
}

export default TOTPManageModal
