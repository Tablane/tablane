import {Component} from 'react'
import './App.css';
import Board from './components/Board'
import SideBar from './components/SideBar'
import TopMenu from './components/TopMenu'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true}
    }

    componentDidMount() {
        this.setState({loading: false})
        const data = {
            spaces: [
                {
                    name: 'Server Project',
                    boards: [
                        {
                            name: 'TTT',
                            tasks: [
                                {
                                    name: 'Lobby Time',
                                    task: [
                                        {
                                            name: 'Fix time exp bar',
                                            options: [0, 0, 0]
                                        },
                                        {
                                            name: 'Fix time starting at 61 seconds',
                                            options: [0, 0, 0]
                                        },
                                        {
                                            name: 'Make time go faster',
                                            options: [0, 0, 0]
                                        }
                                    ]
                                },
                                {
                                    name: 'Game Time',
                                    task: [
                                        {
                                            name: 'Fix game exp bar',
                                            options: [0, 0, 0]
                                        },
                                        {
                                            name: 'Fix time ending at 351 seconds',
                                            options: [0, 0, 0]
                                        },
                                        {
                                            name: 'Make time go slower',
                                            options: [0, 0, 0]
                                        }
                                    ]
                                },
                                {
                                    name: 'Ending Time',
                                    task: [
                                        {
                                            name: 'Fix player losing connection at the end',
                                            options: [0, 0, 0]
                                        },
                                        {
                                            name: 'Fix time not ending',
                                            options: [0, 0, 0]
                                        },
                                        {
                                            name: 'Fix time',
                                            options: [0, 0, 0]
                                        }
                                    ]
                                }
                            ]
                        },
                //         {
                //             name: 'Lobby',
                //         },
                //         {
                //             name: 'Server',
                //         }
                    ]
                },
                // {
                //     name: 'External Projects',
                //     boards: [
                //
                //     ]
                // },
                // {
                //     name: 'Dev Project',
                //     boards: [
                //
                //     ]
                // }
            ]
        }
    }

    render() {
        return (
            this.state.loading
                ? <p>loading...</p>
                : <div className="App">
                    <SideBar/>
                    <TopMenu/>
                    <Board/>
                </div>
        );
    }
}

export default App;
