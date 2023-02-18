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
    const { data: board } = useFetchBoardQuery({ boardId })
    const { data: user } = useFetchUserQuery()
    const [name, changeName] = useInputState(task.name)
    const [anchor, setAnchor] = useState(null)
    const [addTaskComment] = useAddTaskCommentMutation()
    const [editTaskField] = useEditTaskFieldMutation()
    const [currentTab, setCurrentTab] = useState<string>('content')

    const handleClose = e => {
        if (e?.key && e.key !== 'Escape') return
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        navigate(
            `/${params.workspace}/${params.space}/${params.board}/${params.view}`
        )
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
        <div className="fixed z-[1300] inset-0">
            <div
                onClick={handleClose}
                className="z-[-1] fixed bg-[rgba(0,0,0,0.5)] inset-0"
            ></div>
            <div
                className={
                    'fixed flex flex-col w-full lg:w-[calc(100vw_-_50px)] h-full lg:h-[calc(100%_-_70px)] max-w-[1700px] z-[801] rounded-xl lg:left-[25px] lg:top-5 bg-white ' +
                    styles.taskModal
                }
            >
                <div className="flex justify-between pt-6 pb-2 px-8 border-b-[rgba(0,0,0,0.1)] border-b border-solid">
                    <p className="leading-8 m-0">{task._id}</p>
                    <div className="flex flex-row">
                        <div
                            className="cursor-pointer hover:bg-[#ecedf0] h-8 w-[60px] flex justify-center items-center rounded-[3px]"
                            onClick={e => setAnchor(e.currentTarget)}
                        >
                            <FontAwesomeIcon
                                className="text-[1.3em]"
                                icon={regular('eye')}
                            />
                            <span className="leading-8 ml-[5px]">
                                {task.watcher.length}
                            </span>
                        </div>
                        <div
                            className="ml-2 cursor-pointer hover:bg-[#ecedf0] group h-8 w-8 flex justify-center items-center rounded-[3px]"
                            onClick={handleClose}
                        >
                            <FontAwesomeIcon
                                className="group-hover:rotate-90 text-[1.5em] transition-transform duration-[0.2s]"
                                icon={solid('times')}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:hidden h-[60px] border-[#dedede] border-b flex justify-center items-center">
                    <div
                        onClick={() => setCurrentTab('content')}
                        className={`uppercase text-xs p-2 font-medium cursor-pointer border-b mx-1 ${
                            currentTab === 'content'
                                ? 'text-[#4169e1]'
                                : 'text-[#a5a9b0]'
                        }`}
                    >
                        Details
                    </div>
                    <div
                        onClick={() => setCurrentTab('activity')}
                        className={`uppercase text-xs p-2 font-medium cursor-pointer border-b mx-1 ${
                            currentTab === 'activity'
                                ? 'text-[#4169e1]'
                                : 'text-[#a5a9b0]'
                        }`}
                    >
                        Activity
                    </div>
                </div>
                <div className="h-0 grow shrink-0 basis-0 flex flex-col lg:flex-row">
                    <div
                        className={
                            styles.contentTab +
                            ` ${
                                currentTab === 'content'
                                    ? 'block'
                                    : 'hidden lg:block'
                            }`
                        }
                    >
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
                    <div className="hidden lg:block w-[1px] bg-[#e9ebf0]"></div>
                    <div
                        className={`w-full flex flex-col flex-[1_1_0] box-border max-h-full ${
                            currentTab === 'activity'
                                ? 'flex'
                                : 'hidden lg:flex'
                        }`}
                    >
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
