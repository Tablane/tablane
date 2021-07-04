import {Component} from 'react'
import './assets/TaskGroup.css'
import Task from './Task'
import axios from "axios";
import {toast} from "react-hot-toast";

class TaskGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTask: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addTask = async (e) => {
        e.preventDefault()
        await axios({
            method: 'POST',
            withCredentials: true,
            url: `http://localhost:3001/api/task/${this.props.boardId}/${this.props.taskGroup._id}`,
            data: {
                name: this.state.newTask,
                options: {
                    status: 0,
                    developed: 0,
                    finished: 0
                }
            }
        }).then(res => {
            this.props.getData()
            this.setState({
                newTask: ''
            })
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleDelete = async () => {
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/taskgroup/${this.props.boardId}/${this.props.taskGroup._id}`
        }).then(res => {
            this.props.getData()
        }).catch(err => {
            toast(err.toString())
        })
    }

    render() {
        return (
            <div className="task">
                <div className="title">
                    <div>
                        <div className="taskGroup-title">
                            <p>{this.props.taskGroup.name}</p>
                            <i onClick={this.handleDelete} className="fas fa-trash-alt"> </i>
                        </div>
                        <p className="task-amount">{this.props.taskGroup.tasks.length} TASKS</p>
                    </div>
                    <div className="attributes">
                        {this.props.attributes.map(x => <p key={x.name}>{x.name}</p>)}
                        <p><i className="fas fa-plus-circle"> </i></p>
                    </div>
                </div>
                <div className="tasks">
                    {this.props.taskGroup.tasks.map(task => {
                        return <Task
                            key={task._id}
                            getData={this.props.getData}
                            task={task}
                            taskGroupId={this.props.taskGroup._id}
                            attributes={this.props.attributes} />
                    })}
                </div>
                <form onSubmit={this.addTask}>
                    <div className="new-task">
                        <input
                            type="text"
                            placeholder="+ New Task"
                            value={this.state.newTask}
                            name="newTask"
                            onChange={this.handleChange} />
                        {this.state.newTask ? <button>SAVE</button> : null}
                    </div>
                </form>
            </div>
        );
    }
}

export default TaskGroup