import { Button, Divider } from '@mantine/core'
import { CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import styles from '../../../styles/TotpCode.module.scss'
import { PinField } from 'react-pin-field'
import SecurityKeyIcon from '../../../styles/assets/SecurityKeyIcon'

function TotpCode({ form, handleSubmit, isLoading, methods }) {
    const handleChange = value => {
        form.setFieldValue('totp', value)
    }

    const handleComplete = totp => {
        handleSubmit(null, { totp })
    }

    const handleSwitchType = type => {
        form.setFieldValue('type', type)
    }

    const handleTOTPSubmit = e => {
        e.preventDefault()
        if (form.values['totp'] === '') return
        handleSubmit()
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <p className={styles.header}>
                    Multi-factor authentication (MFA) required
                </p>
                <form onSubmit={handleTOTPSubmit} className={styles.form}>
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
                {methods.length > 1 && (
                    <Divider my={20} label="OR" labelPosition="center" />
                )}
                {methods.includes('security_key') && (
                    <Button
                        leftIcon={<SecurityKeyIcon />}
                        variant="default"
                        color="gray"
                        mt={12}
                        fullWidth
                        onClick={() => handleSwitchType('security_key')}
                    >
                        Verify with a Security Key
                    </Button>
                )}
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
