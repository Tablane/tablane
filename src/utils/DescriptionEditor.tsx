import styles from '../styles/Editor.module.scss'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { CircularProgress, Tooltip } from '@mui/material'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Placeholder } from '@tiptap/extension-placeholder'
import Collaboration from '@tiptap/extension-collaboration'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useFetchUserQuery } from '../modules/services/userSlice'
import * as Y from 'yjs'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import { Mention } from '@tiptap/extension-mention'
import suggestion from './editor/suggestion'
import { useFetchWorkspaceQuery } from '../modules/services/workspaceSlice'
import { useParams } from 'react-router-dom'
import useEffectOnce from '../modules/hooks/useEffectOnce.ts'

interface Props {
    taskId: string
    readOnly: boolean
}

function Editor({ taskId, readOnly = false }: Props) {
    const params = useParams()
    const { data: user } = useFetchUserQuery()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [status, setStatus] = useState(null)

    const [document] = useState(() => {
        return new Y.Doc()
    })

    const [provider] = useState(() => {
        return new HocuspocusProvider({
            document,
            url: process.env.REACT_APP_REALTIME_EDITING_WEBSOCKET,
            name: taskId,
            token: localStorage.getItem('access_token'),
            onStatus: status => setStatus(status.status)
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
                // placeholder: "Description or Type '/' for commands",
                placeholder: 'Type your Description',
                emptyNodeClass: styles.showEmptyNodePlaceHolder
            }),
            Collaboration.configure({
                document
            }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: user.username,
                    color: '#4169e1'
                }
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: styles.mention
                },
                suggestion: suggestion(workspace.members)
            })
        ],
        editorProps: {
            attributes: {
                class: `${styles.ProseMirror} ${styles.description}`
            }
        }
    })

    useEffect(() => {
        if (status === 'connected') {
            editor?.setEditable(true)
        } else {
            editor?.setEditable(false)
        }
    }, [editor])

    useEffectOnce(() => {
        return () => {
            provider.disconnect()
        }
    })

    useEffect(() => {
        if (status === 'connected') {
            editor?.setEditable(true)
        } else {
            editor?.setEditable(false)
        }
    }, [status])

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

            <div
                className={`relative ${
                    status !== 'connected' ? 'opacity-50' : ''
                }`}
            >
                {status !== 'connected' && (
                    <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
                        <CircularProgress size="15px" />
                    </div>
                )}
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default Editor
