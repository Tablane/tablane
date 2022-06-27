import styles from '../../../../styles/TaskModal.module.scss'
import {useHistory} from "react-router-dom";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {toast} from "react-hot-toast";
import useInputState from "../../../../modules/hooks/useInputState";
import { addTaskComment, editTaskField } from "../../../../modules/state/reducers/boardReducer";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

function TaskModal(props) {
    const history = useHistory()
    const params = useParams()
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { task, taskGroupId, boardId } = props
    const [name, changeName] = useInputState(task.name)
    const [description, changeDescription] = useInputState(task.description)
    const [newComment, changeNewComment, resetNewComment] = useInputState('')

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
            taskId: task._id
        }))
    }

    const handleAddComment = e => {
        e?.preventDefault()
        if (newComment === '') return
        resetNewComment()

        dispatch(addTaskComment({
            text: newComment,
            taskId: task._id,
            author: user.username
        }))
    }

    const getTime = (timestamp) => {
        if (moment().diff(timestamp, 'days') > 7 || moment().diff(timestamp, 'days') < -7) {
            return moment(timestamp).zone(4).format('MMMM D, YYYY')
        } else return moment(timestamp).startOf("minute").fromNow()
    }

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
                            <textarea placeholder="Description" value={description} onChange={changeDescription} onBlur={handleDescriptionChange}/>
                        </form>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.attributeTab}>
                        <div className={styles.historyLog}>
                            {task.history.map(log => {
                                if (log.type === 'activity') {
                                    return (
                                        <div className={styles.activity} key={log.timestamp}>
                                            <p><span className={styles.authorSpan}>{log.author}</span> {log.text}</p>
                                            <p className={styles.date}>{getTime(log.timestamp)}</p>
                                        </div>
                                    )
                                } else if (log.type === 'comment') {
                                    return (
                                        <div className={styles.comment} key={log.timestamp}>
                                            <div className={styles.author}>
                                                <div>{log.author.substring(0, 2).toUpperCase()}</div>
                                            </div>
                                            <div className={styles.commentBody}>
                                                <div className={styles.commentHeader}>
                                                    <p><span className={styles.authorSpan}>{log.author}</span> commented</p>
                                                    <p className={styles.date}>{getTime(log.timestamp)}</p>
                                                </div>
                                                <p>{log.text}</p>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>
                        <div className={styles.commentingBar}>
                            <form onSubmit={handleAddComment}>
                                <input type="text" onChange={changeNewComment} value={newComment} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal