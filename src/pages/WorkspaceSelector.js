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
import useInputState from '../modules/hooks/useInputState'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import useToggleState from '../modules/hooks/useToggleState'
import styles from '../styles/WorkspaceSelector.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ErrorPage from '../utils/ErrorPage'
import { useFetchUserQuery } from '../modules/services/userSlice'

function WorkspaceSelector() {
    const navigate = useNavigate()
    const [name, changeName, resetName] = useInputState()
    const [dialogOpen, toggleDialogOpen] = useToggleState(false)
    const { data: user, isLoading, error } = useFetchUserQuery()

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
        axios({
            method: 'POST',
            withCredentials: true,
            data: {
                name
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/`
        })
            .then(res => {
                toast('Workspace has been successfully created')
                navigate(`/${res.data.id}`)
            })
            .catch(err => {
                console.log(err)
                toast('Please enable third-party cookies')
            })
        resetName()
    }

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>My Workspaces</p>
                <div className={styles.workspaces}>
                    {user.workspaces.map(x => (
                        <Link to={`/${x.id}`} key={x._id}>
                            <div className={styles.workspace}>
                                <div className={styles.avatar}>
                                    <p>{x.name.charAt(0).toUpperCase()}</p>
                                </div>
                                <p>{x.name}</p>
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
