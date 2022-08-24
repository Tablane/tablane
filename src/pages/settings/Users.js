import { Fragment, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import useInputState from '../../modules/hooks/useInputState'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import usePopoverState from '../../modules/hooks/usePopoverState'
import UserPopup from './users/UserPopup'
import { useContext } from 'react'
import WorkspaceContext from '../../modules/context/WorkspaceContext'
import RolePopup from './users/RolePopup'

const useStyles = makeStyles({
    container: {
        width: '100%'
    },
    title: {
        fontWeight: 500,
        fontSize: '21px',
        color: '#505050',
        margin: '0 0 30px'
    },
    invite: {
        '& form': {
            display: 'flex',
            margin: '0 auto 30px'
        },
        '& input': {
            height: '34px',
            boxSizing: 'border-box',
            appearance: 'none',
            flexGrow: 1,
            outline: 'none',
            border: '1px solid hsla(0,0%,59%,.6)',
            padding: '0 15px',
            borderRadius: '2px 0 0 2px',
            marginRight: '0',
            '&:focus': {
                border: '1px solid #999'
            }
        },
        '& form > div': {
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            border: '1px solid hsla(0,0%,59%,.6)',
            padding: '0px 15px',
            borderLeft: 'none',
            borderRight: 'none',
            color: '#292D34',
            fontSize: '14px',
            '& > span': {
                fontSize: '14px',
                lineHeight: '14px'
            },
            '& > i': {
                transition: 'transform 0.2s',
                verticalAlign: 'middle',
                fontSize: '14px',
                marginLeft: '8px',
                '&.menu-open': {
                    transform: 'rotate(-90deg)'
                }
            }
        },
        '& button': {
            marginLeft: '0',
            cursor: 'pointer',
            outline: 'none',
            border: '1px solid #4169E1',
            backgroundColor: '#4169E1',
            color: 'white',
            fontSize: '14px',
            height: '34px',
            fontWeight: 500,
            padding: '0 30px',
            borderRadius: '0 3px 3px 0',
            '&:hover': {
                borderColor: '#234FD7',
                backgroundColor: '#234FD7'
            }
        }
    },
    list: {
        border: '1px solid #e4e4e4',
        borderRadius: '4px',
        paddingLeft: '20px'
    },
    header: {
        paddingRight: '40px',
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #e4e4e4',
        justifyContent: 'space-between',
        '& > div': {
            flexGrow: 1,
            display: 'flex',
            '& > span': {
                boxSizing: 'border-box',
                padding: 5,
                color: '#343434',
                opacity: '.5',
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'uppercase',
                flexGrow: 1
            }
        },
        '& > div:last-of-type': {
            flexGrow: 0,
            '& > span': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '140px'
            },
            '& > span:last-of-type': {
                width: '80px'
            }
        }
    },
    rows: {
        paddingRight: '40px'
    },
    row: {
        display: 'flex',
        height: '60px',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottom: '1px solid #e4e4e4',
        justifyContent: 'space-between',
        '& > div': {
            flexGrow: 1,
            display: 'flex',
            '& > div:first-of-type': {
                display: 'flex',
                justifyContent: 'space-between',
                width: '0px',
                boxSizing: 'border-box',
                padding: 5,
                lineHeight: '24px',
                color: '#343434',
                fontSize: '13px',
                flexGrow: 1
            },
            '& > span': {
                lineHeight: '24px',
                width: '0px',
                boxSizing: 'border-box',
                padding: 5,
                color: '#343434',
                fontSize: '13px',
                flexGrow: 1
            }
        },
        '& > div:last-of-type': {
            flexGrow: 0,
            '& > span': {
                cursor: 'pointer',
                textTransform: 'capitalize',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '140px'
            },
            '& > span:last-of-type': {
                width: '80px',
                cursor: 'pointer',
                '&:hover': {
                    color: '#4169E1'
                }
            }
        },
        '&:hover': {
            backgroundColor: '#FAFBFC'
        }
    },
    labels: {
        display: 'flex',
        justifyContent: 'center',
        marginRight: '20px',
        height: '100%',
        '& span': {
            borderRadius: '4px',
            lineHeight: '22px',
            boxSizing: 'border-box',
            padding: '0 12px',
            textTransform: 'uppercase',
            fontSize: '9px',
            fontWeight: 500,
            height: '24px',
            border: '1px solid',
            letterSpacing: '.4px',
            marginLeft: '3px',
            '&.pending': {
                color: '#fc0',
                borderColor: '#fc0'
            },
            '&.owner': {
                color: '#4169E1',
                borderColor: '#4169E1'
            },
            '&.view-only': {
                color: '#fb926a',
                borderColor: '#fb926a'
            }
        }
    }
})

function Users(props) {
    const classes = useStyles()
    const { workspace, getData } = useContext(WorkspaceContext)
    const [email, changeEmail, resetEmail] = useInputState('')
    const [role, setRole] = useState('Member')
    const [anchor, open, close] = usePopoverState(false)
    const [addRoleAnchor, addRoleOpen, addRoleClose] = usePopoverState(false)
    const [roleAnchor, roleOpen, roleClose] = usePopoverState(false)

    const addUser = e => {
        e.preventDefault()
        resetEmail()
        axios({
            method: 'POST',
            withCredentials: true,
            data: {
                email: email,
                role: role
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/user/${workspace._id}`
        })
            .then(res => {
                toast('User invited')
                getData()
            })
            .catch(err => {
                if (err.response && err.response.data.error) {
                    toast(err.response.data.error)
                }
            })
    }

    return (
        <div className={classes.container}>
            <p className={classes.title}>Manage People</p>
            <div className={classes.invite}>
                <form onSubmit={addUser}>
                    <input
                        placeholder="Invite by Email"
                        value={email}
                        onChange={changeEmail}
                        type="text"
                    />
                    <div onClick={addRoleOpen}>
                        <span>{role}</span>
                        <i
                            className={`fas fa-caret-left ${
                                Boolean(addRoleAnchor) ? 'menu-open' : ''
                            }`}
                        >
                            {' '}
                        </i>
                    </div>
                    <button>Invite</button>
                </form>
            </div>
            <div className={classes.list}>
                <div className={classes.header}>
                    <div>
                        <span>Name</span>
                        <span>Email</span>
                    </div>
                    <div>
                        <span>Role</span>
                        <span>Settings</span>
                    </div>
                </div>
                <div className={classes.rows}>
                    {workspace.members.map(x => (
                        <Fragment key={x.user._id}>
                            {anchor.id === x.user._id && (
                                <UserPopup
                                    member={x}
                                    anchor={anchor}
                                    close={close}
                                />
                            )}
                            {roleAnchor.id === x.user._id &&
                                x.role !== 'owner' && (
                                    <RolePopup
                                        anchor={roleAnchor}
                                        close={roleClose}
                                        cRole={x.role}
                                    />
                                )}
                            <div className={classes.row} key={x.email}>
                                <div>
                                    <div>
                                        <span>{x.user.username}</span>
                                        <div className={classes.labels}>
                                            {x.labels.map(label => (
                                                <span
                                                    key={label}
                                                    className={`${label.toLowerCase()}`}
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                            {x.role === 'owner' && (
                                                <span className={'owner'}>
                                                    Owner
                                                </span>
                                            )}
                                            {x.role === 'guest' && (
                                                <span className={'view-only'}>
                                                    View Only
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span>{x.user.email}</span>
                                </div>
                                <div>
                                    <span id={x.user._id} onClick={roleOpen}>
                                        {x.role}
                                    </span>
                                    <span onClick={open} id={x.user._id}>
                                        <i className="fas fa-ellipsis-h"> </i>
                                    </span>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            <RolePopup
                anchor={addRoleAnchor}
                setRole={setRole}
                close={addRoleClose}
            />
        </div>
    )
}

export default Users
