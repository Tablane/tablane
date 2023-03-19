import RelativeDate from '../../../../utils/RelativeDate'
import Editor from '../../../../utils/Editor.tsx'
import CommentReplySection from '../../view/board/taskGroup/taskModal/comment/CommentReplySection.tsx'
import { useState } from 'react'
import styles from '../../../../styles/Comment.module.scss'

export default function CommentChange({ boardId, taskId, change }) {
    const [replySectionOpen, setReplySectionOpen] = useState(false)
    const comment = change.referencedComment

    return (
        <div
            className="bg-[#fbfbfb] h-fit box-border min-h-[58px] flex justify-between items-center px-5 pt-[15px] rounded-md"
            key={change.timestamp}
        >
            <div className="w-full text-sm leading-[13px]">
                <div className="flex flex-row justify-between mb-4">
                    <div className="text-[13px]">
                        <span>{change.actor.username} </span>
                        <span className="text-[#abaeb0]">commented:</span>
                    </div>
                    <RelativeDate timestamp={comment.timestamp} />
                </div>
                <div className={styles.comment}>
                    <div className={styles.commentBody}>
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
                                    className={`text-[#7c828d] font-semibold px-[6px] py-1 rounded-[4px] cursor-pointer text-[11px] ${
                                        comment.replies.length >= 1
                                            ? 'bg-[#4169e1] text-white'
                                            : null
                                    }`}
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
                </div>
            </div>
        </div>
    )
}
