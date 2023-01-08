import styles from '../../styles/Login.module.scss'
import {
    Group,
    Text,
    Anchor,
    PasswordInput,
    TextInput,
    Button,
    Divider
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { useLoginUserMutation } from '../../modules/services/userSlice'
import TotpCode from './login/TotpCode'
import GoogleLogin from './login/GoogleLogin'
import SecurityKeyLogin from './login/SecurityKeyLogin'
import ErrorPage from '../../utils/ErrorPage'

function Login() {
    const [loginUser, { isLoading, data }] = useLoginUserMutation()
    const form = useForm({
        initialValues: {
            step: 'email',
            type: '',
            request_security_key_challenge: false,

            email: '',
            password: '',
            totp: ''
        },
        validate: {
            email: value =>
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    value
                )
                    ? null
                    : 'This email is invalid',
            password: value =>
                value.length >= 1 ? null : 'Password cannot be empty'
        },
        validateInputOnBlur: true
    })
    const { step, type } = form.values

    const handleSubmit = async (e, values) => {
        e?.preventDefault()
        if (step === 'email' && !form.validateField('email').hasError) {
            const { data } = await loginUser({ ...form.values })
            form.setFieldValue('step', data.nextStep)
        } else if (step === 'password' && !form.isValid().hasErrors) {
            const { data } = await loginUser({ ...form.values })
            if (data?.nextStep) {
                form.setFieldValue('step', data.nextStep)
                form.setFieldValue('type', data.methods[0])
            }
        } else if (step === 'mfa') {
            loginUser({ ...form.values, ...values })
        }
    }

    const handleChange = e => {
        form.getInputProps('password').onChange(e)
        form.setFieldValue('step', 'password')
    }

    if (step === 'mfa') {
        if (type === 'totp') {
            return (
                <TotpCode
                    methods={data?.methods || []}
                    form={form}
                    isLoading={isLoading}
                    handleSubmit={handleSubmit}
                />
            )
        } else if (type === 'security_key') {
            return (
                <SecurityKeyLogin
                    methods={data?.methods || []}
                    form={form}
                    handleSubmit={handleSubmit}
                />
            )
        } else if (type === 'email') {
            return (
                <ErrorPage
                    error={{ error: 'Email MFA is currently not available' }}
                />
            )
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <p className={styles.header}>Sign in to Tablane</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <TextInput
                        autoComplete="email"
                        {...form.getInputProps('email')}
                        label="Email"
                        placeholder="Enter your email"
                    />
                    <Group
                        position="apart"
                        mt={25}
                        mb={5}
                        style={
                            step === 'email'
                                ? {
                                      position: 'absolute',
                                      opacity: 0
                                  }
                                : {}
                        }
                    >
                        <Text
                            component="label"
                            htmlFor="password"
                            size="sm"
                            weight={500}
                        >
                            Password
                        </Text>

                        <Anchor
                            tabIndex="1"
                            href="#"
                            onClick={event => event.preventDefault()}
                            sx={theme => ({
                                paddingTop: 2,
                                color: theme.colors[theme.primaryColor][
                                    theme.colorScheme === 'dark' ? 4 : 6
                                ],
                                fontWeight: 500,
                                fontSize: theme.fontSizes.xs
                            })}
                        >
                            Forgot your password?
                        </Anchor>
                    </Group>
                    <PasswordInput
                        {...form.getInputProps('password')}
                        placeholder="Enter your password"
                        id="password"
                        onChange={handleChange}
                        autoComplete="password"
                        style={
                            step === 'email'
                                ? {
                                      position: 'absolute',
                                      opacity: 0
                                  }
                                : {}
                        }
                    />
                    <div
                        style={{
                            position: 'relative'
                        }}
                    >
                        <Button
                            mt={20}
                            fullWidth
                            className="bg-[#228be6]"
                            type="submit"
                            disabled={isLoading}
                        >
                            Continue
                        </Button>
                        {isLoading && (
                            <CircularProgress
                                size={24}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px'
                                }}
                            />
                        )}
                    </div>
                </form>
                <Divider my={20} label="OR" labelPosition="center" />
                <GoogleLogin />
                <div className={styles.text}>
                    <p style={{ marginBottom: '0' }}>
                        By signing in, you agree to our
                    </p>
                    <p style={{ marginTop: '5px', marginBottom: '0' }}>
                        <a
                            className={styles.link}
                            href={`${process.env.REACT_APP_LANDING_HOST}/legal/terms`}
                        >
                            Terms of Service
                        </a>
                        <span> and </span>
                        <a
                            className={styles.link}
                            href={`${process.env.REACT_APP_LANDING_HOST}/legal/privacy-policy`}
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
            <div className={styles.registerText}>
                <span className={styles.text}>
                    <span>Don't have an account? </span>
                    <Link className={styles.link} to="/register">
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default Login
