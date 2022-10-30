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

function Editor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            Underline,
            Color,
            Highlight,
            Placeholder.configure({
                placeholder: "Description or Type '/' for commands",
                emptyEditorClass: styles.showEmptyEditorPlaceHolder,
                emptyNodeClass: styles.showEmptyNodePlaceHolder
            })
        ],
        editorProps: {
            attributes: {
                class: styles.ProseMirror
            }
        },
        content: `
      <strong>Try React</strong>
      <p>React has been designed from the start for gradual adoption, and you can use as little or as much React as you need. Whether you want to get a taste of React, add some interactivity to a simple HTML page, or start a complex React-powered app, the links in this section will help you get started.</p>
    `
    })

    useEffect(() => {
        if (editor) {
            editor.setEditable(true)
        }
    }, [editor])

    return (
        <>
            {editor && (
                <BubbleMenu
                    className={styles.bubbleMenu}
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                >
                    <Tooltip title="Bold" placement="top" arrow>
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
                    <Tooltip title="Italic" placement="top" arrow>
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
                    <Tooltip title="Underline" placement="top" arrow>
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
                    <Tooltip title="Strike-through" placement="top" arrow>
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
                    <Tooltip title="Mark as code" placement="top" arrow>
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
                    <Tooltip title="Text color" placement="top" arrow>
                        <div
                            className={
                                editor.isActive('color')
                                    ? `${styles.textTransformButton} ${styles.active}`
                                    : styles.textTransformButton
                            }
                            onClick={() =>
                                editor.chain().focus().toggleCode().run()
                            }
                        >
                            <FontAwesomeIcon icon={solid('a')} />
                        </div>
                    </Tooltip>
                </BubbleMenu>
            )}
            <EditorContent editor={editor} />
        </>
    )
}

export default Editor
