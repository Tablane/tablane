import {Component, Fragment} from 'react'
import './assets/Task.css'
import axios from "axios";
import {connect} from "react-redux";
import TaskPopover from "./TaskPopover";
import {Draggable} from "react-beautiful-dnd";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            activeOption: '',
            deleteDialogOpen: false,
        }
    }

    handleClose = () => {
        this.setState({anchor: null})
    }

    handleClick = (e, key) => {
        this.setState({
            anchor: e.currentTarget,
            activeOption: key._id,
        })
    }

    handleDeleteClick = () => {
        this.setState(st => ({deleteDialogOpen: !st.deleteDialogOpen}))
    }

    handleDelete = async () => {
        axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/task/${this.props.board._id}/${this.props.taskGroupId}/${this.props.task._id}`
        }).then(() => {
            this.props.getData()
        })
    }

    render() {
        return (
            <>
                <Draggable draggableId={this.props.task._id} index={this.props.index} type="task">
                    {(provided) => (
                        <div className="Task" {...provided.draggableProps}
                             ref={provided.innerRef} {...provided.dragHandleProps}>
                            <p>{this.props.task.name}</p>
                            <div>
                                {this.props.attributes.map(attribute => {
                                    let taskOption = this.props.task.options.find(x => x.name === attribute.name)
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
                                                <TaskPopover
                                                    attribute={attribute}
                                                    anchor={this.state.anchor}
                                                    task={this.props.task}
                                                    getData={this.props.getData}
                                                    taskGroupId={this.props.taskGroupId}
                                                    handleClose={this.handleClose}/>)}
                                        </Fragment>
                                    )
                                })}

                                <div onClick={this.handleDeleteClick}>
                                    <i className="fas fa-trash-alt"> </i>
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>
                <Dialog
                    open={this.state.deleteDialogOpen}
                    onClose={this.handleDeleteClick}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete this task?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            It will be kept in your Recycle Bin for 30 days.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDeleteClick} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDelete} color="primary" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(Task)