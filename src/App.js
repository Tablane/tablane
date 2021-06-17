import {Component} from 'react'
import './App.css';
import Board from './components/Board'
import SideBar from './components/SideBar'
import TopMenu from './components/TopMenu'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, data: []}
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false,
                data: {
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
                                {
                                    name: 'Lobby',
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
                                {
                                    name: 'Server',
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
                                }
                            ]
                        },
                        {
                            name: 'External Projects',
                            boards: [
                                {
                                    name: 'BanSystem',
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
                                {
                                    name: 'Effects',
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
                                }
                            ]
                        },
                        {
                            name: 'Dev Project',
                            boards: [
                                {
                                    name: 'TaskBoard',
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
                                {
                                    name: 'bCrypt',
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
                                {
                                    name: 'AirDrop',
                                    tasks: [
                                        {
                                            name: 'Connection',
                                            task: [
                                                {
                                                    name: 'Fix delay',
                                                    options: [0, 0, 0]
                                                },
                                                {
                                                    name: 'Fix delays',
                                                    options: [0, 0, 0]
                                                },
                                                {
                                                    name: 'Fix connection issues',
                                                    options: [0, 0, 0]
                                                },
                                                {
                                                    name: 'speed up connection',
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
                                }
                            ]
                        }
                    ]
                }
            })
        }, 0)
    }

    render() {
        return (
            this.state.loading
                ? <p>loading...</p>
                : <div className="App">
                    <SideBar data={this.state.data}/>
                    <TopMenu/>
                    <Board tasks={this.state.data.spaces[2].boards[2].tasks}/>
                </div>
        );
    }
}

export default App;
