import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import Button from '@mui/material/Button'
import useInputState from '../../modules/hooks/useInputState'
import { toast } from 'react-hot-toast'
import { useContext, useState } from 'react'
import axios from 'axios'
import WorkspaceContext from '../../modules/context/WorkspaceContext'
import useToggleState from '../../modules/hooks/useToggleState'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/General.module.scss'

function General(props) {
    const { workspace, getData } = useContext(WorkspaceContext)
    const [deleting, setDeleting] = useToggleState(false)
    const [name, changeName] = useInputState(workspace.name)
    const nameEdited = name !== workspace.name
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    const handleDelete = () => {
        axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/${workspace._id}`
        })
            .then(() => {
                toast('Workspace successfully deleted')
                navigate('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleRename = () => {
        setSaving(true)
        axios({
            method: 'PATCH',
            withCredentials: true,
            data: {
                name: name
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/${workspace._id}`
        })
            .then(res => {
                getData()
                setSaving(false)
            })
            .catch(err => {
                setSaving(false)
                console.log(err)
            })
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.name}>
                    <p>Workspace Settings</p>
                </div>
                <div className={styles.workspaceName}>
                    <div>{workspace.name[0]}</div>
                    <input type="text" value={name} onChange={changeName} />
                </div>
                <div className={styles.buttons}>
                    <div>
                        <Button
                            variant="outlined"
                            onClick={() => toast('Currently not supported')}
                        >
                            Transfer Ownership
                        </Button>
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={setDeleting}
                        >
                            Delete Workspace
                        </Button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={!nameEdited}
                            onClick={handleRename}
                        >
                            {nameEdited ? 'Save' : 'Saved'}
                        </Button>
                        {saving && (
                            <CircularProgress
                                size={24}
                                className="buttonProgress"
                            />
                        )}
                    </div>
                </div>
            </div>
            <Dialog
                open={deleting}
                onClose={setDeleting}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Delete Workspace?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting this Workspace will delete all files, tasks,
                        and history.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setDeleting} color="primary">
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

export default General
