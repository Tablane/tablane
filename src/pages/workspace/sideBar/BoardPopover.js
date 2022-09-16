import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Popover
} from '@mui/material'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { deleteBoard } from '../../../modules/state/reducers/workspaceReducer'
import styles from '../../../styles/BoardPopover.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'

function BoardPopover(props) {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)

    const handleBoardDelete = async () => {
        handleClose()
        const { workspace, space, board } = props
        setDeleting(false)
        if (location.pathname.includes(board.name)) navigate('/' + workspace.id)
        dispatch(
            deleteBoard({
                workspaceId: workspace._id,
                spaceId: space._id,
                boardId: board._id
            })
        )
    }

    const deleteDialogOpen = () => {
        setDeleting(true)
    }

    const handleCopyClick = () => {
        props.handleClose()
        navigator.clipboard.writeText(props.board._id)
        toast('Copied!')
    }

    const handleClose = () => {
        props.handleClose()
        setDeleting(false)
    }

    const handleEditClick = () => {
        const { workspace, space, board } = props

        props.handleClose()
        props.handleEditClick(workspace, space, board)
    }

    return (
        <>
            <div>
                <Popover
                    open={deleting ? false : Boolean(props.anchor)}
                    anchorEl={props.anchor}
                    onClose={props.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    <div className={styles.popover}>
                        <div onClick={handleCopyClick}>
                            <i className="fas fa-link"> </i>
                        </div>
                        <div onClick={handleEditClick}>
                            <i className="fas fa-pen"> </i>
                        </div>
                        <div onClick={deleteDialogOpen}>
                            <i className="fas fa-trash-alt"> </i>
                        </div>
                    </div>
                </Popover>
            </div>

            {/* delete board dialog*/}
            <Dialog
                open={deleting}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Remove Board?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        All tasks within this Board will be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBoardDelete}
                        color="primary"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BoardPopover
