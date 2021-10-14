import {Component} from 'react'
import './assets/Board.css'
import TaskGroup from './partials/TaskGroup'
import {connect} from "react-redux";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {LinearProgress} from "@material-ui/core";
import axios from "axios";
import {toast} from "react-hot-toast";
import NewTaskGroup from "./partials/NewTaskGroup";

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            loading: false,
            newTaskGroupShown: false
        }
    }

    findBoardId = () => {
        const space = this.props.match.params.space.replaceAll('-', ' ')
        const board = this.props.match.params.board.replaceAll('-', ' ')
        return this.props.workspaces.spaces.find(x => x.name === space).boards.find(x => x.name === board)._id
    }

    getData = async () => {
        this.setState({loading: true})
        await axios({
            method: 'GET',
            withCredentials: true,
            url: `http://localhost:3001/api/board/${this.findBoardId()}`
        }).then(res => {
            this.props.dispatch({type: 'setData', payload: ['board', res.data]})
        }).catch(err => {
            toast(err.toString())
        })
        this.setState({loading: false})
    }

    toggleNewTaskGroup = () => {
        this.setState(st => ({newTaskGroupShown: !st.newTaskGroupShown}))
    }

    onDragStart = () => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'pointer'
    }

    handleDragEnd = async (result) => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'auto'
        if (result.destination === null ||
            (result.destination.index === result.source.index
                && result.destination.droppableId === result.source.droppableId)) return
        if (result.type === "task") {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `http://localhost:3001/api/task/${this.findBoardId()}`
            }).then(res => {
                this.getData()
            }).catch(err => {
                toast(err.toString())
            })
        } else if (result.type === "taskgroup") {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `http://localhost:3001/api/taskgroup/${this.findBoardId()}`
            }).then(res => {
                this.getData()
            }).catch(err => {
                toast(err.toString())
            })
        } else if (/^attribute /gm.test(result.type)) {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `http://localhost:3001/api/attribute/${this.findBoardId()}`
            }).then(res => {
                this.getData()
            }).catch(err => {
                toast(err.toString())
            })
        }
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.url === this.props.match.url) return
        this.getData()
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                {!this.props.board
                    ? <LinearProgress/>
                    : <div>
                        {this.state.loading ? <LinearProgress/> : <div className="loading-placeholder"> </div>}
                        <DragDropContext onDragEnd={this.handleDragEnd} onDragStart={this.onDragStart}>
                            <Droppable droppableId="taskgroups" type="taskgroup">
                                {(provided) => (
                                    <div className="task-group" {...provided.droppableProps} ref={provided.innerRef}>
                                        {this.props.board.taskGroups.map((taskGroup, i) => {
                                            return <TaskGroup
                                                getData={this.getData}
                                                boardId={this.props.board._id}
                                                key={taskGroup._id}
                                                taskGroup={taskGroup}
                                                index={i}
                                                attributes={this.props.board.attributes}/>
                                        })}
                                        {this.state.newTaskGroupShown && (
                                            <NewTaskGroup
                                                attributes={this.props.board.attributes}
                                                index={this.props.board.taskGroups.length}
                                                toggleNewTaskGroup={this.toggleNewTaskGroup}
                                                getData={this.getData}
                                                boardId={this.findBoardId()}/>
                                        )}
                                        {provided.placeholder}
                                        <div className="add-task-group">
                                            <div> </div>
                                            <button onClick={this.toggleNewTaskGroup}>ADD NEW TASKGROUP</button>
                                            <div> </div>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
        workspaces: state.workspaces,
        board: state.board
    }
)

export default connect(mapStateToProps)(Board)