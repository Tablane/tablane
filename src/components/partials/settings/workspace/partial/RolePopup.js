import {makeStyles, Popover} from "@material-ui/core";
import axios from "axios";
import {toast} from "react-hot-toast";
import {useContext} from "react";
import WorkspaceContext from "../../../../../context/WorkspaceContext";

const useStyles = makeStyles({
    container: {
        '& > div': {
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '41px',
            padding: '6px 20px',
            boxSizing: 'border-box',
            width: '110px',
            '&:not(:last-of-type)': {
                borderBottom: '1px solid #e4e4e4',
            },
            '&:hover': {
                backgroundColor: '#f9f9f9',
            },
            '& > div': {
                width: '16px',
                height: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            '& > p': {
                fontSize: "13px",
                fontWeight: "400",
                color: "#7b7b7b",
                padding: '8px 0 8px 10px',
                margin: 0
            },
        },
        '& i.fa-check': {
            marginLeft: '6px',
            fontSize: '13px',
            color: '#4169E1',
        }
    }
});

function RolePopup(props) {
    const classes = useStyles();
    const {workspace, getData} = useContext(WorkspaceContext)

    const changeRole = (id, role) => {
        axios({
            method: "PATCH",
            withCredentials: true,
            data: {
                role: role
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/user/${workspace._id}/${id}`,
        }).then((res) => {
            getData()
        }).catch(x => {
            toast(x)
        })
    }

    const setRole = (e) => {
        const role = e.currentTarget.id
        if (props.anchor.id) {
            changeRole(props.anchor.id, role)
        } else {
            props.setRole(role)
        }
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
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.container}>
                    <div onClick={setRole} id="Guest">
                        <p>Guest</p>
                        {props.cRole === 'guest' && (
                            <i className="fas fa-check"> </i>
                        )}
                    </div>
                    <div onClick={setRole} id="Member">
                        <p>Member</p>
                        {props.cRole === 'member' && (
                            <i className="fas fa-check"> </i>
                        )}
                    </div>
                    <div onClick={setRole} id="Admin">
                        <p>Admin</p>
                        {(props.cRole === 'admin' || props.cRole === 'owner') && (
                            <i className="fas fa-check"> </i>
                        )}
                    </div>
                </div>
            </Popover>
        </div>
    );
}

export default RolePopup