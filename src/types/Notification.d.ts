export interface Notification {
    task: Task
    changes: Change[]
}

export interface Change {
    timestamp: any
    user: User
    change_type: string
    payload: any
}

export interface Space {
    _id: string
    name: string
}

export interface Board {
    _id: string
    name: string
    space: Space
}

export interface Task {
    name: string
    _id: string
    board: Board
}

export interface User {
    username: string
}
