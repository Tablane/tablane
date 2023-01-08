import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import useInputState from '../modules/hooks/useInputState.tsx'
import { toast } from 'react-hot-toast'
import useToggleState from '../modules/hooks/useToggleState.tsx'
import styles from '../styles/WorkspaceSelector.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ErrorPage from '../utils/ErrorPage'
import { useFetchUserQuery } from '../modules/services/userSlice'
import { useAddWorkspaceMutation } from '../modules/services/workspaceSlice'
import { useEffect } from 'react'

function WorkspaceSelector({ noPadding }) {
    const navigate = useNavigate()
    const [addWorkspace] = useAddWorkspaceMutation()
    const [name, changeName, resetName] = useInputState()
    const [dialogOpen, toggleDialogOpen] = useToggleState(false)
    const { data: user, isLoading, error } = useFetchUserQuery()

    useEffect(() => {
        const lastVisitedBoard = localStorage.getItem('lastVisitedBoard')
        localStorage.removeItem('lastVisitedBoard')
        if (window.location.pathname === '/' && lastVisitedBoard) {
            navigate(lastVisitedBoard)
        }
    }, [])

    if (isLoading)
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    if (error) {
        return <ErrorPage error={error} />
    }

    const handleCreate = () => {
        addWorkspace({ name })
            .unwrap()
            .then(({ id }) => {
                toast('Workspace has been successfully created')
                navigate(`/${id}`)
            })
            .catch(err => {
                console.log(err)
                toast('Please enable third-party cookies')
            })
        resetName()
    }

    return (
        <>
            <div className={noPadding ? null : styles.container}>
                <p className={styles.title}>My Workspaces</p>
                <div className={styles.workspaces}>
                    {user.workspaces.map(x => (
                        <Link to={`/${x.id}`} key={x._id}>
                            <div className={styles.workspace}>
                                <div className={styles.avatar}>
                                    <p>{x.name.charAt(0).toUpperCase()}</p>
                                </div>
                                <p className={styles.name}>{x.name}</p>
                            </div>
                        </Link>
                    ))}
                    <div
                        className={styles.newWorkspace}
                        onClick={toggleDialogOpen}
                    >
                        <div className={styles.newAvatar}>
                            <p>
                                <FontAwesomeIcon icon={solid('plus')} />
                            </p>
                        </div>
                        <p className={styles.newText}>Add new</p>
                    </div>
                </div>
            </div>

            <Dialog
                open={dialogOpen}
                fullWidth={true}
                maxWidth={'sm'}
                onClose={toggleDialogOpen}
            >
                <DialogTitle>Create a new Workspace</DialogTitle>
                <DialogContent>
                    <TextField
                        value={name}
                        onChange={changeName}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Workspace Name"
                        type="name"
                        fullWidth
                        onKeyUp={e => {
                            if (e.key === 'Enter') {
                                handleCreate()
                            }
                        }}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialogOpen}>Cancel</Button>
                    <Button
                        onClick={handleCreate}
                        color="primary"
                        variant="contained"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default WorkspaceSelector
