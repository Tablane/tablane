import styles from '../../../../../../../styles/TaskModal.module.scss'
import Editor from '../../../../../../../utils/Editor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import CommentPopover from '../CommentPopover'
import { useState } from 'react'

function Reply({ commentId, reply, taskId }) {
    const [editing, setEditing] = useState(false)

    const handleSave = () => {
        console.log('save reply edit')
    }

    const getTime = x => x

    return (
        <div className={styles.comment}>
            <div className={styles.author}>
                <div>{reply.author.substring(0, 2).toUpperCase()}</div>
            </div>
            <div className={styles.commentBody}>
                {editing ? (
                    <div>
                        <Editor
                            saveComment={handleSave}
                            cancelEditing={() => setEditing(false)}
                            type="comment-edit"
                            content={reply.content}
                        />
                    </div>
                ) : (
                    <div>
                        <div className={styles.commentHeader}>
                            <p>
                                <span className={styles.authorSpan}>
                                    {reply.author}
                                </span>
                                <span> commented</span>
                            </p>
                            <p className={styles.date}>
                                {getTime(reply.timestamp)}
                            </p>
                            <div className={styles.actions}>
                                <div onClick={() => setEditing(true)}>
                                    <FontAwesomeIcon icon={solid('pen')} />
                                    <span>Edit</span>
                                </div>
                                <CommentPopover
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
                            <div className={styles.like}>Like</div>
                            <div className={styles.reply}>Reply</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Reply
