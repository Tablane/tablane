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
        }
    }

    handleClose = () => {
        this.setState({anchor: null})
    }

    handleClick = (e, key) => {
        this.setState({
            anchor: e.currentTarget,
            options: this.props.attributes.find(x => x.name === key.name).labels,
            currentOption: this.props.attributes.find(x => x.name === key.name).name
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
        }).then(res => {
            this.props.getData()
        })
        this.handleClose()
    }

    handleDelete = async () => {
        axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/task/${this.props.board._id}/${this.props.taskGroupId}/${this.props.task._id}`
        }).then(res => {
            this.props.getData()
        })
    }

    render() {
        return (
            <div className="Task">
                <p>{this.props.task.name}</p>
                <div>
                    {this.props.task.options.map(option => {
                        const color = option.value === -1 ? 'rgb(196,196,196)' : this.props.attributes.find(attribute => attribute.name === option.name).labels[option.value].color

                        return <div
                            key={option.name}
                            onClick={(e) => this.handleClick(e, option)}
                            style={{backgroundColor: color}}>
                            {option.value === -1 ? '' : this.props.attributes.find(attribute => attribute.name === option.name).labels[option.value].name}
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
                                    return <div
                                        key={x.name}
                                        style={{backgroundColor: x.color}}
                                        onClick={e => {
                                            this.handleChange(this.state.options.indexOf(this.state.options.find(x => x.name === e.currentTarget.textContent)))
                                        }}>{x.name}</div>
                                })}
                                <div
                                    key="none"
                                    style={{backgroundColor: 'rgb(181, 188, 194)'}}
                                    onClick={() => this.handleChange(-1)}></div>
                            </div>
                            <div className="edit">
                                <i className="fas fa-pen"> </i>
                                <p>Edit Labels</p>
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