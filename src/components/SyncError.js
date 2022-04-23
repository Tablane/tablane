import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, makeStyles
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, {useContext, useEffect, useState} from "react";
import SyncErrorContext from "../context/SyncErrorContext";
import {green} from "@material-ui/core/colors";
import BoardContext from "../context/BoardContext";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function SyncError() {
    const classes = useStyles()
    const {syncError, setSyncError} = useContext(SyncErrorContext)
    const {getBoardData} = useContext(BoardContext)
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

        getBoardData.then(() => {
            setSyncError(false)
            setTrying(false)
            setSecondsLeft(10)
        }).catch(() => {
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
            <DialogTitle id="alert-dialog-title">{"Client out of sync"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    We will try to reconnect you.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <Button
                        onClick={handleTry}
                        color="primary"
                        variant="contained"
                        disabled={trying}>
                        {trying ? (
                            <span>Reconnecting</span>
                        ) : (
                            <span>Retrying in {secondsLeft} second{secondsLeft !== 1 && 's'}</span>
                        )}
                    </Button>
                    {trying && <CircularProgress size={24} className={classes.buttonProgress}/>}
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default SyncError