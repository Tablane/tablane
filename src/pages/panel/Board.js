import {useCallback, useEffect} from 'react'
import '../../styles/Board.css'
import TaskGroup from './board/TaskGroup'
import {DragDropContext} from "react-beautiful-dnd";
import {LinearProgress} from "@material-ui/core";
import useToggleState from "../../modules/hooks/useToggleState";
import {useDispatch, useSelector} from "react-redux";
import { fetchBoard, sortAttribute, sortTask } from "../../modules/state/reducers/boardReducer";
import _ from "lodash";

function Board(props) {
    const { workspace } = useSelector(state => state.workspace)
    const { board, loading } = useSelector(state => state.board)
    const dispatch = useDispatch()

    const [newTaskGroupShown, toggleNewTaskGroupShown] = useToggleState(false)

    const findBoardId = useCallback(() => {
        const space = props.match.params.space.replaceAll('-', ' ')
        const board = props.match.params.board.replaceAll('-', ' ')
        return workspace?.spaces.find(x => x.name === space).boards.find(x => x.name === board)._id
    }, [props.match.params.space, props.match.params.board, workspace?.spaces, workspace])
    const boardId = findBoardId()

    const onDragStart = () => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'pointer'
    }

    const handleDragEnd = async (result) => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'auto'
        if (result.destination === null ||
            (result.destination.index === result.source.index
                && result.destination.droppableId === result.source.droppableId)) return
        if (result.type === "task") {
            dispatch(sortTask({ result }))
        } else if (/^attribute /gm.test(result.type)) {
            dispatch(sortAttribute({ result }))
        }
    }

    useEffect(() => {
        if (!boardId) return
        dispatch(fetchBoard(boardId))
    }, [boardId])

    const groupTasks = () => {
        if (!board.groupBy || board.groupBy === 'none') {
            return (
                <TaskGroup
                    name="Empty"
                    taskGroupId={"empty"}
                    tasks={board.tasks}
                />
            )
        }

        const labels = _.cloneDeep(board.attributes.find(attribute => attribute._id === board.groupBy).labels)

        labels.push({
            name: "Empty",
            color: "rgb(255, 255, 255)",
            _id: "empty",
        })
        labels.map(label => label.tasks = [])

        board.tasks.map(task => {
            const value = task.options.find(option => option.column === board.groupBy)?.value
            const label = labels.find(label => label._id === value)
            if (value && label) label.tasks.push(task)
            else labels.find(label => label._id === 'empty').tasks.push(task)
        })

        return labels.map(label => (
            <TaskGroup
                color={label.color}
                key={label._id}
                name={label.name}
                taskGroupId={label._id}
                tasks={label.tasks}
            />
        ))
    }

    return (
        <div>
            {loading > 0 ? <LinearProgress/> : <div className="loading-placeholder"></div>}
            {board && (
                <DragDropContext onDragEnd={handleDragEnd} onDragStart={onDragStart}>
                    <div className="task-group">
                        {groupTasks()}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
}

export default Board