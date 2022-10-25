import { Alert, Modal } from '@mantine/core'
import { Button } from '@mantine/core'
import {
    useDisableBackupCodesMutation,
    useFetchBackupCodesQuery,
    useRegenerateBackupCodesMutation,
    useSetupBackupCodesMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SudoModeModal from '../../../utils/SudoModeModal'

function BackupManageModal({ open, setOpen, enabled }) {
    const [setupBackupCodes] = useSetupBackupCodesMutation()
    const [disableBackupCodes] = useDisableBackupCodesMutation()
    const [regenerateBackupCodes] = useRegenerateBackupCodesMutation()
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})
    const { data: codes, error, refetch } = useFetchBackupCodesQuery()

    const handleDisable = async e => {
        e.preventDefault()
        const { success, message } = await disableBackupCodes().unwrap()
        if (!success && message === 'sudo mode required') {
            setSudoFn(() => () => handleDisable(e))
            setSudoModeModalOpen(true)
            setOpen(false)
        } else setOpen(true)
    }

    const handleEnable = async e => {
        e.preventDefault()
        const { success, message } = await setupBackupCodes().unwrap()
        if (!success && message === 'sudo mode required') {
            setSudoFn(() => () => handleEnable(e))
            setSudoModeModalOpen(true)
            setOpen(false)
        } else setOpen(true)
    }

    return (
        <>
            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Manage Backup Codes"
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
                        <p>{JSON.stringify(codes)}</p>
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

export default BackupManageModal
