import Editor from '../../../../../../../utils/Editor.tsx'
import { useAddReplyMutation } from '../../../../../../../modules/services/boardSlice.ts'
import Reply from './commentReplySection/Reply.tsx'
import { useFetchUserQuery } from '../../../../../../../modules/services/userSlice'
import { ObjectId } from '../../../../../../../utils'
import { ReplyType } from '../../../../../../../types/Board'

interface Props {
    taskId: string
    commentId: string
    replies: ReplyType
    boardId: string
}

function CommentReplySection({ taskId, commentId, replies, boardId }: Props) {
    const { data: user } = useFetchUserQuery()
    const [addReply] = useAddReplyMutation()

    const handleAddReply = editor => {
        addReply({
            _id: ObjectId(),
            boardId,
            taskId,
            author: user.username,
            commentId,
            content: editor.getJSON()
        })
        editor.commands.clearContent()
    }

    return (
        <div className="border-neutral-200 border-t border-solid">
            <div className="px-4 pt-7 pb-2">
                {replies.map(reply => (
                    <Reply
                        boardId={boardId}
                        commentId={commentId}
                        reply={reply}
                        key={reply._id}
                        taskId={taskId}
                    />
                ))}
            </div>
            <div className="overlapShadow relative">
                <Editor type="comment" saveComment={handleAddReply} />
            </div>
        </div>
    )
}

export default CommentReplySection
