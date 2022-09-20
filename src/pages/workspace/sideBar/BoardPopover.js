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
import styles from '../../../styles/BoardPopover.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeleteBoardMutation } from '../../../modules/services/workspaceSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function BoardPopover(props) {
    const [deleteBoard] = useDeleteBoardMutation()
    const location = useLocation()
    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)

    const handleBoardDelete = async () => {
        handleClose()
        const { workspace, space, board } = props
        setDeleting(false)
        if (location.pathname.includes(board.name)) navigate('/' + workspace.id)
        deleteBoard({
            workspace,
            spaceId: space._id,
            boardId: board._id
        })
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
                            <FontAwesomeIcon icon={solid('link')} />
                        </div>
                        <div onClick={handleEditClick}>
                            <FontAwesomeIcon icon={solid('pen')} />
                        </div>
                        <div onClick={deleteDialogOpen}>
                            <FontAwesomeIcon icon={solid('trash-alt')} />
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
