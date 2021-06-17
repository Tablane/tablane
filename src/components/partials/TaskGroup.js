import {Component} from 'react'
import './assets/TaskGroup.css'
import Task from './Task'

class TaskGroup extends Component {
    render() {
        return (
            <div className="task">
                <div className="title">
                    <div>
                        <p>{this.props.tasks.name}</p>
                        <p>{this.props.tasks.task.length} TASKS</p>
                    </div>
                    <div className="attributes">
                        <p>Due Date</p>
                        <p>Priority</p>
                        <p>Status</p>
                        <p>Developed</p>
                    </div>
                </div>
                <div className="tasks">
                    {this.props.tasks.task.map(task => {
                        return <Task key={task.name} name={task.name} />
                    })}
                </div>
                <div className="new-task">
                    <p>+ New Task</p>
                </div>
            </div>
        );
    }
}

export default TaskGroup