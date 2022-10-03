import { Dialog, DialogContent, DialogTitle, Switch } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import styles from '../../../styles/ShareDialog.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useSetSharingMutation } from '../../../modules/services/boardSlice'

function ShareDialog({ handleClose, open, board }) {
    const [setSharing] = useSetSharingMutation()

    const toggleShare = (e, share) => {
        setSharing({
            boardId: board._id,
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
                        checked={board.sharing}
                        onChange={toggleShare}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </div>
                {board.sharing && (
                    <div className={styles.shareInfo}>
                        <div>
                            <FontAwesomeIcon icon={solid('link')} />
                            <p>Public link</p>
                        </div>
                        <input
                            type="text"
                            value={`${window.location.origin}/share/${board._id}`}
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
