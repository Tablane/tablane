import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import useInputState from '../../modules/hooks/useInputState'
import { toast } from 'react-hot-toast'
import { useContext, useState } from 'react'
import axios from 'axios'
import WorkspaceContext from '../../modules/context/WorkspaceContext'
import useToggleState from '../../modules/hooks/useToggleState'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    name: {
        fontWeight: 500,
        fontSize: '21px',
        color: '#505050',
        marginBottom: '30px',
        '& p': {
            margin: 0
        }
    },
    workspaceName: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '30px',
        alignItems: 'center',
        '& div': {
            textTransform: 'uppercase',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgb(64, 188, 134)',
            display: 'inline-flex',
            lineHeight: '50px',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '20px',
            color: 'white'
        },
        '& input': {
            outline: 'none',
            padding: '16px 20px 12px 0',
            border: 'none',
            color: 'rgba(34,34,34,.6)',
            fontSize: '16px',
            borderBottom: '1px solid #E4E4E4',
            flexGrow: '1'
        }
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& div > button:nth-of-type(2)': {
            marginLeft: '15px'
        }
    }
})

function General(props) {
    const classes = useStyles()
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
            <div className={classes.container}>
                <div className={classes.name}>
                    <p>Workspace Settings</p>
                </div>
                <div className={classes.workspaceName}>
                    <div>{workspace.name[0]}</div>
                    <input type="text" value={name} onChange={changeName} />
                </div>
                <div className={classes.buttons}>
                    <div>
                        <Button
                            variant="outlined"
                            onClick={() => toast('Currently not supported')}
                        >
                            Transfer Ownership
                        </Button>
                        <Button
                            color="secondary"
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
