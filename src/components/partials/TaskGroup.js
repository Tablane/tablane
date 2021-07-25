import {Component} from 'react'
import './assets/TaskGroup.css'
import Task from './Task'
import axios from "axios";
import {toast} from "react-hot-toast";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Draggable, Droppable} from "react-beautiful-dnd";

class TaskGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTask: '',
            dialogOpen: false,
            name: ''
        }
    }

    handleNewStatus = async () => {
        await axios({
            method: 'POST',
            withCredentials: true,
            url: `http://localhost:3001/api/attribute/${this.props.boardId}`,
            data: {
                name: this.state.name
            }
        }).then(res => {
            this.props.getData()
            this.setState({
                name: '',
                dialogOpen: false
            })
        }).catch(err => {
            toast(err.toString())
        })
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
                name: this.state.newTask
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

    handleAttributeDelete = async (attributeId) => {
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/attribute/${this.props.boardId}/${attributeId}`
        }).then(res => {
            this.props.getData()
        }).catch(err => {
            toast(err.toString())
        })
    }

    render() {
        return (
            <Draggable draggableId={this.props.taskGroup._id} index={this.props.index}>
                {(provided) => (
                    <div className="task" {...provided.draggableProps} ref={provided.innerRef}>
                        <div className="title" {...provided.dragHandleProps}>
                            <div>
                                <div className="taskGroup-title">
                                    <p>{this.props.taskGroup.name}</p>
                                    <i onClick={this.handleDelete} className="fas fa-trash-alt"> </i>
                                </div>
                                <p className="task-amount">{this.props.taskGroup.tasks.length} TASKS</p>
                            </div>
                            <div className="attributes">
                                {this.props.attributes.map(x => {
                                    return (<div className="attribute" key={x.name}>
                                        <p>{x.name}</p>
                                        <i className="fas fa-trash-alt" onClick={() => this.handleAttributeDelete(x._id)}> </i>
                                    </div>)
                                })}
                                <div className="attribute">
                                    <p><i
                                        onClick={() => this.setState({dialogOpen: true})}
                                        className="fas fa-plus-circle"> </i></p>
                                </div>
                            </div>
                        </div>
                        <Droppable droppableId={this.props.taskGroup._id} type="task">
                            {(provided) => (
                                <div className="tasks" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.props.taskGroup.tasks.map((task, i) => {
                                        return (
                                            <Task
                                                key={task._id}
                                                getData={this.props.getData}
                                                task={task}
                                                index={i}
                                                taskGroupId={this.props.taskGroup._id}
                                                attributes={this.props.attributes}/>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
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


                        <Dialog
                            open={this.state.dialogOpen}
                            onClose={() => this.setState({dialogOpen: false})}
                            aria-labelledby="form-dialog-title"
                            fullWidth={true}>
                            <DialogTitle id="form-dialog-title">Add new Status</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    onChange={this.handleChange}
                                    label="Status name"
                                    type="text"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.setState({dialogOpen: false})} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleNewStatus} color="primary">
                                    Create
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default TaskGroup