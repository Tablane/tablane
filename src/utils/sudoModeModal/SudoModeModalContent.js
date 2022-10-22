import styles from '../../styles/SudoModeModal.module.scss'
import { Button, TextInput } from '@mantine/core'

function SudoModeModalContent({ handleSubmit }) {
    return (
        <div className={styles.content}>
            <p className={styles.title}>Confirm access</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <TextInput
                    className={styles.passwordInput}
                    placeholder="Password"
                    autoComplete="current-password"
                    type="password"
                />
                <Button
                    className={styles.confirmButton}
                    type="submit"
                    fullWidth
                >
                    Confirm
                </Button>
            </form>
            <p className={styles.infoText}>
                <strong>Tip:</strong> You are entering sudo mode. After you've
                performed a sudo-protected action, you'll only be asked to
                re-authenticate again after a few minutes.
            </p>
        </div>
    )
}

export default SudoModeModalContent
