import {Component} from 'react'
import './assets/TaskGroup.css'
import Task from './Task'

class TaskGroup extends Component {
    render() {
        const name = 'Fix Loading time in the secondary screen'
        return (
            <div className="task">
                <div className="title">
                    <div>
                        <p>Lobby Time</p>
                        <p>5 TASKS</p>
                    </div>
                    <div className="attributes">
                        <p>Due Date</p>
                        <p>Priority</p>
                        <p>Status</p>
                        <p>Developed</p>
                    </div>
                </div>
                <div className="tasks">
                    <Task name={name} />
                    <Task name={name} />
                    <Task name={name} />
                </div>
                <div className="new-task">
                    <p>+ New Task</p>
                </div>
            </div>
        );
    }
}

export default TaskGroup