import { CaretSortIcon } from '@radix-ui/react-icons'
import Filter from './Filter.tsx'
import React from 'react'
import { useFetchBoardQuery } from '../../../../../modules/services/boardSlice.ts'

export default function FilterGroup({
    boardId,
    _id,
    group,
    operation,
    filters,
    index,
    removeFilter,
    setColumn,
    setValue,
    addFilter,
    filterAnd,
    toggleFilterAnd
}) {
    const { data: board } = useFetchBoardQuery(boardId)

    const handleToggleFilterAnd = () => {
        toggleFilterAnd({ group, groupId: _id })
    }

    if (group) {
        return (
            <div key={_id} className="flex flex-row mb-2">
                <div className="w-12 flex mr-3 justify-center">
                    <div
                        onClick={handleToggleFilterAnd}
                        className="select-none cursor-pointer overflow-hidden rounded border-[#d6d9de] text-xs border flex flex-row h-6 w-full flex justify-center items-center"
                    >
                        <div
                            className={`flex flex-col h-12 transition-all duration-500 relative ${
                                filterAnd ? 'top-[12px]' : 'top-[-12px]'
                            }`}
                        >
                            <div className="flex justify-center items-center pl-1 h-6 font-medium">
                                <span>OR</span>
                            </div>
                            <div className="flex justify-center items-center pl-1 h-6 font-medium">
                                <span>AND</span>
                            </div>
                        </div>
                        <CaretSortIcon />
                    </div>
                </div>
                <div className="border-l-2 border-[#e8eaed] pl-[10px] flex-grow">
                    {filters.map(
                        (
                            {
                                value,
                                column,
                                operation,
                                _id: filterId,
                                filterAnd
                            },
                            index
                        ) => (
                            <Filter
                                _id={filterId}
                                key={filterId}
                                groupId={_id}
                                value={value}
                                removeFilter={removeFilter}
                                index={index}
                                column={column}
                                setColumn={setColumn}
                                setValue={setValue}
                                filterAnd={filterAnd}
                                toggleFilterAnd={toggleFilterAnd}
                                people={board.attributes}
                                filterTypes={[
                                    'Is',
                                    'Is not',
                                    'Is set',
                                    'Is not set'
                                ]}
                            />
                        )
                    )}
                    <div>
                        <span
                            onClick={() => addFilter(false, _id)}
                            className="cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium"
                        >
                            + Add filter
                        </span>
                    </div>
                </div>
            </div>
        )
    } else {
        const {
            value,
            operation,
            column,
            _id: filterId,
            filterAnd
        } = filters[0]
        return (
            <Filter
                _id={filterId}
                groupId={_id}
                value={value}
                removeFilter={removeFilter}
                key={index}
                index={index}
                column={column}
                setColumn={setColumn}
                setValue={setValue}
                filterAnd={filterAnd}
                toggleFilterAnd={toggleFilterAnd}
                people={board.attributes}
                filterTypes={['Is', 'Is not', 'Is set', 'Is not set']}
            />
        )
    }
}
