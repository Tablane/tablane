import { Alert, Badge, Modal } from '@mantine/core'
import { Button } from '@mantine/core'
import {
    useDisableBackupCodesMutation,
    useLazyFetchBackupCodesQuery,
    useRegenerateBackupCodesMutation,
    useSetupBackupCodesMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SudoModeModal from '../../../utils/SudoModeModal'
import { CircularProgress } from '@mui/material'
import styles from '../../../styles/Profile.module.scss'
import PinIcon from '../../../styles/assets/PinIcon'

function BackupManageModal({ open, setOpen, enabled }) {
    const [setupBackupCodes, { isLoading: isEnableLoading }] =
        useSetupBackupCodesMutation()
    const [disableBackupCodes, { isLoading: isDisableLoading }] =
        useDisableBackupCodesMutation()
    const [regenerateBackupCodes, { isLoading: isLoadingRegenerate }] =
        useRegenerateBackupCodesMutation()
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})
    const [fetchCodes, { data: codes, isUninitialized, isFetching }] =
        useLazyFetchBackupCodesQuery()

    const handleDisable = async e => {
        e.preventDefault()
        disableBackupCodes()
            .unwrap()
            .then(() => setOpen(true))
            .catch(err => {
                setOpen(false)
                setSudoModeModalOpen(true)
                setSudoFn(() => () => handleDisable(e))
            })
    }

    const handleEnable = async e => {
        e.preventDefault()
        setupBackupCodes()
            .unwrap()
            .then(() => handleOpen(e, true))
            .catch(err => {
                setOpen(false)
                setSudoModeModalOpen(true)
                setSudoFn(() => () => handleEnable(e))
            })
    }

    const handleOpen = (e, override) => {
        e.preventDefault()
        if (enabled || override) {
            fetchCodes()
                .unwrap()
                .catch(err => {
                    setOpen(false)
                    setSudoModeModalOpen(true)
                    setSudoFn(() => () => handleOpen(e))
                })
        }
        setOpen(true)
    }

    return (
        <>
            <div>
                <div>
                    <div className={styles.icon}>
                        <PinIcon />
                    </div>
                    <div>
                        <div className={styles.name}>
                            <span>Backup Codes</span>
                            {enabled ? (
                                <Badge color="green">Enabled</Badge>
                            ) : (
                                <Badge color="red">Disabled</Badge>
                            )}
                        </div>
                        <span className={styles.description}>
                            A recovery code allows you to access your account in
                            the event that you you lose your device.
                        </span>
                    </div>
                </div>
                <Button variant="outline" color="gray" onClick={handleOpen}>
                    Manage
                </Button>
            </div>

            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Manage Backup Codes"
            >
                {enabled ? (
                    <>
                        {isUninitialized || isFetching ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Alert title="Enabled" color="teal">
                                    This two-step login provider is enabled on
                                    your account.
                                </Alert>
                                <div className={styles.codes}>
                                    {codes?.map(code => (
                                        <span
                                            key={code}
                                            className={styles.code}
                                        >
                                            {code}
                                        </span>
                                    ))}
                                </div>
                                <form onSubmit={handleDisable}>
                                    <Button
                                        mt="xl"
                                        color="red"
                                        type="submit"
                                        loading={isDisableLoading}
                                    >
                                        Disable
                                    </Button>
                                    <Button
                                        ml="md"
                                        mt="xl"
                                        color="gray"
                                        loading={isLoadingRegenerate}
                                        onClick={regenerateBackupCodes}
                                    >
                                        Regenerate
                                    </Button>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Alert title="Disabled" color="red">
                            This two-step login provider is disabled on your
                            account.
                        </Alert>
                        <form onSubmit={handleEnable}>
                            <Button
                                mt="xl"
                                color="teal"
                                type="submit"
                                loading={isEnableLoading}
                            >
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
