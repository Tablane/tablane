import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Popover
} from '@mui/material'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import styles from '../../../../../styles/TaskPopover.module.scss'
import { useDeleteTaskMutation } from '../../../../../modules/services/boardSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function TaskPopover(props) {
    const [deleteTask] = useDeleteTaskMutation()
    const [deleteDialog, setDeleteDialog] = useState(false)

    // delete dialog
    const handleDeleteClose = () => {
        props.handleClose()
        setDeleteDialog(!deleteDialog)
    }

    const handleDelete = () => {
        setDeleteDialog(false)
        deleteTask({
            boardId: props.board._id,
            taskId: props.task._id
        })
    }

    // copy task id
    const copyTaskId = () => {
        props.handleClose()
        navigator.clipboard.writeText(props.task._id)
        toast('Copied!')
    }

    // edit task
    const editTask = () => {
        props.handleClose()
        props.toggleTaskEdit()
    }

    return (
        <>
            <Popover
                open={props.open}
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
                <div className={styles.container}>
                    <FontAwesomeIcon
                        icon={solid('hashtag')}
                        onClick={copyTaskId}
                    />
                    <FontAwesomeIcon icon={solid('pen')} onClick={editTask} />
                    <FontAwesomeIcon
                        icon={regular('trash-alt')}
                        onClick={handleDeleteClose}
                    />
                </div>
            </Popover>

            <Dialog
                open={deleteDialog}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Delete this task?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        It will be kept in your Recycle Bin for 30 days.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
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

export default TaskPopover
