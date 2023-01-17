import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'
import FilterIcon from '../../../../styles/assets/FilterIcon.tsx'
import Filter from './filterMenu/Filter.tsx'
import { useFetchBoardQuery } from '../../../../modules/services/boardSlice.ts'
import produce from 'immer'

export default function FilterMenu({ boardId }) {
    const { data: board } = useFetchBoardQuery(boardId)
    const [filters, setFilters] = useState([
        {
            column: null,
            type: null,
            value: null
        }
    ])

    const getMappedFilter = () => {
        const mappedFilter = {
            $and: []
        }
        filters
            .filter(x => !!x.value?._id)
            .map(x => x.value._id)
            .map(x => {
                mappedFilter.$and.push({
                    'option.value': x
                })
            })
        return mappedFilter
    }

    console.log({
        filters,
        mappedFilters: getMappedFilter()
    })

    const setColumn = (column, i) => {
        setFilters(
            produce(filters, draft => {
                draft[i].column = column
            })
        )
    }

    const setValue = (value, i) => {
        setFilters(
            produce(filters, draft => {
                if (draft[i]) draft[i].value = value
            })
        )
    }

    const addFilter = () => {
        setFilters([
            ...filters,
            {
                column: null,
                type: null,
                value: null
            }
        ])
    }

    const removeFilter = i => {
        setFilters(
            produce(filters, draft => {
                draft.splice(i, 1)
            })
        )
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <div className="group-by text-[#53575e]">
                    <FilterIcon />
                    <p className="text-[#333333]">Filter</p>
                </div>
            </Popover.Trigger>
            <Popover.Portal className="z-[1300] radix-portal">
                <Popover.Content
                    className="p-6 pb-2 z-[100] outline-none shadow-lg m-3 rounded-md bg-white"
                    sideOffset={5}
                >
                    <div className="w-[720px] bg-[transparent]">
                        <p className="text-[#2a2e34] text-xl font-semibold">
                            Filters
                        </p>
                        <div className="text-sm mt-4 text-[#2a2e34]">
                            {filters.map(({ column, value }, i) => (
                                <Filter
                                    value={value}
                                    removeFilter={removeFilter}
                                    key={i}
                                    index={i}
                                    column={column}
                                    setColumn={setColumn}
                                    setValue={setValue}
                                    people={board.attributes}
                                    filterTypes={[
                                        'Is',
                                        'Is not',
                                        'Is set',
                                        'Is not set'
                                    ]}
                                />
                            ))}
                        </div>
                        <div className="py-3 group">
                            <span
                                onClick={addFilter}
                                className="cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium"
                            >
                                + Add filter
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium">
                                + Add group
                            </span>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
