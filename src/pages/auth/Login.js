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

function Login() {
    const [loginUser, { isLoading }] = useLoginUserMutation()
    const [step, setStep] = useState('email')
    const form = useForm({
        initialValues: {
            email: '',
            password: ''
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

    const handleSubmit = async e => {
        e.preventDefault()
        if (step === 'email' && !form.validateField('email').hasError) {
            const { data } = await loginUser({ ...form.values })
            setStep(data.nextStep)
        } else if (step === 'password' && !form.isValid().hasErrors) {
            loginUser({ ...form.values })
        }
    }

    const googleIcon = (
        <svg
            style={{ height: '16px', width: '16px' }}
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
        >
            <path
                fill="#EA4335 "
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
            />
            <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
            />
            <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
            />
            <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
            />
        </svg>
    )

    const appleIcon = (
        <svg
            style={{ height: '16px', width: '16px' }}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 305 305"
        >
            <path d="M40.738,112.119c-25.785,44.745-9.393,112.648,19.121,153.82C74.092,286.523,88.502,305,108.239,305   c0.372,0,0.745-0.007,1.127-0.022c9.273-0.37,15.974-3.225,22.453-5.984c7.274-3.1,14.797-6.305,26.597-6.305   c11.226,0,18.39,3.101,25.318,6.099c6.828,2.954,13.861,6.01,24.253,5.815c22.232-0.414,35.882-20.352,47.925-37.941   c12.567-18.365,18.871-36.196,20.998-43.01l0.086-0.271c0.405-1.211-0.167-2.533-1.328-3.066c-0.032-0.015-0.15-0.064-0.183-0.078   c-3.915-1.601-38.257-16.836-38.618-58.36c-0.335-33.736,25.763-51.601,30.997-54.839l0.244-0.152   c0.567-0.365,0.962-0.944,1.096-1.606c0.134-0.661-0.006-1.349-0.386-1.905c-18.014-26.362-45.624-30.335-56.74-30.813   c-1.613-0.161-3.278-0.242-4.95-0.242c-13.056,0-25.563,4.931-35.611,8.893c-6.936,2.735-12.927,5.097-17.059,5.097   c-4.643,0-10.668-2.391-17.645-5.159c-9.33-3.703-19.905-7.899-31.1-7.899c-0.267,0-0.53,0.003-0.789,0.008   C78.894,73.643,54.298,88.535,40.738,112.119z" />
            <path d="M212.101,0.002c-15.763,0.642-34.672,10.345-45.974,23.583c-9.605,11.127-18.988,29.679-16.516,48.379   c0.155,1.17,1.107,2.073,2.284,2.164c1.064,0.083,2.15,0.125,3.232,0.126c15.413,0,32.04-8.527,43.395-22.257   c11.951-14.498,17.994-33.104,16.166-49.77C214.544,0.921,213.395-0.049,212.101,0.002z" />
        </svg>
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
                <Button
                    leftIcon={googleIcon}
                    variant="default"
                    color="gray"
                    fullWidth
                >
                    Sign in with Google
                </Button>
                <Button
                    leftIcon={appleIcon}
                    variant="default"
                    color="gray"
                    mt={12}
                    fullWidth
                >
                    Sign in with Apple
                </Button>
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
