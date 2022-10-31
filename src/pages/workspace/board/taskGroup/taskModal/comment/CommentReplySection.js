import Editor from '../../../../../../utils/Editor'
import { useAddReplyMutation } from '../../../../../../modules/services/boardSlice'
import Reply from './commentReplySection/Reply'

function CommentReplySection({ taskId, commentId, replies }) {
    const [addReply] = useAddReplyMutation()

    const handleAddComment = editor => {
        addReply({
            taskId,
            commentId,
            content: editor.getJSON()
        })
        editor.commands.clearContent()
    }

    return (
        <div className="border-neutral-200 border-t border-solid">
            <div className="px-4 pt-7 pb-2">
                {replies.map(reply => {
                    return (
                        <Reply
                            commentId={commentId}
                            reply={reply}
                            key={reply._id}
                            taskId={taskId}
                        />
                    )
                })}
            </div>
            <div className="overlapShadow relative">
                <Editor type="comment" saveComment={handleAddComment} />
            </div>
        </div>
    )
}

export default CommentReplySection
