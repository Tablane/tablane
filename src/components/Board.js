import {Component} from 'react'
import './assets/Board.css'
import TaskGroup from './partials/TaskGroup'

class Board extends Component {
    render() {
        return (
            <div className="Board">
                <div className="task-group">
                    {this.props.tasks.map(tasks => {
                        return <TaskGroup key={tasks.name} tasks={tasks} />
                    })}
                </div>
            </div>
        );
    }
}

export default Board