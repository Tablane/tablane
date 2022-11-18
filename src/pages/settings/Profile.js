import styles from '../../styles/Profile.module.scss'
import {
    useFetchSessionQuery,
    useFetchUserQuery,
    useRevokeSessionMutation,
    useUpdateProfileMutation
} from '../../modules/services/userSlice'
import { useForm } from '@mantine/form'
import { Button } from '@mantine/core'
import SudoModeModal from '../../utils/SudoModeModal'
import AccountDeleteModal from './profile/AccountDeleteModal'
import { useState } from 'react'
import TOTPManageModal from './profile/TOTPManageModal'
import EmailManageModal from './profile/EmailManageModal'
import BackupManageModal from './profile/BackupManageModal'
import SecurityKeyManageModal from './profile/SecurityKeyManageModal'
import { CircularProgress } from '@mui/material'

function Profile() {
    const [updateProfile] = useUpdateProfileMutation()
    const [revokeSession, { isLoading: isLoadingRevoke }] =
        useRevokeSessionMutation()
    const [sudoModeModalOpen, setSudoModeModalOpen] = useState(false)
    const [backupCodesManageModalOpen, setBackupCodesManageModalOpen] =
        useState(false)
    const [totpManageModalOpen, setTotpManageModalOpen] = useState(false)
    const [securityKeyManageModalOpen, setSecurityKeyManageModalOpen] =
        useState(false)
    const [emailManageModalOpen, setEmailManageModalOpen] = useState(false)
    const [sudoConfirmFn, setSudoConfirmFn] = useState(() => () => {})
    const [accountDeletionModalOpen, setAccountDeletionModalOpen] =
        useState(false)
    const { data: user } = useFetchUserQuery()
    const { data: sessions, isLoading: isLoadingSession } =
        useFetchSessionQuery()

    const form = useForm({
        initialValues: {
            username: user?.username,
            email: user?.email,
            password: ''
        }
    })
    const { values } = form

    const handleSubmit = e => {
        e.preventDefault()
        console.log('submitting...')
    }

    const openDeleteModal = () => {
        setAccountDeletionModalOpen(true)
    }

    const handleProfileUpdate = async () => {
        updateProfile({ ...form.values })
            .unwrap()
            .catch(err => {
                setSudoConfirmFn(() => () => handleProfileUpdate())
                setSudoModeModalOpen(true)
            })
    }

    const handleRevoke = async sessionId => {
        revokeSession({
            sessionId
        })
            .unwrap()
            .catch(err => {
                setSudoConfirmFn(() => () => handleRevoke(sessionId))
                setSudoModeModalOpen(true)
            })
    }

    return (
        <div className={styles.root}>
            <p className={styles.title}>My Settings</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.profileSettings}>
                    <div className={styles.profilePicture}>
                        {values.username.charAt(0).toUpperCase()}
                        {values.username.charAt(1).toUpperCase()}
                    </div>
                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label>Name</label>
                            <input
                                type="text"
                                value={values.username}
                                placeholder="Enter Username"
                                autoComplete="name"
                                {...form.getInputProps('username')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="text"
                                value={values.email}
                                placeholder="Enter Email"
                                autoComplete="email"
                                {...form.getInputProps('email')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={values.password}
                                placeholder="Enter New Password"
                                autoComplete="new-password"
                                {...form.getInputProps('password')}
                            />
                        </div>
                        <div>
                            <Button
                                className="bg-[#228be6]"
                                onClick={handleProfileUpdate}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.multiFactorAuth}>
                    <div className={styles.title}>
                        Multi-factor authentication
                    </div>
                    <span className={styles.subtitle}>
                        Secure your account by requiring an additional step when
                        logging in.
                    </span>
                    <div className={styles.methods}>
                        <BackupManageModal
                            enabled={user.mfa_methods.backup_codes.enabled}
                            open={backupCodesManageModalOpen}
                            setOpen={setBackupCodesManageModalOpen}
                        />
                        <SecurityKeyManageModal
                            enabled={user.mfa_methods.security_key.enabled}
                            open={securityKeyManageModalOpen}
                            setOpen={setSecurityKeyManageModalOpen}
                        />
                        <EmailManageModal
                            enabled={user.mfa_methods.email.enabled}
                            open={emailManageModalOpen}
                            setOpen={setEmailManageModalOpen}
                        />
                        <TOTPManageModal
                            enabled={user.mfa_methods.totp.enabled}
                            open={totpManageModalOpen}
                            setOpen={setTotpManageModalOpen}
                        />
                    </div>
                </div>
                <div className={styles.loggedInDevices}>
                    <div className={styles.title}>Devices</div>
                    <span className={styles.subtitle}>
                        Here are all the devices that are currently logged in
                        with your account. If you see an entry you don't
                        recognize, log out of that device and change your
                        password immediately.
                    </span>
                    <div className={styles.devices}>
                        <div className={styles.headRow}>
                            <div>
                                <p>Device</p>
                            </div>
                            <div>
                                <p>Date</p>
                            </div>
                            <div className={styles.action}>
                                <p>Action</p>
                            </div>
                        </div>
                        {!isLoadingSession ? (
                            sessions?.map(session => {
                                return (
                                    <div key={session._id}>
                                        <div>
                                            <p>{session.device}</p>
                                        </div>
                                        <div>
                                            <p>{session.lastActive}</p>
                                        </div>
                                        <div className={styles.action}>
                                            <Button
                                                style={{ margin: 'auto 0' }}
                                                variant="light"
                                                color="gray"
                                                className="bg-[#f8f9fa]"
                                                compact
                                                onClick={() =>
                                                    handleRevoke(session._id)
                                                }
                                                loading={isLoadingRevoke}
                                            >
                                                Revoke
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div
                                style={{
                                    marginTop: '20px',
                                    border: 'none',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <CircularProgress size={32} />
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.deleteAccount}>
                    <div className={styles.title}>Delete account</div>
                    <span className={styles.subtitle}>
                        Once you delete your account, there is no going back.
                        Please be certain.
                    </span>
                    <Button
                        className="bg-[#fa5252]"
                        color="red"
                        onClick={openDeleteModal}
                    >
                        Delete Account
                    </Button>
                </div>
            </form>

            <AccountDeleteModal
                accountDeletionModalOpen={accountDeletionModalOpen}
                setAccountDeletionModalOpen={setAccountDeletionModalOpen}
            />
            <SudoModeModal
                open={sudoModeModalOpen}
                setOpen={setSudoModeModalOpen}
                onConfirm={sudoConfirmFn}
            />
        </div>
    )
}

export default Profile
