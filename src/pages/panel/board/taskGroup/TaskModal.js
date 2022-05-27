import styles from '../../../../styles/TaskModal.module.scss'
import {useHistory} from "react-router-dom";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {toast} from "react-hot-toast";
import useInputState from "../../../../modules/hooks/useInputState";
import {editTaskField} from "../../../../modules/state/reducers/boardReducer";
import {useDispatch} from "react-redux";
import moment from "moment";

function TaskModal(props) {
    const history = useHistory()
    const params = useParams()
    const dispatch = useDispatch()
    const { task, taskGroupId, boardId } = props
    const [name, changeName] = useInputState(task.name)
    const [description, changeDescription] = useInputState(task.description)

    const handleClose = e => {
        if (e?.key && e.key !== 'Escape') return
        handleDescriptionChange()
        handleNameChange()
        history.push(`/${params.workspace}/${params.space}/${params.board}`)
    }

    useEffect(() => {
        document.addEventListener("keydown", handleClose, false);
        return () => {
            document.removeEventListener("keydown", handleClose, false);
        };
    })

    const handleNameChange = e => {
        e?.preventDefault()
        if (name === task.name) return

        dispatch(editTaskField({
            type: 'name',
            value: name,
            boardId,
            taskGroupId,
            taskId: task._id
        }))
    }

    const handleDescriptionChange = e => {
        e?.preventDefault()
        if (description === task.description) return

        dispatch(editTaskField({
            type: 'description',
            value: description,
            boardId,
            taskGroupId,
            taskId: task._id
        }))
    }

    const getTime = (timestamp) => {
        if (moment().diff(timestamp, 'days') > 7 || moment().diff(timestamp, 'days') < -7) {
            return moment(timestamp).zone(4).format('MMMM D, YYYY')
        } else return moment(timestamp).startOf("minute").fromNow()
    }

    const taskHistory = [
        {type: 'activity', timestamp: 1653635899000, text: 'You created this task'},
        {type: 'activity', timestamp: 1653634899000, text: 'You changed status from Backlog to In Progress'},
        {type: 'activity', timestamp: 1653638899000, text: 'You removed watcher: You'},
        {type: 'activity', timestamp: 1653632899000, text: 'You changed the name from "This is awesome" to "This is awesome, because it\'s workingssss"'},
        {type: 'comment', author: 'You', timestamp: 1653614899000, text: 'I have updated the content so that it will work no matter what you do.'},
        {type: 'comment', author: 'You', timestamp: 1653033288000, text: 'I have updated the content so that it will work no matter what you do.'}
    ]

    return (
        <div className={styles.root}>
            <div onClick={handleClose} className={styles.background}></div>
            <div className={styles.modal}>
                <div className={styles.topMenu}>
                    <p className={styles.taskId}>{task._id}</p>
                    <div className={styles.additionalMenu}>
                        <div className={styles.watcher} onClick={() => toast('Coming Soon')}>
                            <i className="far fa-eye"></i>
                            <span>5</span>
                        </div>
                        <div className={styles.close} onClick={handleClose}>
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.contentTab}>
                        <form onSubmit={handleNameChange} className={styles.name}>
                            <input type="text" value={name} onChange={changeName} onBlur={handleNameChange}/>
                        </form>
                        <form onSubmit={handleDescriptionChange} className={styles.description}>
                            <textarea value={description} onChange={changeDescription} onBlur={handleDescriptionChange}/>
                        </form>
                        <div className={styles.historyLog}>
                            {taskHistory.map(log => {
                                if (log.type === 'activity') {
                                    return (
                                        <div className={styles.activity}>
                                            <p>{log.text}</p>
                                            <p className={styles.date}>{getTime(log.timestamp)}</p>
                                        </div>
                                    )
                                } else if (log.type === 'comment') {
                                    return (
                                        <div className={styles.comment}>
                                            <div className={styles.author}>ME</div>
                                            <div className={styles.commentBody}>
                                                <div className={styles.commentHeader}>
                                                    <p>{log.author} commented</p>
                                                    <p className={styles.date}>{getTime(log.timestamp)}</p>
                                                </div>
                                                <div>{log.text}</div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })}
                            <div className={styles.commentingBar}>

                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeTab}>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal