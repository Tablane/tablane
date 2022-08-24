import {
    Dialog,
    DialogContent,
    DialogTitle,
    makeStyles,
    Switch
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useSelector } from 'react-redux'

const useStyles = makeStyles({
    content: {
        marginBottom: '15px'
    },
    sharing: {
        border: '1px solid #e9ebf0',
        maxWidth: '500px',
        padding: '5px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '44px',
        '& p': {
            margin: 0,
            width: '500px',
            flexGrow: '1'
        }
    },
    shareInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #e9ebf0',
        borderTop: 'none',
        height: '100px',
        padding: '18px',
        backgroundColor: '#FAFBFC',
        '& div:first-of-type': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
            '& p': {
                marginLeft: '10px',
                margin: 0
            }
        },
        '& input': {
            appearance: 'none',
            marginTop: '18px',
            border: '1px solid #e9ebf0',
            backgroundColor: '#fff',
            borderRadius: '2px',
            padding: '18px',
            height: '52px',
            width: '100%',
            boxSizing: 'border-box',
            outline: 'none',
            '&:hover': {
                color: '#4169E1'
            }
        }
    }
})

function ShareDialog(props) {
    const classes = useStyles()
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
            <DialogContent className={classes.content}>
                <div className={classes.sharing}>
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
                    <div className={classes.shareInfo}>
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
