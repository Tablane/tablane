import * as Popover from '@radix-ui/react-popover'
import React from 'react'
import FilterIcon from '../../../../styles/assets/FilterIcon.tsx'

export default function FilterMenu() {
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
                    className="p-6 z-[100] outline-none shadow-lg m-3 rounded-md bg-white"
                    sideOffset={5}
                >
                    <div className="w-[720px] bg-[transparent]">
                        <p className="text-[#2a2e34] text-xl font-semibold">
                            Filters
                        </p>
                        <div className="py-3 group">
                            <span className="cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium">
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

        // <div className="relative inline-block text-left">
        //     <Popover.Root>
        //         <Popover.Trigger asChild>
        //             <p>click me</p>
        //         </Popover.Trigger>
        //         <Popover.Content
        //             align="center"
        //             sideOffset={4}
        //             className={cx(
        //                 'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
        //                 'w-48 rounded-lg p-4 shadow-md md:w-56',
        //                 'bg-white dark:bg-gray-800'
        //             )}
        //         >
        //             <Popover.Arrow className="fill-current text-white dark:text-gray-800" />
        //             <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        //                 Dimensions
        //             </h3>
        //
        //             <form className="mt-4 space-y-2">
        //                 {items.map(({ id, label, defaultValue }) => {
        //                     return (
        //                         <fieldset
        //                             key={`popover-items-${id}`}
        //                             className="flex items-center"
        //                         >
        //                             {/* <legend>Choose your favorite monster</legend> */}
        //                             <label
        //                                 htmlFor={id}
        //                                 className="shrink-0 grow text-xs font-medium text-gray-700 dark:text-gray-400"
        //                             >
        //                                 {label}
        //                             </label>
        //                             <input
        //                                 id={id}
        //                                 type="text"
        //                                 defaultValue={defaultValue}
        //                                 autoComplete="given-name"
        //                                 className={cx(
        //                                     'block w-1/2 rounded-md',
        //                                     'text-xs text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600',
        //                                     'border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800',
        //                                     'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
        //                                 )}
        //                             />
        //                         </fieldset>
        //                     )
        //                 })}
        //             </form>
        //
        //             <Popover.Close
        //                 className={cx(
        //                     'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
        //                     'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
        //                 )}
        //             >
        //                 close icon
        //             </Popover.Close>
        //         </Popover.Content>
        //     </Popover.Root>
        // </div>
    )
}
