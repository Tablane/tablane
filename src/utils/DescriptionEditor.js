import styles from '../styles/Editor.module.scss'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Button } from '@mantine/core'
import Collaboration from '@tiptap/extension-collaboration'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import { useFetchUserQuery } from '../modules/services/userSlice'
import * as Y from 'yjs'

function Editor({
    taskId,
    type,
    content = '',
    saveComment,
    readOnly = false,
    cancelEditing
}) {
    const { data: user } = useFetchUserQuery()

    const [document] = useState(() => {
        return new Y.Doc()
    })

    const [provider] = useState(() => {
        return new HocuspocusProvider({
            document,
            url: process.env.REACT_APP_REALTIME_EDITING_WEBSOCKET,
            name: taskId
        })
    })

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: false
            }),
            Link,
            Underline,
            Color,
            Highlight,
            Placeholder.configure({
                placeholder: "Description or Type '/' for commands",
                emptyNodeClass: styles.showEmptyNodePlaceHolder
            }),
            Collaboration.configure({
                document: document
            }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: user.username,
                    color: '#4169e1'
                }
            })
        ],
        editorProps: {
            attributes: {
                class: `${styles.ProseMirror} ${styles.description}`
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
