import React, { Fragment, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import AnimateHeight from 'react-animate-height'
import { ObjectId } from '../../../../../../utils'
import _ from 'lodash'
import {
    useClearStatusTaskMutation,
    useEditAttributeLabelsMutation,
    useEditOptionsTaskMutation
} from '../../../../../../modules/services/boardSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Menu, Transition } from '@headlessui/react'

function TaskColumnPopover(props) {
    const { hasPerms, label } = props
    const button = useRef(null)
    const [editAttributeLabels] = useEditAttributeLabelsMutation()
    const [clearStatusTask] = useClearStatusTaskMutation()
    const [editOptionsTask] = useEditOptionsTaskMutation()

    const [labelsEditing, setLabelsEditing] = useState(false)

    const [colorEditingLabel, setColorEditingLabel] = useState(-1)
    const [editingLabels, setEditingLabels] = useState(props.attribute.labels)

    const [hoverColor, setHoverColor] = useState(null)

    const toggleEdit = async () => {
        if (labelsEditing) {
            editAttributeLabels({
                boardId: props.boardId,
                name: props.attribute.name,
                labels: editingLabels
            })
        }
        setLabelsEditing(!labelsEditing)
        setColorEditingLabel(-1)
    }

    useEffect(() => {
        setEditingLabels(props.attribute.labels)
    }, [props.attribute.labels])

    // handle change of edit state labels
    const handleEditChange = (e, x) => {
        let newCurrentLabels = _.cloneDeep(editingLabels)
        newCurrentLabels[x].name = e.target.value
        setEditingLabels([...newCurrentLabels])
    }

    // delete label while editing
    const handleEditDelete = id => {
        if (!labelsEditing) return
        let newCurrentLabels = _.cloneDeep(editingLabels)

        const index = newCurrentLabels.indexOf(
            newCurrentLabels.find(x => x._id === id)
        )
        newCurrentLabels.splice(index, 1)

        setEditingLabels([...newCurrentLabels])
    }

    // add new label while editing
    const addNewLabel = color => {
        if (colorEditingLabel === -1) {
            if (typeof color !== 'string') color = '#B5BCC2'
            if (hoverColor) {
                color = hoverColor
                setHoverColor(null)
            }
            let newCurrentLabels = _.cloneDeep(editingLabels)
            const attribute = { name: '', color: color, _id: ObjectId() }
            newCurrentLabels.push(attribute)
            setEditingLabels(newCurrentLabels)
        } else {
            const newCurrentLabels = _.cloneDeep(editingLabels)
            newCurrentLabels[colorEditingLabel].color = color
            setEditingLabels([...newCurrentLabels])
            setColorEditingLabel(-1)
        }
    }

    // change label to id
    const handleLabelChange = id => {
        const { task } = props
        if (labelsEditing) return

        editOptionsTask({
            boardId: props.boardId,
            taskId: task._id,
            column: props.attribute._id,
            value: id._id,
            type: 'status'
        })
        button.current.click()
    }

    // change label to none
    const handleLabelClear = () => {
        const { task, attribute } = props
        if (labelsEditing) return

        clearStatusTask({
            boardId: props.boardId,
            taskId: task._id,
            optionId: attribute._id
        })
        button.current.click()
    }

    // handle sorting
    const handleSort = x => {
        if (!x.destination) return
        const newLabels = _.cloneDeep(editingLabels)
        const [label] = newLabels.splice(x.source.index, 1)
        newLabels.splice(x.destination.index, 0, label)
        setEditingLabels(newLabels)
    }

    const editEditingLabel = i => {
        if (!labelsEditing) return
        setColorEditingLabel(i === colorEditingLabel ? -1 : i)
    }

    const handleLabelClick = (i, x) => {
        if (!labelsEditing) handleLabelChange(x)
        else editEditingLabel(i)
    }

    let colors = [
        'rgb(255, 90, 196)',
        'rgb(255, 21, 138)',
        'rgb(226, 68, 92)',
        'rgb(187, 51, 84)',
        'rgb(127, 83, 71)',
        'rgb(255, 100, 46)',
        'rgb(253, 171, 61)',
        'rgb(255, 203, 0)',
        'rgb(202, 182, 65)',
        'rgb(156, 211, 38)',
        'rgb(0, 200, 117)',
        'rgb(3, 127, 76)',
        'rgb(0, 134, 192)',
        'rgb(87, 155, 252)',
        'rgb(102, 204, 255)',
        'rgb(162, 93, 220)',
        'rgb(120, 75, 209)',
        'rgb(128, 128, 128)',
        'rgb(51, 51, 51)',
        'rgb(255, 117, 117)',
        'rgb(250, 161, 241)',
        'rgb(255, 173, 173)',
        'rgb(126, 59, 138)',
        'rgb(154, 173, 189)',
        'rgb(104, 161, 189)',
        'rgb(34, 80, 145)',
        'rgb(78, 204, 198)',
        'rgb(85, 89, 223)',
        'rgb(64, 22, 148)',
        'rgb(86, 62, 62)',
        'rgb(189, 168, 249)',
        'rgb(43, 118, 229)',
        'rgb(169, 190, 232)',
        'rgb(217, 116, 176)',
        'rgb(157, 153, 185)',
        'rgb(173, 150, 122)',
        'rgb(161, 227, 246)',
        'rgb(189, 129, 110)',
        'rgb(23, 90, 99)'
    ]
    editingLabels.forEach(x => {
        colors.splice(colors.indexOf(x.color), 1)
    })

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                className="outline-none text-[14px] border-white border-solid border-r flex items-center justify-center h-9 leading-9 text-center w-[120px]"
                style={{ backgroundColor: label.color }}
                disabled={!hasPerms('MANAGE:TASK')}
                ref={button}
            >
                {label.name}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="z-20 absolute right-[-10px] mt-2 w-[140px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-[C4C4C4FF]">
                    <div className="task-popover">
                        <DragDropContext onDragEnd={handleSort}>
                            <Droppable droppableId="labels">
                                {provided => (
                                    <div
                                        className="options text-[14px]"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {editingLabels.map((x, i) => {
                                            const backgroundColor =
                                                labelsEditing &&
                                                colorEditingLabel === i
                                                    ? hoverColor === null
                                                        ? x.color
                                                        : hoverColor
                                                    : x.color
                                            return (
                                                <Draggable
                                                    draggableId={x._id.toString()}
                                                    key={x._id}
                                                    index={i}
                                                    isDragDisabled={
                                                        !labelsEditing
                                                    }
                                                >
                                                    {provided => (
                                                        <div
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            className={
                                                                labelsEditing
                                                                    ? 'editing'
                                                                    : ''
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={solid(
                                                                    'grip-vertical'
                                                                )}
                                                            />
                                                            <div
                                                                style={{
                                                                    backgroundColor
                                                                }}
                                                                onClick={() =>
                                                                    handleLabelClick(
                                                                        i,
                                                                        x
                                                                    )
                                                                }
                                                            >
                                                                {labelsEditing ? (
                                                                    <FontAwesomeIcon
                                                                        icon={solid(
                                                                            'tint'
                                                                        )}
                                                                    />
                                                                ) : (
                                                                    x.name
                                                                )}
                                                            </div>
                                                            {labelsEditing ? (
                                                                <div>
                                                                    <input
                                                                        onKeyDown={e => {
                                                                            if (
                                                                                e.code ===
                                                                                'Space'
                                                                            ) {
                                                                                e.stopPropagation()
                                                                            }
                                                                        }}
                                                                        onChange={e =>
                                                                            handleEditChange(
                                                                                e,
                                                                                i
                                                                            )
                                                                        }
                                                                        value={
                                                                            editingLabels[
                                                                                i
                                                                            ]
                                                                                .name
                                                                        }
                                                                        type="text"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}
                                                            <FontAwesomeIcon
                                                                onClick={() =>
                                                                    handleEditDelete(
                                                                        x._id
                                                                    )
                                                                }
                                                                icon={solid(
                                                                    'times-circle'
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                        <div
                                            className={`${
                                                labelsEditing ? 'editing' : ''
                                            } default`}
                                            key="none"
                                            style={{
                                                backgroundColor:
                                                    'rgb(181, 188, 194)'
                                            }}
                                            onClick={handleLabelClear}
                                        ></div>
                                        {labelsEditing ? (
                                            <div
                                                className="new-label"
                                                key="new-label"
                                                style={{
                                                    backgroundColor:
                                                        colorEditingLabel === -1
                                                            ? hoverColor
                                                            : null
                                                }}
                                                onClick={addNewLabel}
                                            >
                                                New label
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <AnimateHeight
                            duration={200}
                            height={labelsEditing ? 'auto' : 0}
                        >
                            <div className="colors">
                                {colors.map(x => (
                                    <div
                                        key={x}
                                        onMouseEnter={() => setHoverColor(x)}
                                        onMouseLeave={() => setHoverColor(null)}
                                        onClick={() => addNewLabel(x)}
                                    >
                                        <div
                                            style={{ backgroundColor: x }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </AnimateHeight>

                        <div className="edit" onClick={toggleEdit}>
                            {labelsEditing ? (
                                ''
                            ) : (
                                <FontAwesomeIcon icon={solid('pen')} />
                            )}
                            <p>{labelsEditing ? 'Apply' : 'Edit Labels'}</p>
                        </div>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default TaskColumnPopover
