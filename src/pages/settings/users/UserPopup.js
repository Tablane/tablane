import { makeStyles, Popover } from '@material-ui/core'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useContext } from 'react'
import WorkspaceContext from '../../../modules/context/WorkspaceContext'

const useStyles = makeStyles({
    container: {
        '& > div': {
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '41px',
            padding: '6px 20px',
            boxSizing: 'border-box',
            width: '180px',
            '&:not(:last-of-type)': {
                borderBottom: '1px solid #e4e4e4'
            },
            '&:hover': {
                backgroundColor: '#f9f9f9'
            },
            '& > div': {
                width: '16px',
                height: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            '& > p': {
                fontSize: '13px',
                fontWeight: '400',
                color: '#7b7b7b',
                padding: '8px 0 8px 10px',
                margin: 0
            }
        },
        '& i.fa-times': {
            color: '#fd71af'
        }
    }
})

function UserPopup(props) {
    const classes = useStyles()
    const { workspace, getData } = useContext(WorkspaceContext)

    const copyId = () => {
        navigator.clipboard.writeText(props.member.user._id)
        toast('Copied!')
        props.close()
    }

    const removeUser = () => {
        axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/user/${workspace._id}/${props.member.user._id}`
        })
            .then(res => {
                toast('User removed')
                getData()
            })
            .catch(err => {
                if (err.response && err.response.data.error) {
                    toast(err.response.data.error)
                }
            })
        props.close()
    }

    return (
        <div>
            <Popover
                open={Boolean(props.anchor)}
                anchorEl={props.anchor}
                onClose={props.close}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <div className={classes.container}>
                    {!props.member.labels.includes('Pending') && (
                        <>
                            <div onClick={copyId}>
                                <div>
                                    <i className="far fa-clone"> </i>
                                </div>
                                <p>Copy Member ID</p>
                            </div>
                            {props.member.role !== 'owner' && (
                                <div onClick={removeUser}>
                                    <div>
                                        <i className="fas fa-times"> </i>
                                    </div>
                                    <p>Remove</p>
                                </div>
                            )}
                        </>
                    )}
                    {props.member.labels.includes('Pending') && (
                        <>
                            <div>
                                <div>
                                    <i className="fas fa-share"> </i>
                                </div>
                                <p>Resend Invitation</p>
                            </div>
                            <div>
                                <div>
                                    <i className="fas fa-times"> </i>
                                </div>
                                <p>Cancel invite</p>
                            </div>
                        </>
                    )}
                </div>
            </Popover>
        </div>
    )
}

export default UserPopup
