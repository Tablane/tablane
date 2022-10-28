import { Alert, Badge, Modal, TextInput } from '@mantine/core'
import { Button } from '@mantine/core'
import styles from '../../../styles/Profile.module.scss'
import PhoneIcon from '../../../styles/assets/PhoneIcon'
import SudoModeModal from '../../../utils/SudoModeModal'
import {
    useDisableTotpMutation,
    useSetupTotpMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SecurityKeyIcon from '../../../styles/assets/SecurityKeyIcon'

function SecurityKeyManageModal({ open, setOpen, enabled }) {
    const [setupTotp, { isLoading: isSetupLoading }] = useSetupTotpMutation()
    const [disableTotp, { isLoading: isDisableLoading }] =
        useDisableTotpMutation()
    const [secret, setSecret] = useState('')
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})

    const handleSubmit = e => {
        e.preventDefault()
        console.log('initiating security key method enable...')
    }
    const handleOpen = e => {
        e.preventDefault()
        setOpen(true)
    }
    const handleDisable = e => {
        e.preventDefault()
        console.log('initiating security key method disable...')
    }

    return (
        <>
            <div>
                <div>
                    <div className={styles.icon}>
                        <SecurityKeyIcon />
                    </div>
                    <div>
                        <div className={styles.name}>
                            <span>Security Key</span>
                            {enabled ? (
                                <Badge color="green">Enabled</Badge>
                            ) : (
                                <Badge color="red">Disabled</Badge>
                            )}
                        </div>
                        <span className={styles.description}>
                            Use any WebAuthn enabled security key to access your
                            account.
                        </span>
                    </div>
                </div>
                <Button variant="outline" color="gray" onClick={handleOpen}>
                    Manage
                </Button>
            </div>

            <Modal
                className={styles.totpModal}
                opened={open}
                onClose={() => setOpen(false)}
                title="Manage Authenticator App"
            >
                {enabled ? (
                    <>
                        <Alert title="Enabled" color="teal">
                            This two-step login provider is enabled on your
                            account.
                        </Alert>
                        <form onSubmit={handleDisable}>
                            <Button
                                mt="xl"
                                color="red"
                                type="submit"
                                loading={isDisableLoading}
                            >
                                Disable
                            </Button>
                        </form>
                    </>
                ) : (
                    <div>enable</div>
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

export default SecurityKeyManageModal
