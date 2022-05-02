import {useCallback, useContext, useEffect} from 'react'
import '../../components/assets/Board.css'
import TaskGroup from './board/TaskGroup'
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {LinearProgress} from "@material-ui/core";
import axios from "axios";
import {toast} from "react-hot-toast";
import NewTaskGroup from "./board/NewTaskGroup";
import WorkspaceContext from "../../modules/context/WorkspaceContext";
import useToggleState from "../../modules/hooks/useToggleState";
import BoardContext from "../../modules/context/BoardContext";

function Board(props) {
    const {workspace} = useContext(WorkspaceContext)
    const {board, getBoardData} = useContext(BoardContext)

    const [newTaskGroupShown, toggleNewTaskGroupShown] = useToggleState(false)

    const findBoardId = useCallback(() => {
        const space = props.match.params.space.replaceAll('-', ' ')
        const board = props.match.params.board.replaceAll('-', ' ')
        return workspace.spaces.find(x => x.name === space).boards.find(x => x.name === board)._id
    }, [props.match.params.space, props.match.params.board, workspace.spaces])
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
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${board._id}`
            }).then(() => {
                getBoardData()
            }).catch(err => {
                toast(err.toString())
            })
        } else if (result.type === "taskgroup") {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/taskgroup/${board._id}`
            }).then(() => {
                getBoardData()
            }).catch(err => {
                toast(err.toString())
            })
        } else if (/^attribute /gm.test(result.type)) {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${board._id}`
            }).then(() => {
                getBoardData()
            }).catch(err => {
                toast(err.toString())
            })
        }
    }

    useEffect(() => {
        getBoardData(boardId)
    }, [boardId])

    return (
        <div>
            {!board
                ? <LinearProgress/>
                : <div>
                    {!board ? <LinearProgress/> : <div className="loading-placeholder"></div>}
                    <DragDropContext onDragEnd={handleDragEnd} onDragStart={onDragStart}>
                        <Droppable droppableId="taskgroups" type="taskgroup">
                            {(provided) => (
                                <div className="task-group" {...provided.droppableProps} ref={provided.innerRef}>
                                    {board.taskGroups.map((taskGroup, i) => {
                                        return <TaskGroup
                                            key={taskGroup._id}
                                            taskGroup={taskGroup}
                                            index={i}/>
                                    })}
                                    {newTaskGroupShown && (
                                        <NewTaskGroup
                                            attributes={board.attributes}
                                            index={board.taskGroups.length}
                                            toggleNewTaskGroup={toggleNewTaskGroupShown}
                                            getData={getBoardData}
                                            boardId={board._id}/>
                                    )}
                                    {provided.placeholder}
                                    <div className="add-task-group">
                                        <div></div>
                                        <button onClick={toggleNewTaskGroupShown}>ADD NEW TASKGROUP</button>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            }
        </div>
    );
}

export default Board