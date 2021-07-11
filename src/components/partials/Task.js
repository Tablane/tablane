import {Component} from 'react'
import './assets/Task.css'
import {Popover} from "@material-ui/core";
import axios from "axios";
import {connect} from "react-redux";

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            options: [{name: 'error', color: 'red'}],
            currentOption: null,
            editing: false,
            currentLabels: []
        }
    }

    handleClose = () => {
        this.setState({anchor: null, editing: false})
    }

    toggleEdit = async () => {
        if (this.state.editing) {
            axios({
                method: 'PUT',
                data: {
                    name: this.state.currentOption,
                    labels: this.state.currentLabels
                },
                withCredentials: true,
                url: `http://localhost:3001/api/attribute/${this.props.board._id}`
            }).then(() => {
                this.props.getData()
            })
        } else {

        }
        this.setState(st => ({editing: !st.editing}))
    }

    handleClick = (e, key) => {
        this.setState({
            anchor: e.currentTarget,
            options: this.props.attributes.find(x => x.name === key.name).labels,
            currentOption: this.props.attributes.find(x => x.name === key.name).name,
            currentLabels: this.props.attributes.find(x => x.name === key.name).labels
        })
    }

    handleEditChange = (e, x) => {
        let newCurrentLabels = this.state.currentLabels
        newCurrentLabels[x].name = e.target.value
        this.setState({
            currentLabels: newCurrentLabels
        })
    }

    handleEditDelete = (index) => {
        let newCurrentLabels = this.state.currentLabels
        newCurrentLabels.splice(index, 1)
        this.setState({
            currentLabels: newCurrentLabels
        })
    }

    addNewLabel = () => {
        let newCurrentLabels = this.state.currentLabels
        const attribute = { name: '', color: '#C4C4C4' }
        newCurrentLabels.push(attribute)
        this.setState({
            currentLabels: newCurrentLabels
        })
    }

    handleChange = (value) => {
        axios({
            method: 'PATCH',
            data: {
                property: this.state.currentOption,
                value: value
            },
            withCredentials: true,
            url: `http://localhost:3001/api/task/${this.props.board._id}/${this.props.taskGroupId}/${this.props.task._id}`
        }).then(() => {
            this.props.getData()
        })
        this.handleClose()
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
        let colors = ["rgb(255, 90, 196)", "rgb(255, 21, 138)", "rgb(187, 51, 84)", "rgb(127, 83, 71)", "rgb(255, 100, 46)", "rgb(255, 203, 0)", "rgb(202, 182, 65)", "rgb(156, 211, 38)", "rgb(3, 127, 76)", "rgb(0, 134, 192)", "rgb(87, 155, 252)", "rgb(102, 204, 255)", "rgb(162, 93, 220)", "rgb(120, 75, 209)", "rgb(128, 128, 128)", "rgb(51, 51, 51)", "rgb(255, 117, 117)", "rgb(250, 161, 241)", "rgb(255, 173, 173)", "rgb(126, 59, 138)", "rgb(154, 173, 189)", "rgb(104, 161, 189)", "rgb(34, 80, 145)", "rgb(78, 204, 198)", "rgb(85, 89, 223)", "rgb(64, 22, 148)", "rgb(86, 62, 62)", "rgb(189, 168, 249)", "rgb(43, 118, 229)", "rgb(169, 190, 232)", "rgb(217, 116, 176)", "rgb(157, 153, 185)", "rgb(173, 150, 122)", "rgb(161, 227, 246)", "rgb(189, 129, 110)", "rgb(23, 90, 99)"]
        return (
            <div className="Task">
                <p>{this.props.task.name}</p>
                <div>
                    {this.props.attributes.map(option => {
                        let value = this.props.task.options.find(x => x.name === option.name)
                        if (value) value = value.value
                        else value = -1

                        let label
                        if (value === -1 || !option.labels[value]) label = {color: 'rgb(196,196,196)', name: ''}
                        else label = option.labels[value]
                        return <div
                            key={option.name}
                            onClick={(e) => this.handleClick(e, option)}
                            style={{backgroundColor: label.color}}>
                            {label.name}
                        </div>
                    })}

                    <div onClick={this.handleDelete}>
                        <i className="fas fa-trash-alt"> </i>
                    </div>

                    <Popover
                        open={Boolean(this.state.anchor)}
                        anchorEl={this.state.anchor}
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
                            <div className="options">
                                {this.state.options.map(x => {
                                    const index = this.state.currentLabels.indexOf(this.state.currentLabels.find(xe => xe.name === x.name))
                                    return <div
                                        className={this.state.editing ? 'editing' : ''}
                                        key={index}
                                        onClick={e => {
                                            if (!this.state.editing)
                                                this.handleChange(this.state.options.indexOf(this.state.options.find(x => x.name === e.currentTarget.textContent)))
                                        }}>
                                        {this.state.editing ? <i className="fas fa-grip-vertical"> </i> : null}
                                        <div style={{backgroundColor: x.color}}>
                                            {this.state.editing ? <i className="fas fa-tint"> </i> : x.name}
                                        </div>
                                        {this.state.editing ?
                                            <div>
                                                <input
                                                    onChange={e => this.handleEditChange(e, index)}
                                                    value={this.state.currentLabels[index].name}
                                                    type="text"/>
                                            </div>
                                            : ''}
                                        {this.state.editing ?
                                            <i
                                                onClick={() => this.handleEditDelete(index)}
                                                className="fas fa-times-circle"> </i> : null}
                                    </div>
                                })}
                                <div
                                    className={this.state.editing ? 'editing' : ''}
                                    key="none"
                                    style={{backgroundColor: 'rgb(181, 188, 194)'}}
                                    onClick={() => this.handleChange(-1)}> </div>
                                {this.state.editing
                                    ? <div
                                        className="new-label"
                                        key="new-label"
                                        onClick={this.addNewLabel}>New label</div>
                                    : ''}
                            </div>
                            {this.state.editing
                                ? <div className="colors">
                                    {colors.map(x => <div
                                        key={x}
                                        style={{backgroundColor: x}}> </div>)}
                                </div>
                                : ''}
                            <div className="edit" onClick={this.toggleEdit}>
                                {this.state.editing ? '' : <i className="fas fa-pen"> </i>}
                                <p>{this.state.editing ? 'Apply' : 'Edit Labels'}</p>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(Task)