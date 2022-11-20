import { Alert, Badge, Modal, TextInput } from '@mantine/core'
import { Button } from '@mantine/core'
import {
    useDisableTotpMutation,
    useFetchUserQuery,
    useSetupTotpMutation
} from '../../../modules/services/userSlice'
import { useState } from 'react'
import SudoModeModal from '../../../utils/SudoModeModal'
import QRCode from 'react-qr-code'
import styles from '../../../styles/Profile.module.scss'
import PhoneIcon from '../../../styles/assets/PhoneIcon'
import { useForm } from '@mantine/form'

function TOTPManageModal({ open, setOpen, enabled }) {
    const { data: user } = useFetchUserQuery()
    const [setupTotp, { isLoading: isSetupLoading }] = useSetupTotpMutation()
    const [disableTotp, { isLoading: isDisableLoading }] =
        useDisableTotpMutation()
    const [secret, setSecret] = useState('')
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [sudoFn, setSudoFn] = useState(() => () => {})

    const form = useForm({
        initialValues: {
            token: ''
        },
        validate: {
            token: value => (/^\d{6}$/.test(value) ? null : 'Invalid token')
        }
    })

    const handleDisable = async e => {
        e.preventDefault()
        disableTotp()
            .unwrap()
            .then(() => setOpen(true))
            .catch(err => {
                setSudoFn(() => () => handleDisable(e))
                setSudoModeModalOpen(true)
            })
        setOpen(false)
    }

    const handleOpen = async method => {
        if (!enabled) {
            setupTotp()
                .unwrap()
                .then(({ secret }) => {
                    setSecret(secret)
                    setOpen(true)
                })
                .catch(err => {
                    setSudoFn(() => () => handleOpen())
                    setSudoModeModalOpen(true)
                })
        } else setOpen(true)
    }

    const handleEnable = async e => {
        e.preventDefault()
        e.stopPropagation()
        if (!form.validate().hasErrors) {
            setupTotp({ token: form.values.token })
        }
    }

    return (
        <>
            <div>
                <div>
                    <div className={styles.icon}>
                        <PhoneIcon />
                    </div>
                    <div>
                        <div className={styles.name}>
                            <span>Authenticator App</span>
                            {enabled ? (
                                <Badge color="green">Enabled</Badge>
                            ) : (
                                <Badge color="red">Disabled</Badge>
                            )}
                        </div>
                        <span className={styles.description}>
                            Use an authenticator app (such as Authy or Google
                            Authenticator) to generate time-based verification
                            codes.
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    color="gray"
                    onClick={handleOpen}
                    loading={isSetupLoading}
                >
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
                                className="bg-[#fa5252]"
                                color="red"
                                type="submit"
                                loading={isDisableLoading}
                            >
                                Disable
                            </Button>
                        </form>
                    </>
                ) : (
                    <div>
                        <div className={styles.subtitle}>
                            Scan the image below with the authenticator app on
                            your phone or manually enter the text code instead.
                        </div>
                        <div>
                            <QRCode
                                size={256}
                                className={styles.qrCode}
                                value={`otpauth://totp/${user.email}?secret=${secret}&issuer=Tablane`}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <span className={styles.secret}>{secret}</span>
                        <form onSubmit={handleEnable}>
                            <TextInput
                                my="xl"
                                type="text"
                                placeholder="Enter authenticator Code"
                                {...form.getInputProps('token')}
                            />
                            <Button
                                type="submit"
                                loading={isSetupLoading}
                                className="bg-[#228be6]"
                            >
                                Enable
                            </Button>
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
