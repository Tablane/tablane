export const flatten = (items, parentId = null, level = 0) => {
    return items.reduce((acc, item, index) => {
        return [
            ...acc,
            {
                ...item,
                subtasks: [],
                children: item.subtasks.length,
                level
            },
            ...flatten(item.subtasks, item._id, level + 1)
        ]
    }, [])
}

export const buildTree = flattenedTasks => {
    const root = { _id: 'root', subtasks: [] }
    const nodes = { [root._id]: root }
    const items = flattenedTasks.map(item => ({ ...item, subtasks: [] }))

    for (const item of items) {
        const { _id, subtasks } = item
        const parentTask = item.parentTask ?? root._id
        const parent =
            nodes[parentTask] ?? items.find(({ _id }) => _id === parentTask)

        nodes[_id] = { _id, subtasks }
        parent.subtasks.push(item)
    }
    return root.subtasks
}

export const removeChildrenOf = (items, ids) => {
    const excludeParentIds = [...ids]

    return items.filter(item => {
        if (item.parentTask && excludeParentIds.includes(item.parentTask)) {
            excludeParentIds.push(item._id)
            return false
        }

        return true
    })
}
