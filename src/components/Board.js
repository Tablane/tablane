import {Component} from 'react'
import './assets/Board.css'
import TaskGroup from './partials/TaskGroup'

class Board extends Component {

    findBoard = () => {
        // const workspace = this.props.match.params.workspace
        const space = this.props.match.params.space.replace('-', ' ')
        const board = this.props.match.params.board.replace('-', ' ')
        return this.props.tasks.spaces.find(x => x.name === space).boards.find(x => x.name === board)
    }

    render() {
        const board = this.findBoard()
        return (
            <div className="Board">
                <div className="task-group">
                    {board.taskGroups.map(taskGroup => {
                        return <TaskGroup
                            getData={this.props.getData}
                            key={taskGroup.name}
                            taskGroup={taskGroup}
                            attributes={board.attributes}/>
                    })}
                </div>
            </div>
        );
    }
}

export default Board