import styles from '../../../../../styles/TaskModal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function Comment({ comment }) {
    const getTime = x => x

    return (
        <div className={styles.comment}>
            <div className={styles.author}>
                <div>{comment.author.substring(0, 2).toUpperCase()}</div>
            </div>
            <div className={styles.commentBody}>
                <div className={styles.commentHeader}>
                    <p>
                        <span className={styles.authorSpan}>
                            {comment.author}
                        </span>
                        <span> commented</span>
                    </p>
                    <p className={styles.date}>{getTime(comment.timestamp)}</p>
                    <div className={styles.actions}>
                        <div>
                            <FontAwesomeIcon icon={solid('pen')} />
                            <span>Edit</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={solid('ellipsis')} />
                        </div>
                    </div>
                </div>
                <div className={styles.commentContent}>{comment.text}</div>
                <div className={styles.commentFooter}>
                    <div className={styles.like}>Like</div>
                    <div className={styles.reply}>Reply</div>
                </div>
            </div>
        </div>
    )
}

export default Comment
