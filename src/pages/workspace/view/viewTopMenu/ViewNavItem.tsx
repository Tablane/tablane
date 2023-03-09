import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ListIcon from '../../../../styles/assets/ListIcon.tsx'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import {
    useDeleteViewMutation,
    useRenameViewMutation
} from '../../../../modules/services/boardSlice.ts'
import useInputState from '../../../../modules/hooks/useInputState.tsx'
import { useParams } from 'react-router-dom'
import { usePopper } from '../../../../utils/usePopper.ts'

interface Props {
    boardId: string
    _id: string
    id: string
    name: string
    handleViewClick: (id: string) => void
    active: boolean
}

export default function ({
    boardId,
    _id,
    active,
    name,
    id,
    handleViewClick
}: Props) {
    const [deleteView] = useDeleteViewMutation()
    const [renameView] = useRenameViewMutation()
    const [renaming, setRenaming] = useState<boolean>(false)
    const [newName, changeNewName, , setNewName] = useInputState(name)
    const [width, setWidth] = useState<number>(100)
    const ref = useRef<HTMLSpanElement>()
    const params = useParams()

    const [trigger, container] = usePopper({
        placement: 'bottom-end',
        strategy: 'fixed',
        modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
    })

    const handleRenameClick = () => {
        setWidth(ref.current.offsetWidth)
        setRenaming(true)
    }

    const handleRename = () => {
        renameView({
            viewShortId: params.view,
            viewId: _id,
            name: newName
        })
        setRenaming(false)
    }

    const handleDelete = () => {
        deleteView({
            viewShortId: params.view,
            boardId,
            viewId: _id
        })
    }

    useEffect(() => {
        setNewName(name)
    }, [name])

    return (
        <div
            key={id}
            onClick={() => handleViewClick(id)}
            className="min-w-[0] shrink-0 subpixel-antialiased flex justify-center items-center h-[60px] box-border cursor-pointer border-y-[3px] border-y-[white] border-solid"
        >
            <div
                className={`flex justify-center items-center h-[25px] px-3 py-0 border-l-[#e9ebf1] border-l border-solid ${
                    active ? 'text-[#4169e1]' : 'text-[#7c828d]'
                }`}
            >
                <ListIcon className="h-5 w-5 mr-2" />
                {renaming ? (
                    <input
                        onKeyDown={e => {
                            if (['Enter', 'Escape'].includes(e.key))
                                e.currentTarget.blur()
                        }}
                        style={{ width: `${width}px` }}
                        onBlur={handleRename}
                        className="outline-none text-sm leading-[14px] font-medium text-[#4169e1]"
                        value={newName}
                        onChange={changeNewName}
                        autoFocus
                    />
                ) : (
                    <span
                        ref={ref}
                        className={`text-sm leading-[14px] font-medium aaa ${
                            active ? 'text-[#4169e1]' : 'text-[#7c828d]'
                        }`}
                    >
                        {name}
                    </span>
                )}
                {active && (
                    <Menu as="div">
                        <Menu.Button ref={trigger} className="outline-none">
                            <div className="ml-2">
                                <FontAwesomeIcon icon={solid('ellipsis')} />
                            </div>
                        </Menu.Button>
                        <div ref={container} className="z-10">
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="z-[100] absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-2">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className="h-8"
                                                    onClick={handleRenameClick}
                                                >
                                                    <div
                                                        className={`w-40 h-8 p-2 rounded-md mx-2 flex flex-row content-center hover:bg-gray-100 cursor-pointer ${
                                                            active
                                                                ? 'bg-[#f3f4f6]'
                                                                : 'text-gray-900'
                                                        }`}
                                                    >
                                                        <div className="text-[#656f7d] w-4 mr-2 flex content-center justify-center">
                                                            <FontAwesomeIcon
                                                                icon={solid(
                                                                    'pen'
                                                                )}
                                                            />
                                                        </div>
                                                        <p className="opacity-[.87] text-black leading-4 text-sm leading-2">
                                                            Rename
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className="h-8"
                                                    onClick={handleDelete}
                                                >
                                                    <div
                                                        className={`w-40 h-8 p-2 rounded-md mx-2 flex flex-row content-center hover:bg-gray-100 cursor-pointer ${
                                                            active
                                                                ? 'bg-[#f3f4f6]'
                                                                : 'text-gray-900'
                                                        }`}
                                                    >
                                                        <div className="w-4 mr-2 flex content-center justify-center">
                                                            <FontAwesomeIcon
                                                                icon={regular(
                                                                    'trash-alt'
                                                                )}
                                                                className="text-pink-400"
                                                            />
                                                        </div>
                                                        <p className="opacity-[.87] text-black leading-4 text-sm leading-2">
                                                            Delete
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </div>
                    </Menu>
                )}
            </div>
        </div>
    )
}
