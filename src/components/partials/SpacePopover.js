import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import axios from "axios";
import {toast} from "react-hot-toast";

const handleSpaceDeleteClick = (spaceId = '') => {
    this.setState(st => ({
        deleteSpaceDialogOpen: !st.deleteSpaceDialogOpen,
        deleteSpace: spaceId
    }))
}

const handleSpaceDelete = async () => {
    await axios({
        method: 'DELETE',
        withCredentials: true,
        url: `http://localhost:3001/api/space/${this.props.workspaces._id}/${this.state.deleteSpace}`
    }).then(res => {
        this.props.getData()
        this.setState({deleteSpaceDialogOpen: false})
    }).catch(err => {
        toast(err.toString())
    })
}

{/*delete space dialog*/}
<Dialog
    open={this.state.deleteSpaceDialogOpen}
    onClose={this.handleSpaceDeleteClick}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">{"Remove Space?"}</DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">
            All boards and tasks within this Space will be deleted.
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={this.handleSpaceDeleteClick} color="primary">
            Cancel
        </Button>
        <Button onClick={this.handleSpaceDelete} color="primary" variant="contained">
            Delete
        </Button>
    </DialogActions>
</Dialog>