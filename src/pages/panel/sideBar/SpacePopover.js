import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    Popover
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { deleteSpace } from '../../../modules/state/reducers/workspaceReducer'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles(theme => ({
    popover: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        '& > div': {
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
                cursor: 'pointer',
                background: '#F9F9F9'
            }
        },
        '& > div:last-of-type': {
            color: 'crimson'
        }
    }
}))

function SpacePopover(props) {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [deleting, setDeleting] = useState(false)

    const handleDeleteClick = () => {
        setDeleting(true)
    }

    const handleSpaceDelete = async () => {
        handleClose()
        const { workspace, space } = props

        dispatch(
            deleteSpace({ workspaceId: workspace._id, spaceId: space._id })
        )
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
                    <div className={classes.popover}>
                        <div onClick={handleCopyClick}>
                            <i className="fas fa-link"> </i>
                        </div>
                        <div onClick={handleEditClick}>
                            <i className="fas fa-pen"> </i>
                        </div>
                        <div onClick={handleDeleteClick}>
                            <i className="fas fa-trash-alt"> </i>
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
