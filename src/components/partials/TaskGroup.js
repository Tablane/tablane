import {Component} from 'react'
import './assets/TaskGroup.css'
import Task from './Task'

class TaskGroup extends Component {
    render() {
        return (
            <div className="task">
                <div className="title">
                    <div>
                        <p>{this.props.taskGroup.name}</p>
                        <p>{this.props.taskGroup.tasks.length} TASKS</p>
                    </div>
                    <div className="attributes">
                        {Object.keys(this.props.attributes).map((x) => {
                            return <p key={x}>{x}</p>
                        })}
                    </div>
                </div>
                <div className="tasks">
                    {this.props.taskGroup.tasks.map(task => {
                        return <Task
                            key={task.name}
                            getData={this.props.getData}
                            task={task}
                            taskGroupId={this.props.taskGroup._id}
                            attributes={this.props.attributes} />
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