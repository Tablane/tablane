import styles from '../../styles/Profile.module.scss'
import { useFetchUserQuery } from '../../modules/services/userSlice'
import { useForm } from '@mantine/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button, Badge } from '@mantine/core'
import PhoneIcon from '../../styles/assets/PhoneIcon'
import SecurityKeyIcon from '../../styles/assets/SecurityKeyIcon'
import PinIcon from '../../styles/assets/PinIcon'

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
                            <Button>Update</Button>
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
                                icon: <PinIcon />,
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
                            <div key={method.name}>
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
                        {[
                            {
                                _id: '63528285b1b94e481ca680cc',
                                device: 'Chrome on Windows',
                                lastActive: 1666351749143
                            },
                            {
                                _id: '63528285b1b94e481ca680cb',
                                device: 'Chrome on macOS',
                                lastActive: 1666351949143
                            },
                            {
                                _id: '63528285b1b94e481ca680ca',
                                device: 'Firefox on Android',
                                lastActive: 1666352749143
                            }
                        ].map(device => {
                            return (
                                <div key={device._id}>
                                    <div>
                                        <p>{device.device}</p>
                                    </div>
                                    <div>
                                        <p>{device.lastActive}</p>
                                    </div>
                                    <div className={styles.action}>
                                        <Button
                                            style={{ margin: 'auto 0' }}
                                            variant="light"
                                            color="gray"
                                            compact
                                            loading={Math.random() * 10 > 8}
                                        >
                                            Revoke
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={styles.deleteAccount}>
                    <div className={styles.title}>Delete account</div>
                    <span className={styles.subtitle}>
                        Once you delete your account, there is no going back.
                        Please be certain.
                    </span>
                    <Button color="red">Delete Account</Button>
                </div>
            </form>
        </div>
    )
}

export default Profile
