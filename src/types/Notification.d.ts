export interface Notification {
    task: Task
    changes: Change[]
}

export interface Change {
    timestamp: any
    actor: User
    referencedUser: User
    change_type: string
    field_type: string
    field_name: string
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
    watcher: User[]
    board: Board
}

export interface User {
    _id: string
    username: string
}
