import { Alert, Badge, Modal } from '@mantine/core'
import { Button } from '@mantine/core'
import {
    useDisableEmailMutation,
    useSetupEmailMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SudoModeModal from '../../../utils/SudoModeModal'
import styles from '../../../styles/Profile.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'

function EmailManageModal({ open, setOpen, enabled }) {
    const [setupEmail, { isLoading: isSetupLoading }] = useSetupEmailMutation()
    const [disableEmail, { isLoading: isDisableLoading }] =
        useDisableEmailMutation()
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})

    const handleDisable = async e => {
        e.preventDefault()
        disableEmail()
            .unwrap()
            .then(() => setOpen(true))
            .catch(err => {
                setSudoFn(() => () => handleDisable(e))
                setSudoModeModalOpen(true)
                setOpen(false)
            })
    }

    const handleEnable = async e => {
        e.preventDefault()
        setupEmail()
            .unwrap()
            .then(() => setOpen(true))
            .catch(err => {
                setSudoFn(() => () => handleEnable(e))
                setSudoModeModalOpen(true)
                setOpen(false)
            })
    }

    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <>
            <div>
                <div>
                    <div className={styles.icon}>
                        <FontAwesomeIcon
                            size={'xl'}
                            icon={regular('envelope')}
                        />
                    </div>
                    <div>
                        <div className={styles.name}>
                            <span>Email</span>
                            {enabled ? (
                                <Badge color="green">Enabled</Badge>
                            ) : (
                                <Badge color="red">Disabled</Badge>
                            )}
                        </div>
                        <span className={styles.description}>
                            Verification codes will be emailed to you.
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
                title="Manage Email"
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
                                loading={isSetupLoading}
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

export default EmailManageModal
