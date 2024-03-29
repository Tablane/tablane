import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Popover
} from '@mui/material'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import styles from '../../../styles/SpacePopover.module.scss'
import { useDeleteSpaceMutation } from '../../../modules/services/workspaceSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function SpacePopover(props) {
    const [deleteSpace] = useDeleteSpaceMutation()
    const [deleting, setDeleting] = useState(false)

    const handleDeleteClick = () => {
        setDeleting(true)
    }

    const handleSpaceDelete = async () => {
        handleClose()
        const { workspace, space } = props

        deleteSpace({
            workspaceId: workspace._id,
            workspaceIdFriendly: workspace.id,
            spaceId: space._id
        })
        setDeleting(false)
    }

    const handleCopyClick = () => {
        props.handleClose()
        navigator.clipboard.writeText(props.space._id)
        toast('Copied!')
    }

    const handleEditClick = () => {
        const { workspace, space } = props

        props.handleClose()
        props.handleEditClick(workspace, space)
    }

    const handleClose = () => {
        props.handleClose()
        setDeleting(false)
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
                        <div onClick={handleDeleteClick}>
                            <FontAwesomeIcon icon={solid('trash-alt')} />
                        </div>
                    </div>
                </Popover>
            </div>

            {/*delete space dialog*/}
            <Dialog
                open={deleting}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Remove Space?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        All boards and tasks within this Space will be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSpaceDelete}
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

export default SpacePopover
