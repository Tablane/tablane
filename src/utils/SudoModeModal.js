import { Button, Modal, TextInput } from '@mantine/core'
import styles from '../styles/SudoModeModal.module.scss'
import { useSudoModeMutation } from '../modules/services/userSlice'
import useInputState from '../modules/hooks/useInputState'

function SudoModeModal({ open, setOpen, onConfirm }) {
    const [sudoMode] = useSudoModeMutation()
    const [password, changePassword] = useInputState()

    const handleSubmit = async e => {
        e.preventDefault()
        e.stopPropagation()
        const { error } = await sudoMode({ password })
        if (error?.data?.message !== 'Invalid password') {
            setOpen(false)
            onConfirm()
        }
    }

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            className={styles.modal}
        >
            <div className={styles.content}>
                <p className={styles.title}>Confirm access</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <TextInput
                        value={password}
                        onChange={changePassword}
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
                    <strong>Tip:</strong> You are entering sudo mode. After
                    you've performed a sudo-protected action, you'll only be
                    asked to re-authenticate again after a few minutes.
                </p>
            </div>
        </Modal>
    )
}

export default SudoModeModal
