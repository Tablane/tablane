import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import styles from '../styles/SharedBoard.module.scss'

function SharedBoard(props) {
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
            <div className={styles.loading}>
                <CircularProgress />
            </div>
        )
    if (board === false)
        return (
            <div className={styles.forbidden}>
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
        <div className={styles.container}>
            <div className={styles.taskGroups}>
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
                        <div className={styles.tasks}>
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
