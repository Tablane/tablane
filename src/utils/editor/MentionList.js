import styles from '../../styles/Editor.module.scss'
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from 'react'

export default forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = index => {
        const item = props.items[index]

        if (item) {
            props.command({ id: item.username })
        }
    }

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
        )
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                enterHandler()
                return true
            }

            return false
        }
    }))

    return (
        <div
            className={`bg-white rounded overflow-hidden px-0 py-1 w-80 ${styles.mentionItemsShadow}`}
        >
            {props.items.length ? (
                <>
                    <div className="flex px-3 mt-1 mb-2 leading-4 text-black-200 text-xs font-medium tracking-widest">
                        <span className="uppercase">People</span>
                    </div>
                    {props.items.map((item, index) => (
                        <div
                            className={`h-7 cursor-pointer mx-1 text-left rounded hover:bg-stone-700/10 text-sm flex items-center ${
                                index === selectedIndex ? 'bg-stone-700/10' : ''
                            }`}
                            key={index}
                            onClick={() => selectItem(index)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <span className="ml-2">{item.username}</span>
                        </div>
                    ))}
                </>
            ) : (
                <div className="flex px-3 mt-1 mb-2 leading-4 text-black-200 text-xs font-medium tracking-widest">
                    <span className="uppercase">No Results</span>
                </div>
            )}
        </div>
    )
})
