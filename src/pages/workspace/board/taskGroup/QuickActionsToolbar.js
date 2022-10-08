import styles from '../../../../styles/QuickActionsToolBar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function QuickActionsToolbar({ handleTaskEdit }) {
    const handleEditClick = e => {
        e.stopPropagation()
        handleTaskEdit(e)
    }

    return (
        <div className={styles.quickActionsToolbar}>
            <div className="quickActionItem" onClick={handleEditClick}>
                <FontAwesomeIcon icon={solid('pen')} />
            </div>
        </div>
    )
}

export default QuickActionsToolbar
