import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ListIcon from '../../../../styles/assets/ListIcon.tsx'
import { useAddViewMutation } from '../../../../modules/services/boardSlice.ts'
import * as React from 'react'

interface NewViewMenuProps {
    boardId: string
}

function NewViewMenu({ boardId }: NewViewMenuProps) {
    const [addView] = useAddViewMutation()

    const handleAddView = (type: string): void => {
        addView({
            boardId,
            type
        })
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="outline-none">
                    <div className="outline-none subpixel-antialiased flex justify-center items-center h-[60px] box-border cursor-pointer border-y-[3px] border-y-[white] border-solid">
                        <div className="flex justify-center items-center h-[25px] px-3 py-0 border-l-[#e9ebf1] border-l border-solid text-[#7c828d]">
                            <span className="text-sm leading-[14px] font-medium text-[#7c828d]">
                                + Add view
                            </span>
                        </div>
                    </div>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="z-[100] absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                        <Menu.Item onClick={() => handleAddView('list')}>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? 'bg-[#F3F4F6]' : ''
                                    } opacity-[.87] group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    <ListIcon />
                                    <span className="ml-2">List</span>
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default NewViewMenu
