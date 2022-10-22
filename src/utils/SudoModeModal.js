import { Modal } from '@mantine/core'
import styles from '../styles/SudoModeModal.module.scss'
import SudoModeModalContent from './sudoModeModal/SudoModeModalContent'

function SudoModeModal({ open, setOpen, onConfirm }) {
    const handleSubmit = e => {
        e.preventDefault()
        console.log('enabling sudo mode')
        setOpen(false)
        onConfirm()
    }

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            className={styles.modal}
        >
            <SudoModeModalContent handleSubmit={handleSubmit} />
        </Modal>
    )
}

export default SudoModeModal
