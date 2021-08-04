import {Component, Fragment} from 'react'
import './assets/Task.css'
import axios from "axios";
import {connect} from "react-redux";
import TaskColumnPopover from "./TaskColumnPopover";
import {Draggable} from "react-beautiful-dnd";
import TaskPopover from "./TaskPopover";

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            activeOption: '',
            columnDialogOpen: false,
            moreDialogOpen: false,

            // taskName editing
            taskEditing: false,
            taskName: this.props.task.name
        }
    }

    handleClose = () => {
        this.setState({anchor: null, moreDialogOpen: false, columnDialogOpen: false})
    }

    handleClick = (e, key) => {
        const anchor = e.currentTarget
        this.setState(st => ({
            anchor,
            activeOption: key._id,
            columnDialogOpen: !st.columnDialogOpen
        }))
    }

    handleMoreClick = (e) => {
        const anchor = e.currentTarget
        this.setState(st => ({
            anchor,
            moreDialogOpen: !st.moreDialogOpen
        }))
    }

    handleTextEdit = async (e) => {
        const {board, taskGroupId, task} = this.props
        axios({
            method: 'PATCH',
            data: {
                column: e.target.name,
                value: e.target.value,
                type: 'text'
            },
            withCredentials: true,
            url: `http://localhost:3001/api/task/${board._id}/${taskGroupId}/${task._id}`
        }).then(() => {
            this.props.getData()
        })
    }

    getStatusLabel = (attribute) => {
        let taskOption = this.props.task.options.find(x => x.column === attribute._id)
        let label

        if (taskOption) {
            label = attribute.labels.find(x => x._id === taskOption.value)
        } else label = {color: 'rgb(196,196,196)', name: ''}

        if (!label) label = {color: 'rgb(196,196,196)', name: ''}

        return (
            <Fragment key={attribute._id}>
                <div
                    onClick={(e) => this.handleClick(e, attribute)}
                    style={{backgroundColor: label.color}}>
                    {label.name}
                </div>
                {attribute._id.toString() === this.state.activeOption && (
                    <TaskColumnPopover
                        attribute={attribute}
                        anchor={this.state.anchor}
                        open={this.state.columnDialogOpen}
                        task={this.props.task}
                        getData={this.props.getData}
                        taskGroupId={this.props.taskGroupId}
                        handleClose={this.handleClose}/>)}
            </Fragment>
        )
    }

    getTextLabel = (attribute) => {
        let taskOption = this.props.task.options.find(x => x.column === attribute._id)
        if (!taskOption) taskOption = { value: '' }
        return (
            <div style={{backgroundColor: 'transparent'}} key={attribute._id}>
                <input type="text" name={attribute._id} onBlur={this.handleTextEdit} defaultValue={taskOption.value}/>
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggleTaskEdit = () => {
        this.setState(st => ({
            taskEditing: !st.taskEditing
        }))
    }

    handleTaskEdit = (e) => {
        e.preventDefault()
        const {board, taskGroupId, task} = this.props
        this.toggleTaskEdit()
        axios({
            method: 'PATCH',
            data: {
                type: 'name',
                name: this.state.taskName
            },
            withCredentials: true,
            url: `http://localhost:3001/api/task/${board._id}/${taskGroupId}/${task._id}`
        }).then(() => {
            this.props.getData()
        })
    }

    render() {
        return (
            <>
                <Draggable draggableId={this.props.task._id} index={this.props.index} type="task" >
                    {(provided) => (
                        <div className={`Task ${this.state.taskEditing ? 'editing' : ''}`} {...provided.draggableProps}
                             ref={provided.innerRef} {...provided.dragHandleProps}>
                            {this.state.taskEditing
                                ? (
                                    <form onSubmit={this.handleTaskEdit} onBlur={this.handleTaskEdit}>
                                        <input type={this.taskName}
                                               onKeyUp={e => {if (e.key === 'Escape') e.currentTarget.blur()}}
                                               value={this.state.taskName}
                                               onChange={this.handleChange}
                                               name="taskName" autoFocus />
                                    </form>
                                )
                                : <p>{this.props.task.name}</p>}
                            <div>
                                {this.props.attributes.map(attribute => {

                                    if (attribute.type === "status") return this.getStatusLabel(attribute)
                                    if (attribute.type === "text") return this.getTextLabel(attribute)

                                    return (
                                        <div style={{backgroundColor: 'crimson'}} key={Math.random()}>
                                            ERROR
                                        </div>
                                    )
                                })}

                                <div onClick={this.handleMoreClick}>
                                    <i className="fas fa-ellipsis-h"> </i>
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>

                {!this.state.taskEditing && <TaskPopover
                    toggleTaskEdit={this.toggleTaskEdit}
                    open={this.state.moreDialogOpen}
                    getData={this.props.getData}
                    anchor={this.state.anchor}
                    handleClose={this.handleClose}
                    board={this.props.board}
                    taskGroupId={this.props.taskGroupId}
                    task={this.props.task} />}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(Task)