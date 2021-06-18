import {Component} from 'react'
import './assets/Board.css'
import TaskGroup from './partials/TaskGroup'

class Board extends Component {

    findTasks = () => {
        const space = this.props.match.match.params.space.replace('-', ' ')
        const board = this.props.match.match.params.board.replace('-', ' ')
        return this.props.tasks.spaces.find(x => x.name === space).boards.find(x => x.name === board).tasks
    }

    render() {
        return (
            <div className="Board">
                <div className="task-group">
                    {this.findTasks().map(tasks => {
                        return <TaskGroup key={tasks.name} tasks={tasks}/>
                    })}
                </div>
            </div>
        );
    }
}

export default Board