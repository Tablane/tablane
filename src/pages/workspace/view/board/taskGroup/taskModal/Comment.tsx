import styles from '../../../../../../styles/TaskModal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useState } from 'react'
import CommentPopover from './comment/CommentPopover'
import { useEditTaskCommentMutation } from '../../../../../../modules/services/boardSlice.ts'
import Editor from '../../../../../../utils/Editor.tsx'
import CommentReplySection from './comment/CommentReplySection.tsx'
import RelativeDate from '../../../../../../utils/RelativeDate'
import { Comment as CommentType } from '../../../../../../types/Board'

interface Props {
    comment: CommentType
    taskId: string
    boardId: string
}
function Comment({ comment, taskId, boardId }: Props) {
    const [editing, setEditing] = useState(false)
    const [replySectionOpen, setReplySectionOpen] = useState(false)
    const [editTaskComment] = useEditTaskCommentMutation()

    const handleSave = editor => {
        editTaskComment({
            boardId,
            taskId,
            commentId: comment._id,
            content: editor.getJSON()
        })
        setEditing(false)
    }

    const handleEditingClick = () => {
        setEditing(true)
    }

    const handleEditingCancel = () => {
        setEditing(false)
    }

    return (
        <div className={styles.comment}>
            <div className={styles.author}>
                <div>
                    {comment.author.username.substring(0, 2).toUpperCase()}
                </div>
            </div>
            <div className={styles.commentBody}>
                {editing ? (
                    <div>
                        <Editor
                            saveComment={handleSave}
                            cancelEditing={handleEditingCancel}
                            type="comment-edit"
                            content={comment.content}
                        />
                    </div>
                ) : (
                    <div>
                        <div className={styles.commentHeader}>
                            <p>
                                <span className={styles.authorSpan}>
                                    {comment.author.username}
                                </span>
                                <span> commented</span>
                            </p>
                            <p className={styles.date}>
                                <RelativeDate timestamp={comment.timestamp} />
                            </p>
                            <div className={styles.actions}>
                                <div onClick={handleEditingClick}>
                                    <FontAwesomeIcon icon={solid('pen')} />
                                    <span>Edit</span>
                                </div>
                                <CommentPopover
                                    boardId={boardId}
                                    type="comment"
                                    taskId={taskId}
                                    commentId={comment._id}
                                />
                            </div>
                        </div>
                        <div>
                            <Editor
                                type="comment"
                                readOnly={true}
                                content={comment.content}
                            />
                        </div>
                        {replySectionOpen ? (
                            <>
                                <CommentReplySection
                                    boardId={boardId}
                                    replies={comment.replies}
                                    taskId={taskId}
                                    commentId={comment._id}
                                />
                                <div className="h-10 border-solid border-t flex items-center justify-center py-0 px-4 border-gray-200">
                                    <div
                                        className="cursor-pointer font-medium text-gray-500 text-xs"
                                        onClick={() =>
                                            setReplySectionOpen(false)
                                        }
                                    >
                                        Collapse
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.commentFooter}>
                                <div className={styles.like}>{/*Like*/}</div>
                                <div
                                    className={styles.reply}
                                    onClick={() => setReplySectionOpen(true)}
                                >
                                    {comment.replies.length === 0 && 'Reply'}
                                    {comment.replies.length === 1 && `1 Reply`}
                                    {comment.replies.length > 1 &&
                                        `${comment.replies.length} Replies`}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment
