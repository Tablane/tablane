import React, { useEffect, useState } from 'react'
import Popover from '@mui/material/Popover'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import Button from '@mui/material/Button'
import '../../../../styles/AttributePopover.css'
import {
    useDeleteAttributeMutation,
    useEditAttributeNameMutation
} from '../../../../modules/services/boardSlice'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AttributePopover(props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [name, setName] = useState(props.attr.name)
    const [deleteAttribute] = useDeleteAttributeMutation()
    const [editAttributeName] = useEditAttributeNameMutation()

    useEffect(() => {
        setName(props.attr.name)
    }, [props.attr.name])

    const handleAttributeDeleteClick = () => {
        handleClose()
        setDeleteDialogOpen(!deleteDialogOpen)
    }

    const handleAttributeDelete = async () => {
        setDeleteDialogOpen(!deleteDialogOpen)
        deleteAttribute({ attributeId: props.attr._id, boardId: props.boardId })
    }

    const updateName = async () => {
        if (props.attr.name === name) return
        editAttributeName({
            attributeId: props.attr._id,
            name,
            boardId: props.boardId
        })
    }

    const handleClose = e => {
        updateName()
        props.close()
    }

    return (
        <div>
            <Popover
                className="AttributePopover"
                open={Boolean(props.open)}
                anchorEl={props.open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                <div className="content">
                    <div className="name">
                        <input
                            onChange={e => setName(e.target.value)}
                            value={name}
                        />
                        <FontAwesomeIcon icon={regular('edit')} />
                    </div>
                    <div
                        className="delete"
                        onClick={handleAttributeDeleteClick}
                    >
                        <FontAwesomeIcon icon={regular('trash-alt')} />
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
                        This column will be deleted in all tasks within this
                        Board.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAttributeDeleteClick}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAttributeDelete}
                        color="primary"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AttributePopover
