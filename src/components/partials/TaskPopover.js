import {Component} from "react";
import {Popover} from "@material-ui/core";
import axios from "axios";
import {connect} from "react-redux";
import {ObjectID} from "bson";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AnimateHeight from "react-animate-height";

class TaskPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            currentLabels: this.props.attribute.labels,
            hoverColor: null
        }
    }

    toggleEdit = async () => {
        if (this.state.editing) {
            axios({
                method: 'PUT',
                data: {
                    name: this.props.attribute.name,
                    labels: this.state.currentLabels
                },
                withCredentials: true,
                url: `http://localhost:3001/api/attribute/${this.props.board._id}`
            }).then(() => {
                this.props.getData()
            })
        }
        this.setState(st => ({editing: !st.editing}))
    }

    handleClose = () => {
        this.setState({editing: false})
        this.props.handleClose()
    }

    // handle change of edit state labels
    handleEditChange = (e, x) => {
        let newCurrentLabels = this.state.currentLabels
        newCurrentLabels[x].name = e.target.value
        this.setState({
            currentLabels: newCurrentLabels
        })
    }

    // delete label while editing
    handleEditDelete = (id) => {
        const index = this.state.currentLabels.indexOf(this.state.currentLabels.find(x => x._id === id))
        let newCurrentLabels = this.state.currentLabels

        newCurrentLabels.splice(index, 1)
        this.setState({
            currentLabels: newCurrentLabels
        })
    }

    // add new label while editing
    addNewLabel = (color) => {
        if (typeof color !== "string") color = '#C4C4C4'
        if (this.state.hoverColor) {
            color = this.state.hoverColor
            this.setState({hoverColor: null})
        }
        let newCurrentLabels = this.state.currentLabels
        const attribute = { name: '', color: color, _id: ObjectID() }
        newCurrentLabels.push(attribute)
        this.setState({
            currentLabels: newCurrentLabels
        })
    }

    // change label to id
    handleLabelChange = (id) => {
        const {board, taskGroupId, task} = this.props
        if (this.state.editing) return
        axios({
            method: 'PATCH',
            data: {
                column: this.props.attribute._id,
                value: id._id
            },
            withCredentials: true,
            url: `http://localhost:3001/api/task/${board._id}/${taskGroupId}/${task._id}`
        }).then(() => {
            this.props.getData()
        })
        this.handleClose()
    }

    // change label to none
    handleLabelClear = () => {
        const {board, taskGroupId, task, attribute} = this.props
        if (this.state.editing) return
        axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/task/${board._id}/${taskGroupId}/${task._id}/${attribute._id}`
        }).then(() => {
            this.props.getData()
        })
        this.handleClose()
    }

    // handle sorting
    handleSort = (x) => {
        if (!x.destination) return
        const newLabels = this.state.currentLabels
        const [label] = newLabels.splice(x.source.index, 1)
        newLabels.splice(x.destination.index, 0, label)
    }

    render() {
        let colors = ["rgb(255, 90, 196)", "rgb(255, 21, 138)", "rgb(226, 68, 92)", "rgb(187, 51, 84)", "rgb(127, 83, 71)", "rgb(255, 100, 46)", "rgb(253, 171, 61)", "rgb(255, 203, 0)", "rgb(202, 182, 65)", "rgb(156, 211, 38)", "rgb(0, 200, 117)", "rgb(3, 127, 76)", "rgb(0, 134, 192)", "rgb(87, 155, 252)", "rgb(102, 204, 255)", "rgb(162, 93, 220)", "rgb(120, 75, 209)", "rgb(128, 128, 128)", "rgb(51, 51, 51)", "rgb(255, 117, 117)", "rgb(250, 161, 241)", "rgb(255, 173, 173)", "rgb(126, 59, 138)", "rgb(154, 173, 189)", "rgb(104, 161, 189)", "rgb(34, 80, 145)", "rgb(78, 204, 198)", "rgb(85, 89, 223)", "rgb(64, 22, 148)", "rgb(86, 62, 62)", "rgb(189, 168, 249)", "rgb(43, 118, 229)", "rgb(169, 190, 232)", "rgb(217, 116, 176)", "rgb(157, 153, 185)", "rgb(173, 150, 122)", "rgb(161, 227, 246)", "rgb(189, 129, 110)", "rgb(23, 90, 99)"]
        this.props.attribute.labels.forEach(x => {
            colors.splice(colors.indexOf(x.color), 1)
        })
        return (
            <Popover
                open={Boolean(this.props.anchor)}
                anchorEl={this.props.anchor}
                onClose={this.handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className="task-popover">
                    <DragDropContext onDragEnd={this.handleSort}>
                        <Droppable droppableId="labels">
                            {(provided) => (
                                <div className="options" {...provided.droppableProps} ref={provided.innerRef}>
                                    {this.state.currentLabels.map((x, i) => {
                                        return (
                                            <Draggable draggableId={x._id.toString()} key={x._id} index={i} isDragDisabled={!this.state.editing}>
                                                {(provided) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className={this.state.editing ? 'editing' : ''}
                                                        onClick={() => this.handleLabelChange(x)}>

                                                        <i className="fas fa-grip-vertical"> </i>
                                                        <div style={{backgroundColor: x.color}}>
                                                            {this.state.editing ?
                                                                <i className="fas fa-tint"> </i> : x.name}
                                                        </div>
                                                        {this.state.editing ?
                                                            <div>
                                                                <input
                                                                    onChange={e => this.handleEditChange(e, i)}
                                                                    value={this.state.currentLabels[i].name}
                                                                    type="text"/>
                                                            </div>
                                                            : ''}
                                                        <i
                                                            onClick={() => this.handleEditDelete(x._id)}
                                                            className="fas fa-times-circle"> </i>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                    <div
                                        className={`${this.state.editing ? 'editing' : ''} default`}
                                        key="none"
                                        style={{backgroundColor: 'rgb(181, 188, 194)'}}
                                        onClick={this.handleLabelClear}> </div>
                                    {this.state.editing
                                        ? <div
                                            className="new-label"
                                            key="new-label"
                                            style={{backgroundColor: this.state.hoverColor}}
                                            onClick={this.addNewLabel}>New label</div>
                                        : ''}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <AnimateHeight
                        duration={200}
                        height={this.state.editing ? 'auto' : 0}
                    >
                        <div className="colors">
                            {colors.map(x => <div
                                key={x}
                                onMouseEnter={() => this.setState({hoverColor: x})}
                                onClick={() => this.addNewLabel(x)}
                                style={{backgroundColor: x}}> </div>)}
                        </div>
                    </AnimateHeight>

                    <div className="edit" onClick={this.toggleEdit}>
                        {this.state.editing ? '' : <i className="fas fa-pen"> </i>}
                        <p>{this.state.editing ? 'Apply' : 'Edit Labels'}</p>
                    </div>
                </div>
            </Popover>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(TaskPopover)