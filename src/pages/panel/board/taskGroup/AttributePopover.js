import React, {useEffect, useState} from 'react';
import Popover from '@material-ui/core/Popover';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {toast} from "react-hot-toast";
import '../../../../styles/AttributePopover.css'

function AttributePopover(props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [name, setName] = useState(props.attr.name);

    useEffect(() => {
        setName(props.attr.name)
    }, [props.attr.name])

    const handleAttributeDeleteClick = () => {
        handleClose()
        setDeleteDialogOpen(!deleteDialogOpen)
    }

    const handleAttributeDelete = async () => {
        setDeleteDialogOpen(!deleteDialogOpen)
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${props.boardId}/${props.attr._id}`
        }).then(res => {
            props.getData()
        }).catch(err => {
            toast(err.toString())
        })
    }

    const updateName = async () => {
        if (props.attr.name === name) return
        await axios({
            method: 'PATCH',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${props.boardId}/${props.attr._id}`,
            data: {
                name
            }
        }).then(res => {
            props.getData()
        }).catch(err => {
            toast(err.toString())
        })
    }

    const handleClose = (e) => {
        updateName()
        props.close()
    };

    return (
        <div>
            <Popover
                className="AttributePopover"
                open={Boolean(props.open)}
                anchorEl={props.open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="content">
                    <div className="name">
                        <input onChange={e => setName(e.target.value)} value={name} />
                        <i className="far fa-edit"> </i>
                    </div>
                    <div className="delete" onClick={handleAttributeDeleteClick}>
                        <i className="far fa-trash-alt"> </i>
                        <p>Delete</p>
                    </div>
                </div>
            </Popover>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleAttributeDeleteClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Delete this column?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This column will be deleted in all tasks within this Board.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAttributeDeleteClick} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAttributeDelete} color="primary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AttributePopover