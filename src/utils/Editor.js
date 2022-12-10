import styles from '../styles/Editor.module.scss'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import { Tooltip } from '@mui/material'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Placeholder } from '@tiptap/extension-placeholder'
import DisableEnter from './editor/Extensions'
import { Button } from '@mantine/core'

function Editor({
    type,
    content = '',
    saveComment,
    readOnly = false,
    cancelEditing
}) {
    const getPlaceholder = x => {
        switch (x) {
            case 'description':
                return "Description or Type '/' for commands"
            case 'comment':
                return "Comment or Type '/' for commands"
            default:
                return ''
        }
    }
    const getClass = x => {
        switch (x) {
            case 'description':
                return `${styles.ProseMirror} ${styles.description}`
            case 'comment':
                return `${styles.ProseMirror} ${styles.comment}`
            case 'comment-edit':
                return `${styles.ProseMirror} ${styles.commendEdit}`
            default:
                return ''
        }
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            DisableEnter.configure({
                type,
                saveComment
            }),
            Link,
            Underline,
            Color,
            Highlight,
            Placeholder.configure({
                placeholder: getPlaceholder(type),
                emptyNodeClass: styles.showEmptyNodePlaceHolder
            })
        ],
        editorProps: {
            attributes: {
                class: getClass(type)
            }
        },
        content
    })

    useEffect(() => {
        if (editor) {
            editor.setEditable(true)
            if (readOnly) editor.setEditable(false)
        }
    }, [editor])

    return (
        <div>
            {editor && !readOnly && (
                <BubbleMenu
                    className={styles.bubbleMenu}
                    editor={editor}
                    tippyOptions={{
                        duration: 100
                    }}
                >
                    <Tooltip
                        disableInteractive
                        title="Bold"
                        placement="top"
                        arrow
                    >
                        <div
                            className={
                                editor.isActive('bold')
                                    ? `${styles.textTransformButton} ${styles.active}`
                                    : styles.textTransformButton
                            }
                            onClick={() =>
                                editor.chain().focus().toggleBold().run()
                            }
                        >
                            <FontAwesomeIcon icon={solid('bold')} />
                        </div>
                    </Tooltip>
                    <Tooltip
                        disableInteractive
                        title="Italic"
                        placement="top"
                        arrow
                    >
                        <div
                            className={
                                editor.isActive('italic')
                                    ? `${styles.textTransformButton} ${styles.active}`
                                    : styles.textTransformButton
                            }
                            onClick={() =>
                                editor.chain().focus().toggleItalic().run()
                            }
                        >
                            <FontAwesomeIcon icon={solid('italic')} />
                        </div>
                    </Tooltip>
                    <Tooltip
                        disableInteractive
                        title="Underline"
                        placement="top"
                        arrow
                    >
                        <div
                            className={
                                editor.isActive('underline')
                                    ? `${styles.textTransformButton} ${styles.active}`
                                    : styles.textTransformButton
                            }
                            onClick={() =>
                                editor.chain().focus().toggleUnderline().run()
                            }
                        >
                            <FontAwesomeIcon icon={solid('underline')} />
                        </div>
                    </Tooltip>
                    <Tooltip
                        disableInteractive
                        title="Strike-through"
                        placement="top"
                        arrow
                    >
                        <div
                            className={
                                editor.isActive('strike')
                                    ? `${styles.textTransformButton} ${styles.active}`
                                    : styles.textTransformButton
                            }
                            onClick={() =>
                                editor.chain().focus().toggleStrike().run()
                            }
                        >
                            <FontAwesomeIcon icon={solid('strikethrough')} />
                        </div>
                    </Tooltip>
                    <Tooltip
                        disableInteractive
                        title="Mark as code"
                        placement="top"
                        arrow
                    >
                        <div
                            className={
                                editor.isActive('code')
                                    ? `${styles.textTransformButton} ${styles.active}`
                                    : styles.textTransformButton
                            }
                            onClick={() =>
                                editor.chain().focus().toggleCode().run()
                            }
                        >
                            <FontAwesomeIcon icon={solid('code')} />
                        </div>
                    </Tooltip>
                </BubbleMenu>
            )}
            <EditorContent editor={editor} />
            {type === 'comment-edit' && (
                <div className={styles.commentEditingButtons}>
                    <Button
                        size="xs"
                        variant="outline"
                        color="gray"
                        uppercase
                        onClick={cancelEditing}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="xs"
                        color="indigo"
                        uppercase
                        onClick={() => saveComment(editor)}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Editor
