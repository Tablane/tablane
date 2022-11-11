import styles from '../../../../../../styles/TaskModal.module.scss'
import RelativeDate from '../../../../../../utils/RelativeDate'
import { diffWords } from 'diff'

function Activity({ timestamp, activity }) {
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

    return (
        <div className={styles.activity}>
            <p>
                <span className="text-primary rounded px-1 py-[2px] hover:bg-[#f2f2f2]">
                    {activity.author}
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
            </p>
            <p className={styles.date}>
                <RelativeDate timestamp={timestamp} />
            </p>
        </div>
    )
}

export default Activity
