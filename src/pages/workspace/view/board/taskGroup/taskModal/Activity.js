import styles from '../../../../../../styles/TaskModal.module.scss'
import RelativeDate from '../../../../../../utils/RelativeDate'

function Activity({ timestamp, activity }) {
    return (
        <div className={styles.activity} key={timestamp}>
            <p>
                <span className="text-primary rounded px-1 py-[2px] hover:bg-[#f2f2f2]">
                    {activity.author}
                </span>
                {activity.change.type === 'creation' && (
                    <span>created this task</span>
                )}
            </p>
            <p className={styles.date}>
                <RelativeDate timestamp={timestamp} />
            </p>
        </div>
    )
}

export default Activity
