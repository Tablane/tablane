import {Component} from 'react'
import './assets/Board.css'
import TaskGroup from './partials/TaskGroup'
import {connect} from "react-redux";
import {LinearProgress} from "@material-ui/core";
import axios from "axios";
import {toast} from "react-hot-toast";

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false}
    }


    findBoardId = () => {
        const space = this.props.match.params.space.replace('-', ' ')
        const board = this.props.match.params.board.replace('-', ' ')
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

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.url === this.props.match.url) return
        this.getData()
    }

    render() {
        return (
            <div>
                {!this.props.board
                    ? <LinearProgress/>
                    : <div>
                        {this.state.loading ? <LinearProgress/> : <div className="loading-placeholder"> </div>}
                        <div className="task-group">
                            {this.props.board.taskGroups.map(taskGroup => {
                                return <TaskGroup
                                    getData={this.getData}
                                    key={taskGroup.name}
                                    taskGroup={taskGroup}
                                    attributes={this.props.board.attributes}/>
                            })}
                        </div>
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