import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import Button from '@mui/material/Button'
import React, { useContext, useEffect, useState } from 'react'
import SyncErrorContext from '../modules/context/SyncErrorContext'
import BoardContext from '../modules/context/BoardContext'
import axios from 'axios'
import styles from '../styles/SyncError.module.scss'

function SyncError() {
    const { syncError, setSyncError } = useContext(SyncErrorContext)
    const { getBoardData } = useContext(BoardContext)
    const [trying, setTrying] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(10)

    useEffect(() => {
        if (!syncError) return
        const timer = setInterval(() => {
            setSecondsLeft(current => {
                if (current === 1) handleTry()
                return current - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [syncError])

    const handleTry = () => {
        setTrying(true)

        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user`,
            withCredentials: true
        })
            .then(() => {
                getBoardData()
                setSyncError(false)
                setTrying(false)
                setSecondsLeft(10)
            })
            .catch(() => {
                setTrying(false)
                setSecondsLeft(10)
            })
    }

    return (
        <Dialog
            open={syncError}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {'Client out of sync'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    We will try to reconnect you.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className={styles.wrapper}>
                    <Button
                        onClick={handleTry}
                        color="primary"
                        variant="contained"
                        disabled={trying}
                    >
                        {trying ? (
                            <span>Reconnecting</span>
                        ) : (
                            <span>
                                Retrying in {secondsLeft} second
                                {secondsLeft !== 1 && 's'}
                            </span>
                        )}
                    </Button>
                    {trying && (
                        <CircularProgress
                            size={24}
                            className={styles.buttonProgress}
                        />
                    )}
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default SyncError
