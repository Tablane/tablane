import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import Button from '@mui/material/Button'
import useInputState from '../../modules/hooks/useInputState.tsx'
import { toast } from 'react-hot-toast'
import useToggleState from '../../modules/hooks/useToggleState.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../../styles/General.module.scss'
import {
    useDeleteWorkspaceMutation,
    useFetchWorkspaceQuery,
    useRenameWorkspaceMutation
} from '../../modules/services/workspaceSlice'

function General() {
    const [deleting, setDeleting] = useToggleState(false)
    const navigate = useNavigate()
    const params = useParams()
    const { data: workspace, isFetching } = useFetchWorkspaceQuery(
        params.workspace
    )
    const [name, changeName] = useInputState(workspace.name)
    const nameEdited = name !== workspace.name
    const [deleteWorkspace, { isLoading: isDeleting }] =
        useDeleteWorkspaceMutation()
    const [renameWorkspace, { isLoading }] = useRenameWorkspaceMutation()

    const handleDelete = async () => {
        await deleteWorkspace({ workspace })
        localStorage.removeItem('lastVisitedBoard')
        navigate('/')
    }

    const handleRename = () => {
        renameWorkspace({ workspace, name })
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
                            disabled={!nameEdited || isLoading || isFetching}
                            onClick={handleRename}
                        >
                            {nameEdited ? 'Save' : 'Saved'}
                        </Button>
                        {(isLoading || isFetching) && (
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
                    <div style={{ position: 'relative' }}>
                        <Button
                            onClick={handleDelete}
                            color="primary"
                            variant="contained"
                            disabled={isDeleting}
                        >
                            Delete
                        </Button>
                        {isDeleting && (
                            <CircularProgress
                                size={24}
                                className="buttonProgress"
                            />
                        )}
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default General
