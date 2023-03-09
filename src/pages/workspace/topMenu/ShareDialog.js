import { Dialog, DialogContent, DialogTitle, Switch } from '@mui/material'
import React from 'react'
import { toast } from 'react-hot-toast'
import styles from '../../../styles/ShareDialog.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useSetSharingMutation } from '../../../modules/services/boardSlice.ts'
import { useParams } from 'react-router-dom'

function ShareDialog({ handleClose, open, boardId, view }) {
    const params = useParams()
    const [setSharing] = useSetSharingMutation()

    const toggleShare = (e, share) => {
        setSharing({
            viewShortId: params.view,
            viewId: view._id,
            boardId,
            share
        })
    }

    const copy = e => {
        if (window.isSecureContext) {
            toast('Copied!')
            navigator.clipboard.writeText(e.target.value)
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">{'Share Board'}</DialogTitle>
            <DialogContent className={styles.content}>
                <div className={styles.sharing}>
                    <p>Link sharing</p>
                    <Switch
                        checked={view.sharing}
                        onChange={toggleShare}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </div>
                {view.sharing && (
                    <div className={styles.shareInfo}>
                        <div>
                            <FontAwesomeIcon icon={solid('link')} />
                            <p>Public link</p>
                        </div>
                        <input
                            type="text"
                            className="text-sm"
                            value={`${window.location.origin}/shared/view/${view._id}`}
                            onClick={copy}
                            readOnly
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ShareDialog
