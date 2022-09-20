import styles from '../../styles/Home.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchUserQuery } from '../../modules/services/userSlice'
import { useFetchWorkspaceQuery } from '../../modules/services/workspaceSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'

function Home(props) {
    const params = useParams()
    const { data: user } = useFetchUserQuery()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const navigate = useNavigate()

    const tasks = user.assignedTasks.filter(
        x => x.workspace._id === workspace._id
    )

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
                        <div
                            key={task._id}
                            className={styles.task}
                            onClick={() =>
                                navigate(
                                    `/${workspace.id}/${task.board.space.name}/${task.board.name}/${task._id}`
                                )
                            }
                        >
                            <div>
                                <span>{task.name}</span>
                            </div>
                            <div></div>
                        </div>
                    ))}
                    {tasks.length <= 0 && <span>No assigned tasks</span>}
                </div>
            </div>
        </div>
    )
}

export default Home
