import Editor from '../../../../../../utils/Editor'
import { useAddReplyMutation } from '../../../../../../modules/services/boardSlice'
import Reply from './commentReplySection/Reply'

function CommentReplySection({ taskId, commentId, replies }) {
    const [addReply] = useAddReplyMutation()

    const handleAddComment = editor => {
        console.log('add reply to comment')
        addReply({
            taskId,
            commentId,
            content: editor.getJSON()
        })
    }

    return (
        <div className="border-neutral-200 border-t border-solid">
            <div className="px-4 py-8">
                {replies.map(reply => {
                    return (
                        <Reply reply={reply} key={reply._id} taskId={taskId} />
                    )
                })}
            </div>
            <Editor type="comment" saveComment={handleAddComment} />
        </div>
    )
}

export default CommentReplySection
