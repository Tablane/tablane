import styles from '../../../../../styles/QuickActionsToolBar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useSortTaskMutation } from '../../../../../modules/services/boardSlice'
import { Tooltip } from '@mui/material'

function QuickActionsToolbar({
    handleTaskEdit,
    board,
    groupedTasks,
    taskGroupId,
    task,
    setNewTaskOpen,
    level
}) {
    const [sortTask] = useSortTaskMutation()

    const handleEditClick = e => {
        e.stopPropagation()
        handleTaskEdit(e)
    }

    const handleSubtaskClick = e => {
        e.stopPropagation()
        setNewTaskOpen(true)
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
        const taskGroup = groupedTasks
            ? groupedTasks.find(x => x._id === taskGroupId)
            : board.tasks
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
            {level <= 7 && (
                <Tooltip title="Create subtask">
                    <div
                        className="quickActionItem text-[#7c828d]"
                        onClick={handleSubtaskClick}
                    >
                        <FontAwesomeIcon icon={solid('code-branch')} />
                    </div>
                </Tooltip>
            )}
            <Tooltip title="Rename">
                <div
                    className="quickActionItem text-[#7c828d]"
                    onClick={handleEditClick}
                >
                    <FontAwesomeIcon icon={solid('pen')} />
                </div>
            </Tooltip>
            <Tooltip title="Move up">
                <div
                    className="quickActionItem text-[#7c828d]"
                    onClick={handleMoveTopClick}
                >
                    <FontAwesomeIcon icon={solid('arrow-up')} />
                </div>
            </Tooltip>
            <Tooltip title="Move down">
                <div
                    className="quickActionItem text-[#7c828d]"
                    onClick={handleMoveBottomClick}
                >
                    <FontAwesomeIcon icon={solid('arrow-down')} />
                </div>
            </Tooltip>
        </div>
    )
}

export default QuickActionsToolbar
