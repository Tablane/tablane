import { Button, Divider } from '@mantine/core'
import { CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import styles from '../../../styles/TotpCode.module.scss'
import { PinField } from 'react-pin-field'

function TotpCode({ form, handleSubmit, isLoading }) {
    const handleChange = value => {
        form.setFieldValue('totp', value)
    }

    const handleComplete = totp => {
        handleSubmit(null, { totp })
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <p className={styles.header}>
                    Multi-factor authentication (MFA) required
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <span className={styles.label}>
                        Enter the passcode from your authenticator app:
                    </span>
                    <div className={styles.totpInput}>
                        <PinField
                            autoFocus
                            length={6}
                            onChange={handleChange}
                            onComplete={handleComplete}
                            disabled={isLoading}
                            validate={/^\d$/}
                        />
                    </div>
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

export default TotpCode
