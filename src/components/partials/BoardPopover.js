import {
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    Popover
} from "@material-ui/core";
import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {toast} from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
    popover: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
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
}));

function BoardPopover(props) {
    const classes = useStyles();
    const [deleting, setDeleting] = useState(false);

    const handleBoardDelete = async () => {
        handleClose()
        const {workspace, space, board} = props
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/board/${workspace._id}/${space._id}/${board._id}`
        }).then(res => {
            props.getData()
            setDeleting(false)
        }).catch(err => {
            toast(err.toString())
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
        const {workspace, space, board} = props

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
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className={classes.popover}>
                        <div onClick={handleCopyClick}><i className="fas fa-link"> </i></div>
                        <div onClick={handleEditClick}><i className="fas fa-pen"> </i></div>
                        <div onClick={deleteDialogOpen}><i className="fas fa-trash-alt"> </i></div>
                    </div>
                </Popover>
            </div>

            {/* delete board dialog*/}
            <Dialog
                open={deleting}
                onClose={() => setDeleting(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Remove Board?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        All tasks within this Board will be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleBoardDelete} color="primary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BoardPopover