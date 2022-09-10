import styles from '../../styles/Home.module.scss'
import { useSelector } from 'react-redux'

function Home(props) {
    const { workspace } = useSelector(state => state.workspace)
    const { user } = useSelector(state => state.user)

    const tasks = user.assignedTasks.filter(
        x => x.workspace._id === workspace._id
    )

    return (
        <div className={styles.container}>
            <div className={styles.topMenu}>
                {!props.sidebarOpen && (
                    <i
                        onClick={props.toggleSideBar}
                        className="fas fa-angle-double-right"
                    />
                )}
                <div>Home</div>
            </div>
            <div className={styles.panel}>
                <p className={styles.myWork}>My Work</p>
                <div className={styles.taskList}>
                    {tasks.map(task => (
                        <div key={task._id} className={styles.task}>
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
