import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    container: {
        padding: '40px'
    },
    title: {
        margin: 0,
        fontWeight: '500',
        fontSize: '21px',
        marginBottom: '30px'
    },
    workspaces: {
        '& > a': {
            cursor: 'auto'
        }
    },
    workspace: {
        display: 'inline-block',
        width: '160px',
        height: '204px',
        margin: '0 70px 50px 0',
        textAlign: 'center',
        '&:hover div p': {
            backgroundColor: 'rgba(84,77,97,.8)'
        }
    },
    avatar: {
        width: '160px',
        height: '160px',
        backgroundColor: 'rgb(83, 108, 254)',
        borderRadius: '50%',
        lineHeight: '160px',
        fontSize: '50px',
        color: 'white',
        '& p': {
            margin: 0,
            transition: 'background-color .2s',
            borderRadius: '50%',
        }
    },
    newWorkspace: {
        display: 'inline-block',
        width: '160px',
        height: '204px',
        margin: '0 70px 50px 0',
        textAlign: 'center',
    },
    newAvatar: {
        width: '160px',
        height: '160px',
        border: '1px solid #979797',
        borderRadius: '50%',
        lineHeight: '160px',
        fontSize: '50px',
        transition: 'color .2s, background-color .2s',
        color: '#4169e1',
        '& p': {
            margin: 0,
        },
        '&:hover': {
            backgroundColor: 'rgb(83, 108, 254)',
            color: 'white',
        }
    },
    newText: {
        color: '#4169E1'
    }
});


function WorkspaceSelector(props) {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <p className={classes.title}>My Workspaces</p>
            <div className={classes.workspaces}>
                {props.workspaces.map(x => (
                    <Link to={`/${x.id}`}>
                        <div className={classes.workspace}>
                            <div className={classes.avatar}>
                                <p>{x.name.charAt(0).toUpperCase()}</p>
                            </div>
                            <p>{x.name}</p>
                        </div>
                    </Link>
                ))}
                <div className={classes.newWorkspace}>
                    <div className={classes.newAvatar}>
                        <p><i className="fas fa-plus"> </i></p>
                    </div>
                    <p className={classes.newText}>Add new</p>
                </div>
            </div>
        </div>
    )
}

export default WorkspaceSelector