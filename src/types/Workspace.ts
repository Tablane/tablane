export interface User {
    _id: string
    username: string
    email: string
}

export interface MemberRole {
    _id: string
    name: string
}

export interface Role {
    _id: string
    name: string
    permissions: string[]
    __v: number
}

export interface Member {
    user: User
    isOwner: boolean
    labels: any[]
    role: MemberRole
}

export interface Board {
    _id: string
    name: string
}

export interface Space {
    _id: string
    name: string
    boards: Board[]
}

export interface Workspace {
    _id: string
    name: string
    id: number
    members: Member[]
    spaces: Space[]
    roles: Role[]
    __v: number
}
