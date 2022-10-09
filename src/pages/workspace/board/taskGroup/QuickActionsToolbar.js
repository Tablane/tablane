import styles from '../../../../styles/QuickActionsToolBar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useSortTaskMutation } from '../../../../modules/services/boardSlice'

function QuickActionsToolbar({
    handleTaskEdit,
    board,
    groupedTasks,
    taskGroupId,
    task
}) {
    const [sortTask] = useSortTaskMutation()

    const handleEditClick = e => {
        e.stopPropagation()
        handleTaskEdit(e)
    }

    const handleMoveTopClick = e => {
        e.stopPropagation()
        const taskGroup = groupedTasks
            ? groupedTasks.find(x => x._id === taskGroupId)
            : board.tasks
        const result = {
            destination: { droppableId: taskGroup._id },
            draggableId: task._id
        }
        const destinationIndex = taskGroup
        const sourceIndex = board.tasks.findIndex(
            x => x._id.toString() === task._id
        )
        sortTask({
            result,
            destinationIndex,
            sourceIndex,
            boardId: board._id
        })
    }

    const handleMoveBottomClick = e => {
        e.stopPropagation()
        const taskGroup = groupedTasks.find(x => x._id === taskGroupId)
        const result = {
            destination: { droppableId: taskGroup._id },
            draggableId: task._id
        }
        const destinationIndex = -1
        const sourceIndex = board.tasks.findIndex(
            x => x._id.toString() === task._id
        )
        sortTask({
            result,
            destinationIndex,
            sourceIndex,
            boardId: board._id
        })
    }

    return (
        <div className={styles.quickActionsToolbar}>
            <div className="quickActionItem" onClick={handleEditClick}>
                <FontAwesomeIcon icon={solid('pen')} />
            </div>
            <div className="quickActionItem" onClick={handleMoveTopClick}>
                <FontAwesomeIcon icon={solid('arrow-up')} />
            </div>
            <div className="quickActionItem" onClick={handleMoveBottomClick}>
                <FontAwesomeIcon icon={solid('arrow-down')} />
            </div>
        </div>
    )
}

export default QuickActionsToolbar
