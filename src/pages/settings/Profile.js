import styles from '../../styles/Profile.module.scss'
import { useFetchUserQuery } from '../../modules/services/userSlice'
import { useForm } from '@mantine/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button, Badge } from '@mantine/core'
import PhoneIcon from '../../styles/assets/PhoneIcon'
import SecurityKeyIcon from '../../styles/assets/SecurityKeyIcon'

function Profile() {
    const { data: user } = useFetchUserQuery()

    const handleSubmit = e => {
        e.preventDefault()
        console.log('submitting...')
    }

    const form = useForm({
        initialValues: {
            username: user.username,
            email: user.email,
            password: ''
        }
    })
    const { values } = form

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
                                {...form.getInputProps('username')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="text"
                                value={values.email}
                                placeholder="Enter Email"
                                {...form.getInputProps('email')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={values.password}
                                placeholder="Enter New Password"
                                {...form.getInputProps('password')}
                            />
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
                        {[
                            {
                                name: 'Backup Codes',
                                enabled: false,
                                icon: (
                                    <FontAwesomeIcon
                                        size={'xl'}
                                        icon={solid('key')}
                                    />
                                ),
                                description:
                                    'A recovery code allows you to access your account in the event that you you lose your device.'
                            },
                            {
                                name: 'Security Key',
                                enabled: false,
                                icon: <SecurityKeyIcon />,
                                description:
                                    'Use any WebAuthn enabled security key to access your account.'
                            },
                            {
                                name: 'Email',
                                enabled: true,
                                icon: (
                                    <FontAwesomeIcon
                                        size={'xl'}
                                        icon={regular('envelope')}
                                    />
                                ),
                                description:
                                    'Verification codes will be emailed to you.'
                            },
                            {
                                name: 'Authenticator App',
                                enabled: false,
                                icon: <PhoneIcon />,
                                description:
                                    'Use an authenticator app (such as Authy or Google Authenticator) to generate time-based verification codes.'
                            }
                        ].map(method => (
                            <div>
                                <div>
                                    <div className={styles.icon}>
                                        {method.icon}
                                    </div>
                                    <div>
                                        <div className={styles.name}>
                                            <span>{method.name}</span>
                                            {method.enabled ? (
                                                <Badge color="green">
                                                    Enabled
                                                </Badge>
                                            ) : (
                                                <Badge color="red">
                                                    Disabled
                                                </Badge>
                                            )}
                                        </div>
                                        <span className={styles.description}>
                                            {method.description}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="outline" color="gray">
                                    Manage
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.loggedInDevices}>
                    <div className={styles.title}>Devices</div>
                    <span className={styles.subtitle}>
                        Here are all the devices that are currently logged in
                        with your account.
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
                        {[
                            'Chrome on macOS',
                            'Chrome on Windows',
                            'Firefox on Android'
                        ].map(x => {
                            return (
                                <div>
                                    <div>
                                        <p>{x}</p>
                                    </div>
                                    <div>
                                        <p>Aug 26, 2022, 11:12 AM</p>
                                    </div>
                                    <div className={styles.action}>
                                        <Button
                                            style={{ margin: 'auto 0' }}
                                            variant="light"
                                            color="gray"
                                            compact
                                        >
                                            Revoke
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Profile
