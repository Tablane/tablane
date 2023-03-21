import Editor from '../../../../utils/Editor.tsx'
import RelativeDate from '../../../../utils/RelativeDate'

export default function ReplyNotification({ actor, change }) {
    const comment = change.referencedComment
    const thread = change.referencedComment.thread

    return (
        <div
            className="bg-[#fbfbfb] h-fit box-border min-h-[58px] flex justify-between items-center px-5 pt-[15px] rounded-md"
            key={change.timestamp}
        >
            <div className="w-full text-sm leading-[13px]">
                <div className="flex flex-row justify-between mb-5">
                    <div className="bg-white grow flex flex-col rounded-[10px] border border-solid border-[#dedede]">
                        <div className="flex justify-start items-center h-10 px-4 py-0 border-t-[#e9ebf0] border-b border-solid">
                            <div className="text-[13px]">
                                <span className="text-[#abaeb0]">
                                    Replied to thread:
                                </span>
                            </div>
                            <div className="flex-1 w-0">
                                <Editor
                                    singleLine={true}
                                    type="comment"
                                    readOnly={true}
                                    content={thread.content}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between m-[20px]">
                            <div className="mt-[10px] shrink-0 w-[42px]">
                                <div className="bg-[rgb(65,105,225)] w-[30px] h-[30px] flex justify-center items-center text-[11px] text-[white] rounded-[50px]">
                                    {actor.username
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </div>
                            </div>
                            <div className="bg-[white] grow flex flex-col border rounded-[10px] border-solid border-[#dedede]">
                                <div>
                                    <div className="text-[#abaeb0] flex justify-between flex-row pt-2.5 pb-0 px-4">
                                        <p className="text-[13px]">
                                            <span className="text-[rgb(65,105,225)]">
                                                {actor.username}
                                            </span>
                                            <span> commented</span>
                                        </p>
                                        <p className="flex">
                                            <RelativeDate
                                                timestamp={comment.timestamp}
                                            />
                                        </p>
                                    </div>
                                    <div>
                                        <Editor
                                            type="comment"
                                            readOnly={true}
                                            content={comment.content}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
