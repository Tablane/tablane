import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    Popover
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../../../../../modules/state/reducers/boardReducer";

const useStyles = makeStyles({
    container: {
        height: '40px',
        display: "flex",
        '& i': {
            width: '38px',
            padding: '12px 0',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#f9f9f9'
            }
        },
        '& i:last-of-type': {
            color: '#ff80b9'
        }
    }
})

function TaskPopover(props) {
    const dispatch = useDispatch()
    const {board} = useSelector(state => state.board)
    const classes = useStyles()
    const [deleteDialog, setDeleteDialog] = useState(false)

    // delete dialog
    const handleDeleteClose = () => {
        props.handleClose()
        setDeleteDialog(!deleteDialog)
    }

    const handleDelete = () => {
        setDeleteDialog(false)
        dispatch(deleteTask({
            boardId: board._id,
            taskId: props.task._id
        }))
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
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.container}>
                    <i className="fas fa-hashtag" onClick={copyTaskId}> </i>
                    <i className="fas fa-pen" onClick={editTask}> </i>
                    <i className="far fa-trash-alt" onClick={handleDeleteClose}> </i>
                </div>
            </Popover>

            <Dialog
                open={deleteDialog}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete this task?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        It will be kept in your Recycle Bin for 30 days.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TaskPopover