import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { CircularProgress, makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles({
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    forbidden: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '80px',
        '& div': {
            textAlign: 'center',
            padding: '45px',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgb(0 0 0 / 15%)',
            '& p:first-of-type': {
                fontSize: '24px',
                fontWeight: 500
            },
            '& p:nth-of-type(2)': {
                fontSize: '14px',
                '& span': {
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#4169e1'
                }
            }
        }
    },
    container: {
        height: '100vh',
        display: 'flex'
    },
    taskGroups: {
        backgroundColor: '#EEE',
        padding: '25px',
        width: '100%'
    },
    tasks: {
        border: '2px solid white',
        borderRadius: '0 2px 2px 2px'
    }
})

function SharedBoard(props) {
    const classes = useStyles()
    const [board, setBoard] = useState(null)
    const params = useParams()

    const getData = useCallback(async () => {
        await axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/share/${params.boardId}`
        })
            .then(res => {
                setBoard(res.data)
            })
            .catch(() => {
                setBoard(false)
            })
    }, [params.boardId])

    useEffect(() => {
        getData()
    }, [getData])

    const getStatusLabel = (attribute, task) => {
        let taskOption = task.options.find(x => x.column === attribute._id)
        let label

        if (taskOption) {
            label = attribute.labels.find(x => x._id === taskOption.value)
        } else label = { color: 'rgb(196,196,196)', name: '' }

        if (!label) label = { color: 'rgb(196,196,196)', name: '' }

        return (
            <Fragment key={attribute._id}>
                <div style={{ backgroundColor: label.color }}>{label.name}</div>
            </Fragment>
        )
    }

    const getTextLabel = (attribute, task) => {
        let taskOption = task.options.find(x => x.column === attribute._id)
        if (!taskOption) taskOption = { value: '' }
        return (
            <div style={{ backgroundColor: 'transparent' }} key={attribute._id}>
                <input
                    type="text"
                    name={attribute._id}
                    value={taskOption.value}
                    readOnly
                />
            </div>
        )
    }

    if (board === null)
        return (
            <div className={classes.loading}>
                <CircularProgress />
            </div>
        )
    if (board === false)
        return (
            <div className={classes.forbidden}>
                <div>
                    <p>This page is currently unavailable</p>
                    <p>
                        To create your own public tasks or views,{' '}
                        <span>create an account</span> for free!
                    </p>
                </div>
            </div>
        )

    return (
        <div className={classes.container}>
            <div className={classes.taskGroups}>
                {board.taskGroups.map(taskGroup => (
                    <div className="task" key={taskGroup._id}>
                        <div className="title">
                            <div>
                                <div className="taskGroup-title">
                                    <p>{taskGroup.name}</p>
                                </div>
                                <p className="task-amount">
                                    {taskGroup.tasks.length} TASKS
                                </p>
                            </div>
                            <div className="attributes">
                                {board.attributes.map((x, i) => (
                                    <div className="attribute" key={x._id}>
                                        <p>{x.name}</p>
                                    </div>
                                ))}
                                <div className="attribute">
                                    <p> </p>
                                </div>
                            </div>
                        </div>
                        <div className={classes.tasks}>
                            {taskGroup.tasks.map(task => (
                                <div className="Task" key={task._id}>
                                    <p>{task.name}</p>
                                    <div>
                                        {board.attributes.map(attribute => {
                                            if (attribute.type === 'status')
                                                return getStatusLabel(
                                                    attribute,
                                                    task
                                                )
                                            if (attribute.type === 'text')
                                                return getTextLabel(
                                                    attribute,
                                                    task
                                                )

                                            return (
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            'crimson'
                                                    }}
                                                    key={Math.random()}
                                                >
                                                    ERROR
                                                </div>
                                            )
                                        })}

                                        <div></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SharedBoard
