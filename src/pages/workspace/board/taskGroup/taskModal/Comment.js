import styles from '../../../../../styles/TaskModal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useState } from 'react'
import Editor from '../../../../../utils/Editor'
import { Button } from '@mantine/core'

function Comment({ comment }) {
    const [editing, setEditing] = useState(false)

    const getTime = x => x

    const handleSave = () => {
        setEditing(false)
    }

    return (
        <div className={styles.comment}>
            <div className={styles.author}>
                <div>{comment.author.substring(0, 2).toUpperCase()}</div>
            </div>
            <div className={styles.commentBody}>
                {editing ? (
                    <>
                        <div>
                            <Editor
                                type="comment-edit"
                                content={comment.text}
                            />
                        </div>
                        <div className={styles.commentEditingButtons}>
                            <Button
                                size="xs"
                                variant="outline"
                                color="gray"
                                uppercase
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="xs"
                                color="indigo"
                                uppercase
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </div>
                    </>
                ) : (
                    <div>
                        <div className={styles.commentHeader}>
                            <p>
                                <span className={styles.authorSpan}>
                                    {comment.author}
                                </span>
                                <span> commented</span>
                            </p>
                            <p className={styles.date}>
                                {getTime(comment.timestamp)}
                            </p>
                            <div className={styles.actions}>
                                <div onClick={() => setEditing(true)}>
                                    <FontAwesomeIcon icon={solid('pen')} />
                                    <span>Edit</span>
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={solid('ellipsis')} />
                                </div>
                            </div>
                        </div>
                        <Editor
                            type="comment"
                            readOnly={true}
                            content={comment.text}
                        />
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

export default Comment
