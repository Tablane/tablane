export interface Option {
    column: string
    value: any
    _id: string
}

export interface Author {
    _id: string
    username: string
}

export interface Reply {
    _id: string
    type: string
    author: Author
    content: any
    timestamp: string
    task: string
    replies: any[]
    __v: number
}

export interface Comment {
    _id: string
    type: string
    author: Author
    content: any
    timestamp: string
    task: string
    replies: Reply[]
    __v: number
}

export interface Author3 {
    _id: string
    username: string
}

export interface Change {
    type: string
    field: string
    to: string
    from: string
}

export interface History {
    _id: string
    type: string
    author: Author3
    change: Change
    timestamp: string
    task: string
    __v: number
    referencedUser?: any
}

export interface Watcher {
    _id: string
    username: string
}

export interface Task {
    _id: string
    name: string
    options: Option[]
    comments: Comment[]
    history: History[]
    description: any
    board: string
    workspace: string
    subtasks: any[]
    level: number
    watcher: Watcher[]
    __v: number
}

export interface FlatTask extends Task {
    children: number
}

export interface Label {
    _id: string
    name: string
    color: string
}

export interface Attribute {
    type: string
    _id: string
    name: string
    labels: Label[]
}

export interface Board {
    _id: string
    name: string
    workspace: string
    space: string
    sharing: boolean
    tasks: Task[]
    attributes: Attribute[]
    __v: number
    groupBy: string
}
