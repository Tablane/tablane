import styles from '../../../../../../styles/TaskModal.module.scss'
import RelativeDate from '../../../../../../utils/RelativeDate'
import { diffWords } from 'diff'
import { useFetchBoardQuery } from '../../../../../../modules/services/boardSlice'

function Activity({ timestamp, activity, boardId }) {
    const { data: board } = useFetchBoardQuery(boardId)

    const getDiff = () => {
        const groups = diffWords(activity.change.from, activity.change.to)
        const mappedNodes = groups.map(({ value, added, removed }, i) => {
            if (added)
                return (
                    <span key={i} className="font-medium">
                        {value}
                    </span>
                )
            else if (removed)
                return (
                    <span key={i} className="line-through opacity-50">
                        {value}
                    </span>
                )
            else
                return (
                    <span key={i} className="">
                        {value}
                    </span>
                )
        })
        return <span>{mappedNodes}</span>
    }

    const getStatusField = field => {
        const from = field.labels.find(x => x._id === activity.change.from)
        const to = field.labels.find(x => x._id === activity.change.to)

        return (
            <>
                <span>changed {field.name} from</span>
                {from ? (
                    <>
                        <span
                            style={{ background: from.color }}
                            className="rounded-md items-center justify-center h-5 min-w-0 py-0 px-2 text-white mx-1"
                        >
                            {from.name}
                        </span>
                    </>
                ) : (
                    <span className="rounded-md items-center justify-center h-5 min-w-0 py-0 px-1 mx-1">
                        -
                    </span>
                )}
                <span>to</span>
                {to ? (
                    <>
                        <span
                            style={{ background: to.color }}
                            className="rounded-md items-center justify-center h-5 min-w-0 py-0 px-2 text-white mx-1"
                        >
                            {to.name}
                        </span>
                    </>
                ) : (
                    <span className="rounded-md items-center justify-center h-5 min-w-0 py-0 px-1 mx-1">
                        -
                    </span>
                )}
            </>
        )
    }

    const getField = () => {
        const field = board.attributes.find(
            x => x._id === activity.change.field
        )

        if (field.type === 'status') return getStatusField(field)
    }

    return (
        <div className={styles.activity}>
            <div>
                <span className="text-primary rounded px-1 py-[2px] hover:bg-[#f2f2f2]">
                    {activity.author.username}
                </span>
                {activity.change.type === 'creation' && (
                    <span key={timestamp}>created this task</span>
                )}
                {activity.change.type === 'name' && (
                    <>
                        <span>changed name: </span>
                        <span className="text-[#2a2e34]">{getDiff()}</span>
                    </>
                )}
                {activity.change.type === 'add_watcher' && (
                    <>
                        <span>added watcher: </span>
                        <span className="text-primary rounded px-1 py-[2px] hover:bg-[#f2f2f2]">
                            {activity.referencedUser}
                        </span>
                    </>
                )}
                {activity.change.type === 'remove_watcher' && (
                    <>
                        <span>removed watcher: </span>
                        <span className="text-primary rounded px-1 py-[2px] hover:bg-[#f2f2f2]">
                            {activity.referencedUser}
                        </span>
                    </>
                )}
                {activity.change.type === 'attribute' && getField()}
            </div>
            <p className={styles.date}>
                <RelativeDate timestamp={timestamp} />
            </p>
        </div>
    )
}

export default Activity
