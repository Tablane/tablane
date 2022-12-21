import styles from '../../../../../../../../styles/TaskModal.module.scss'
import Editor from '../../../../../../../../utils/Editor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import CommentPopover from '../CommentPopover'
import { useState } from 'react'
import { useEditReplyMutation } from '../../../../../../../../modules/services/boardSlice'
import RelativeDate from '../../../../../../../../utils/RelativeDate'

function Reply({ commentId, reply, taskId, boardId }) {
    const [editing, setEditing] = useState(false)
    const [editReply] = useEditReplyMutation()

    const handleSave = editor => {
        editReply({
            boardId,
            taskId,
            commentId,
            replyId: reply._id,
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
                <div>{reply.author.username.substring(0, 2).toUpperCase()}</div>
            </div>
            <div className={styles.commentBody}>
                {editing ? (
                    <div>
                        <Editor
                            saveComment={handleSave}
                            cancelEditing={handleEditingCancel}
                            type="comment-edit"
                            content={reply.content}
                        />
                    </div>
                ) : (
                    <div>
                        <div className={styles.commentHeader}>
                            <p>
                                <span className={styles.authorSpan}>
                                    {reply.author.username}
                                </span>
                                <span> commented</span>
                            </p>
                            <p className={styles.date}>
                                <RelativeDate timestamp={reply.timestamp} />
                            </p>
                            <div className={styles.actions}>
                                <div onClick={handleEditingClick}>
                                    <FontAwesomeIcon icon={solid('pen')} />
                                    <span>Edit</span>
                                </div>
                                <CommentPopover
                                    boardId={boardId}
                                    type="reply"
                                    taskId={taskId}
                                    commentId={commentId}
                                    replyId={reply._id}
                                />
                            </div>
                        </div>
                        <div>
                            <Editor
                                type="comment"
                                readOnly={true}
                                content={reply.content}
                            />
                        </div>
                        <div className={styles.commentFooter}>
                            <div className={styles.like}>{/*Like*/}</div>
                            <div className={styles.reply}>{/*Reply*/}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Reply
