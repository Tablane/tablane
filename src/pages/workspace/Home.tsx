import styles from '../../styles/Home.module.scss'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CircularProgress } from '@mui/material'
import ErrorPage from '../../utils/ErrorPage'
import { useFetchWorkspaceQuery } from '../../modules/services/workspaceSlice'
import { useFetchUserQuery } from '../../modules/services/userSlice'

function Home(props) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: user } = useFetchUserQuery()

    const {
        isLoading,
        error,
        data: tasks
    } = useQuery(['assignedTasks'], () =>
        fetch(
            `${process.env.REACT_APP_BACKEND_HOST}/api/task/getAssignedTasks/${workspace._id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem(
                        'access_token'
                    )}`
                },
                body: JSON.stringify({
                    filter: { 'options.value': user._id }
                })
            }
        ).then(res => res.json())
    )

    if (isLoading)
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    if (error) return <ErrorPage error={error} />
    return (
        <div className={styles.container}>
            <div className={styles.topMenu}>
                {!props.sidebarOpen && (
                    <FontAwesomeIcon
                        icon={solid('angle-double-right')}
                        onClick={props.toggleSideBar}
                    />
                )}
                <div>Home</div>
            </div>
            <div className={styles.panel}>
                <p className={styles.myWork}>My Work</p>
                <div className={styles.taskList}>
                    {tasks.map(task => (
                        <Link
                            key={task._id}
                            className={styles.task}
                            to={`/${
                                task.workspace.id
                            }/${task.board.space.name.replaceAll(
                                ' ',
                                '-'
                            )}/${task.board.name.replaceAll(' ', '-')}/${
                                task._id
                            }`}
                        >
                            <div>
                                <span>{task.name}</span>
                            </div>
                            <div></div>
                        </Link>
                    ))}
                    {tasks.length <= 0 && <span>No assigned tasks</span>}
                </div>
            </div>
        </div>
    )
}

export default Home
