import {Component, Fragment} from 'react'
import './assets/Task.css'
import axios from "axios";
import {connect} from "react-redux";
import TaskPopover from "./TaskPopover";

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            activeOption: ''
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
            <div className="Task">
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
                            <Fragment key={attribute.name} >
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

                    <div onClick={this.handleDelete}>
                        <i className="fas fa-trash-alt"> </i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(Task)