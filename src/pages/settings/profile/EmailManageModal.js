import { Alert, Modal } from '@mantine/core'
import { Button } from '@mantine/core'
import {
    useDisableEmailMutation,
    useSetupEmailMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SudoModeModal from '../../../utils/SudoModeModal'

function EmailManageModal({ open, setOpen, enabled }) {
    const [setupEmail] = useSetupEmailMutation()
    const [disableEmail] = useDisableEmailMutation()
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})

    const handleDisable = async e => {
        e.preventDefault()
        const { success, message } = await disableEmail().unwrap()
        if (!success && message === 'sudo mode required') {
            setSudoFn(() => () => handleDisable(e))
            setSudoModeModalOpen(true)
        }
    }

    const handleEnable = async e => {
        e.preventDefault()
        const { success, message } = await setupEmail().unwrap()
        if (!success && message === 'sudo mode required') {
            setSudoFn(() => () => handleEnable(e))
            setSudoModeModalOpen(true)
        }
    }

    return (
        <>
            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Manage Email"
            >
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
                    <>
                        <Alert title="Disabled" color="red">
                            This two-step login provider is disabled on your
                            account.
                        </Alert>
                        <form onSubmit={handleEnable}>
                            <Button mt="xl" color="teal" type="submit">
                                Enable
                            </Button>
                        </form>
                    </>
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

export default EmailManageModal
