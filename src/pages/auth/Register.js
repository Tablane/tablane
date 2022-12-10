import { Button } from '@mantine/core'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import '../../styles/LoginOld.css'
import '../../styles/Auth.css'
import { useRegisterUserMutation } from '../../modules/services/userSlice'
import styles from '../../styles/Login.module.scss'
import { Divider, PasswordInput, TextInput } from '@mantine/core'
import GoogleLogin from './login/GoogleLogin'
import { useForm } from '@mantine/form'
import { useState } from 'react'

function Login() {
    const [registerUser, { isLoading }] = useRegisterUserMutation()
    const [completed, setCompleted] = useState(false)

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validate: {
            username: value => {
                if (value.length < 3)
                    return 'Name has to be atleast 3 characters long'
                if (value.length > 32)
                    return 'Name has to be cannot be longer than 32 characters'
                return /^([a-zA-Z1-9_\-]){3,32}$/.test(value)
                    ? null
                    : 'The name can only contain _, -, numbers and alphanumeric characters'
            },
            email: value =>
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    value
                )
                    ? null
                    : 'This email is invalid',
            password: value =>
                value.length >= 8
                    ? null
                    : 'Password has to be atleast 8 characters long'
        },
        validateInputOnBlur: true
    })

    const handleSubmit = async e => {
        e.preventDefault()
        if (!form.validate().hasErrors) {
            const response = await registerUser(form.values).unwrap()
            if (response.success) setCompleted(true)
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {!completed ? (
                    <>
                        <p className={styles.header}>Create your Account</p>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <TextInput
                                autoComplete="username"
                                {...form.getInputProps('username')}
                                label="Username"
                                placeholder="Enter your username"
                                mb={25}
                            />
                            <TextInput
                                autoComplete="email"
                                {...form.getInputProps('email')}
                                label="Email"
                                placeholder="Enter your email"
                                mb={25}
                            />
                            <PasswordInput
                                placeholder="Enter your password"
                                {...form.getInputProps('password')}
                                id="password"
                                autoComplete="password"
                                label="Password"
                            />
                            <div
                                style={{
                                    position: 'relative'
                                }}
                            >
                                <Button
                                    className="bg-[#228be6]"
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
                    </>
                ) : (
                    <div className="text-sm text-center text-[#757580]">
                        <p className="font-medium text-lg mx-0 mb-4 text-center w-full text-[#292932]">
                            Successfully registered
                        </p>
                        <p className="m-0">
                            {/*Please check your email and follow the instructions*/}
                            {/*to verify your account.*/}
                            You can now log in.
                        </p>
                    </div>
                )}
            </div>
            <div className={styles.registerText}>
                <span className={styles.text}>
                    <span>Already have an account? </span>
                    <Link className={styles.link} to="/login">
                        Sign in
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default Login
