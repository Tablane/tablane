import { Dialog, DialogContent, DialogTitle, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useSelector } from 'react-redux'
import styles from '../../../styles/ShareDialog.module.scss'

function ShareDialog(props) {
    const { board } = useSelector(state => state.board)
    const [check, setCheck] = useState(board.sharing)
    const [link, setLink] = useState(
        board.sharing
            ? `${window.location.origin}/share/${board._id}`
            : 'Loading...'
    )

    useEffect(() => {
        setCheck(board.sharing)
        setLink(
            board.sharing
                ? `${window.location.origin}/share/${board._id}`
                : 'Loading...'
        )
    }, [board])

    const toggleShare = (e, x) => {
        setCheck(x)
        if (x) setLink('Loading...')
        axios({
            method: 'PATCH',
            data: {
                share: x
            },
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/share/${board._id}`
        })
            .then(res => {
                if (x)
                    setLink(
                        `${window.location.origin}/share/${res.data.boardId}`
                    )
            })
            .catch(err => {
                setCheck(!x)
                toast(err.toString())
            })
    }

    const copy = e => {
        if (window.isSecureContext) {
            toast('Copied!')
            navigator.clipboard.writeText(e.target.value)
        }
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle id="alert-dialog-title">{'Share Board'}</DialogTitle>
            <DialogContent className={styles.content}>
                <div className={styles.sharing}>
                    <p>Link sharing</p>
                    <Switch
                        checked={check}
                        onChange={toggleShare}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </div>
                {check && (
                    <div className={styles.shareInfo}>
                        <div>
                            <i className="fas fa-link"> </i>
                            <p>Public link</p>
                        </div>
                        <input
                            type="text"
                            value={link}
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
