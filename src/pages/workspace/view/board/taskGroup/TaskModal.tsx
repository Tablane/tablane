import styles from '../../../../../styles/TaskModal.module.scss'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useInputState from '../../../../../modules/hooks/useInputState.tsx'
import WatcherPopover from './taskModal/WatcherPopover'
import {
    useAddTaskCommentMutation,
    useEditTaskFieldMutation
} from '../../../../../modules/services/boardSlice.ts'
import { useFetchUserQuery } from '../../../../../modules/services/userSlice'
import { useFetchBoardQuery } from '../../../../../modules/services/boardSlice.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Comment from './taskModal/Comment.tsx'
import Editor from '../../../../../utils/Editor.tsx'
import DescriptionEditor from '../../../../../utils/DescriptionEditor.tsx'
import Activity from './taskModal/Activity'
import { ObjectId } from '../../../../../utils'
import { Task } from '../../../../../types/Board'
import { Member } from '../../../../../types/Workspace'
import TaskModalColumns from './taskModal/TaskModalColumns.tsx'

interface Props {
    task: Task
    boardId: string
    hasPerms: (string) => boolean
    members: Member[]
}

function TaskModal({ task, boardId, hasPerms, members }: Props) {
    const navigate = useNavigate()
    const params = useParams()
    const { data: board } = useFetchBoardQuery(boardId)
    const { data: user } = useFetchUserQuery()
    const [name, changeName] = useInputState(task.name)
    const [anchor, setAnchor] = useState(null)
    const [addTaskComment] = useAddTaskCommentMutation()
    const [editTaskField] = useEditTaskFieldMutation()

    const handleClose = e => {
        if (e?.key && e.key !== 'Escape') return
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        navigate(`/${params.workspace}/${params.space}/${params.board}`)
    }

    useEffect(() => {
        document.addEventListener('keydown', handleClose, false)
        return () => {
            document.removeEventListener('keydown', handleClose, false)
        }
    }, [])

    const handleNameChange = (e?) => {
        e?.preventDefault()
        if (name === task.name) return

        editTaskField({
            type: 'name',
            value: name,
            boardId,
            taskId: task._id
        })
    }

    const handleAddComment = async editor => {
        if (editor.getJSON() === '') return

        await addTaskComment({
            _id: ObjectId(),
            boardId,
            content: editor.getJSON(),
            taskId: task._id,
            author: user.username
        }).unwrap()
        editor.commands.clearContent()
    }

    return (
        <div className={styles.root}>
            <div onClick={handleClose} className={styles.background}></div>
            <div className={styles.modal}>
                <div className={styles.topMenu}>
                    <p className={styles.taskId}>{task._id}</p>
                    <div className={styles.additionalMenu}>
                        <div
                            className={styles.watcher}
                            onClick={e => setAnchor(e.currentTarget)}
                        >
                            <FontAwesomeIcon icon={regular('eye')} />
                            <span>{task.watcher.length}</span>
                        </div>
                        <div className={styles.close} onClick={handleClose}>
                            <FontAwesomeIcon icon={solid('times')} />
                        </div>
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.contentTab}>
                        <form
                            onSubmit={handleNameChange}
                            className={styles.name}
                        >
                            <input
                                type="text"
                                value={name}
                                onChange={changeName}
                                onBlur={handleNameChange}
                            />
                        </form>
                        <div className={styles.description}>
                            <DescriptionEditor
                                taskId={task._id}
                                readOnly={false}
                            />
                        </div>
                        {board.attributes.length > 0 && (
                            <div className="px-[30px] py-[10px]">
                                <div className="border rounded flex flex-col">
                                    <div className="flex flex-col justify-between gap-px">
                                        <TaskModalColumns
                                            attributes={board.attributes}
                                            task={task}
                                            members={members}
                                            boardId={boardId}
                                            hasPerms={hasPerms}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.attributeTab}>
                        <div className={styles.historyLog}>
                            {[...task.history, ...task.comments]
                                .sort(
                                    (
                                        { timestamp: a }: any,
                                        { timestamp: b }: any
                                    ) => b - a
                                )
                                .map(log => {
                                    if (log.type === 'activity') {
                                        return (
                                            <Activity
                                                boardId={boardId}
                                                key={log.timestamp}
                                                timestamp={log.timestamp}
                                                activity={log}
                                            />
                                        )
                                    } else if (log.type === 'comment') {
                                        return (
                                            <Comment
                                                boardId={boardId}
                                                taskId={task._id}
                                                key={log.timestamp}
                                                comment={log}
                                                saveComment={handleAddComment}
                                            />
                                        )
                                    }

                                    return null
                                })}
                        </div>
                        <div className={styles.commentingBar}>
                            <Editor
                                type="comment"
                                saveComment={handleAddComment}
                                readOnly={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <WatcherPopover
                task={task}
                anchor={anchor}
                setAnchor={setAnchor}
                boardId={boardId}
            />
        </div>
    )
}

export default TaskModal
