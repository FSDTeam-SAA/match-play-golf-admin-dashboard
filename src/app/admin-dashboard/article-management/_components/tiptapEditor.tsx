// 📄 src/components/articles/TiptapEditor.tsx

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <div className="border border-gray-300 border-b-0 rounded-t-md p-2 flex flex-wrap gap-1 bg-white">
      <select
        onChange={e =>
          e.target.value
            ? editor
                .chain()
                .focus()
                .setHeading({ level: parseInt(e.target.value) as 1 | 2 | 3 })
                .run()
            : editor.chain().focus().setParagraph().run()
        }
        value={editor.getAttributes('heading').level || ''}
        className="border rounded p-1"
      >
        <option value="">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <select
        onChange={e =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
        className="border rounded p-1"
      >
        <option value="">Font</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
      >
        <strong>B</strong>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
      >
        <em>I</em>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('underline') ? 'bg-gray-200' : ''
        }`}
      >
        <u>U</u>
      </button>

      <select
        onChange={e =>
          editor.chain().focus().setTextAlign(e.target.value).run()
        }
        className="border rounded p-1"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('bulletList') ? 'bg-gray-200' : ''
        }`}
      >
        UL
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('orderedList') ? 'bg-gray-200' : ''
        }`}
      >
        OL
      </button>
    </div>
  )
}

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Enter article description...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="border border-gray-300 rounded-md flex flex-col">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto max-h-[370px]">
        <EditorContent
          editor={editor}
          className="p-4 prose max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px]"
        />
      </div>
    </div>
  )
}
