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
import { useState } from 'react'
import { useForm } from '@mantine/form'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { useLoginUserMutation } from '../../modules/services/userSlice'
import TotpCode from './login/TotpCode'
import GoogleLogin from './login/GoogleLogin'
import AppleLogin from './login/AppleLogin'

function Login() {
    const [loginUser, { isLoading }] = useLoginUserMutation()
    const [step, setStep] = useState('email')
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            totp: ''
        },
        validate: {
            email: value =>
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    value
                )
                    ? null
                    : 'This email is invalid',
            password: value =>
                value.length >= 1 ? null : 'Password cannot be empty'
        },
        validateInputOnBlur: true
    })

    const handleSubmit = async (e, values) => {
        e?.preventDefault()
        if (step === 'email' && !form.validateField('email').hasError) {
            const { data } = await loginUser({ ...form.values })
            setStep(data.nextStep)
        } else if (step === 'password' && !form.isValid().hasErrors) {
            const { data } = await loginUser({ ...form.values })
            if (data.nextStep) setStep(data.nextStep)
        } else if (step === 'mfa') {
            loginUser({ ...form.values, ...values })
        }
    }

    const handleChange = e => {
        form.getInputProps('password').onChange(e)
        setStep('password')
    }

    if (step === 'mfa')
        return (
            <TotpCode
                form={form}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
            />
        )
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <p className={styles.header}>Sign in to TaskBoard</p>
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
                <AppleLogin />
                <div className={styles.text}>
                    <p style={{ marginBottom: '0' }}>
                        By signing in, you agree to our
                    </p>
                    <p style={{ marginTop: '5px', marginBottom: '0' }}>
                        <a className={styles.link} href="#">
                            Terms of Service
                        </a>
                        <span> and </span>
                        <a className={styles.link} href="#">
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
