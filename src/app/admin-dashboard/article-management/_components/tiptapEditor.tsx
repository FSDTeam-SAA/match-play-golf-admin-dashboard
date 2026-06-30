// 📄 src/components/articles/TiptapEditor.tsx

'use client'

import './tiptapEditor.css'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEffect, useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  Check,
  Type,
  Globe,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Link Popover Component
   ───────────────────────────────────────────── */

interface LinkPopoverProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string, text: string, openInNewTab: boolean) => void
  initialUrl?: string
  initialText?: string
  position: { top: number; left: number }
  mode: 'add' | 'edit'
}

function LinkPopover({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialText = '',
  position,
  mode,
}: LinkPopoverProps) {
  const [url, setUrl] = useState(initialUrl)
  const [text, setText] = useState(initialText)
  const [openInNewTab, setOpenInNewTab] = useState(true)
  const [urlError, setUrlError] = useState('')
  const popoverRef = useRef<HTMLDivElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUrl(initialUrl)
    setText(initialText)
    setUrlError('')
  }, [initialUrl, initialText, isOpen])

  useEffect(() => {
    if (isOpen && urlInputRef.current) {
      setTimeout(() => urlInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setUrlError('URL is required')
      return false
    }
    // Allow common URL patterns
    const urlPattern =
      /^(https?:\/\/|www\.|mailto:|tel:|\/|#).*/i
    if (!urlPattern.test(value.trim())) {
      setUrlError('Please enter a valid URL (e.g. https://example.com)')
      return false
    }
    setUrlError('')
    return true
  }

  const handleSubmit = () => {
    if (!validateUrl(url)) return

    let finalUrl = url.trim()
    // Auto-prepend https:// if URL starts with www.
    if (finalUrl.startsWith('www.')) {
      finalUrl = 'https://' + finalUrl
    }

    onSubmit(finalUrl, text.trim(), openInNewTab)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className="tiptap-link-popover"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Header */}
      <div className="tiptap-link-popover__header">
        <div className="tiptap-link-popover__header-left">
          <LinkIcon size={15} />
          <span>{mode === 'add' ? 'Insert Link' : 'Edit Link'}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="tiptap-link-popover__close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="tiptap-link-popover__body">
        {/* URL Field */}
        <div className="tiptap-link-popover__field">
          <label className="tiptap-link-popover__label">
            <ExternalLink size={13} />
            URL
          </label>
          <input
            ref={urlInputRef}
            type="text"
            value={url}
            onChange={e => {
              setUrl(e.target.value)
              if (urlError) setUrlError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="https://www.matchplaygolf.co.uk"
            className={`tiptap-link-popover__input ${urlError ? 'tiptap-link-popover__input--error' : ''}`}
          />
          {urlError && (
            <span className="tiptap-link-popover__error">{urlError}</span>
          )}
        </div>

        {/* Display Text Field */}
        <div className="tiptap-link-popover__field">
          <label className="tiptap-link-popover__label">
            <Type size={13} />
            Display Text
            <span className="tiptap-link-popover__optional">(optional)</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Link text to display"
            className="tiptap-link-popover__input"
          />
        </div>

        {/* Open in new tab toggle */}
        <label className="tiptap-link-popover__checkbox-label">
          <input
            type="checkbox"
            checked={openInNewTab}
            onChange={e => setOpenInNewTab(e.target.checked)}
            className="tiptap-link-popover__checkbox"
          />
          <span>Open in new tab</span>
        </label>
      </div>

      {/* Footer */}
      <div className="tiptap-link-popover__footer">
        <button
          type="button"
          onClick={onClose}
          className="tiptap-link-popover__btn tiptap-link-popover__btn--cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="tiptap-link-popover__btn tiptap-link-popover__btn--submit"
        >
          <Check size={14} />
          {mode === 'add' ? 'Insert Link' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Toolbar Button Component
   ───────────────────────────────────────────── */

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
  className?: string
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
  className = '',
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`tiptap-toolbar__btn ${isActive ? 'tiptap-toolbar__btn--active' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────
   Toolbar Divider
   ───────────────────────────────────────────── */

function ToolbarDivider() {
  return <div className="tiptap-toolbar__divider" />
}

/* ─────────────────────────────────────────────
   Main Toolbar Component
   ───────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Toolbar = ({ editor }: { editor: any }) => {
  const [linkPopover, setLinkPopover] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    url: string
    text: string
    position: { top: number; left: number }
  }>({
    isOpen: false,
    mode: 'add',
    url: '',
    text: '',
    position: { top: 0, left: 0 },
  })

  const toolbarRef = useRef<HTMLDivElement>(null)

  if (!editor) return null

  const openLinkPopover = (mode: 'add' | 'edit' = 'add') => {
    let url = ''
    let text = ''

    if (mode === 'edit' && editor.isActive('link')) {
      url = editor.getAttributes('link').href || ''
      const { from, to } = editor.state.selection
      text = editor.state.doc.textBetween(from, to, ' ')
    } else {
      const { from, to } = editor.state.selection
      text = editor.state.doc.textBetween(from, to, ' ')
    }

    // Position below toolbar
    const toolbarEl = toolbarRef.current
    const pos = {
      top: toolbarEl ? toolbarEl.offsetHeight + 4 : 40,
      left: 0,
    }

    setLinkPopover({
      isOpen: true,
      mode,
      url,
      text,
      position: pos,
    })
  }

  const handleLinkSubmit = (
    url: string,
    text: string,
    openInNewTab: boolean,
  ) => {
    const attrs = {
      href: url,
      target: openInNewTab ? '_blank' : null,
      rel: openInNewTab ? 'noopener noreferrer' : null,
    }

    if (text) {
      // If display text is provided, replace selection or insert
      const { from, to } = editor.state.selection
      if (from === to) {
        // No selection – insert the link text
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${url}" ${openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`)
          .run()
      } else {
        // Has selection – apply link to selection
        editor.chain().focus().setLink(attrs).run()
      }
    } else {
      // No display text – just set link on selection
      editor.chain().focus().setLink(attrs).run()
    }

    setLinkPopover(prev => ({ ...prev, isOpen: false }))
  }

  const handleCloseLinkPopover = () => {
    setLinkPopover(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <div ref={toolbarRef} className="tiptap-toolbar" style={{ position: 'relative' }}>
      {/* Text Type Selector */}
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
        className="tiptap-toolbar__select"
      >
        <option value="">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      {/* Font Selector */}
      <select
        onChange={e =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
        className="tiptap-toolbar__select"
      >
        <option value="">Font</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>

      <ToolbarDivider />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title="Justify"
      >
        <AlignJustify size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Link Button */}
      <ToolbarButton
        onClick={() => {
          if (editor.isActive('link')) {
            openLinkPopover('edit')
          } else {
            openLinkPopover('add')
          }
        }}
        isActive={editor.isActive('link')}
        title="Insert Link (Ctrl+K)"
        className="tiptap-toolbar__btn--link"
      >
        <LinkIcon size={16} />
      </ToolbarButton>

      {/* Unlink Button (only visible when link is active) */}
      {editor.isActive('link') && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove Link"
          className="tiptap-toolbar__btn--unlink"
        >
          <Unlink size={16} />
        </ToolbarButton>
      )}

      {/* Link Popover */}
      <LinkPopover
        isOpen={linkPopover.isOpen}
        onClose={handleCloseLinkPopover}
        onSubmit={handleLinkSubmit}
        initialUrl={linkPopover.url}
        initialText={linkPopover.text}
        position={linkPopover.position}
        mode={linkPopover.mode}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Floating Link Tooltip (appears on cursor in link)
   ───────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FloatingLinkTooltip({ editor }: { editor: any }) {
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean
    href: string
    position: { top: number; left: number }
  }>({
    visible: false,
    href: '',
    position: { top: 0, left: 0 },
  })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return

    const updateTooltip = () => {
      if (editor.isActive('link')) {
        const href = editor.getAttributes('link').href || ''
        // Get cursor position
        const { from } = editor.state.selection
        const coords = editor.view.coordsAtPos(from)
        const editorEl = editor.view.dom.closest('.tiptap-editor-wrapper')
        if (editorEl) {
          const editorRect = editorEl.getBoundingClientRect()
          setTooltipState({
            visible: true,
            href,
            position: {
              top: coords.bottom - editorRect.top + 6,
              left: coords.left - editorRect.left,
            },
          })
        }
      } else {
        setTooltipState(prev => ({ ...prev, visible: false }))
      }
    }

    editor.on('selectionUpdate', updateTooltip)
    editor.on('transaction', updateTooltip)

    return () => {
      editor.off('selectionUpdate', updateTooltip)
      editor.off('transaction', updateTooltip)
    }
  }, [editor])

  if (!tooltipState.visible || !tooltipState.href) return null

  return (
    <div
      ref={tooltipRef}
      className="tiptap-floating-tooltip"
      style={{
        top: tooltipState.position.top,
        left: tooltipState.position.left,
      }}
    >
      <Globe size={12} className="tiptap-floating-tooltip__icon" />
      <a
        href={tooltipState.href}
        target="_blank"
        rel="noopener noreferrer"
        className="tiptap-floating-tooltip__url"
        title={tooltipState.href}
      >
        {tooltipState.href.length > 45
          ? tooltipState.href.slice(0, 45) + '…'
          : tooltipState.href}
      </a>
      <div className="tiptap-floating-tooltip__divider" />
      <button
        type="button"
        className="tiptap-floating-tooltip__btn"
        title="Edit Link"
        onClick={() => {
          const url = editor.getAttributes('link').href || ''
          const newUrl = prompt('Edit link URL:', url)
          if (newUrl !== null) {
            if (newUrl === '') {
              editor.chain().focus().unsetLink().run()
            } else {
              let finalUrl = newUrl.trim()
              if (finalUrl.startsWith('www.')) {
                finalUrl = 'https://' + finalUrl
              }
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: finalUrl, target: '_blank' })
                .run()
            }
          }
        }}
      >
        <Pencil size={12} />
      </button>
      <button
        type="button"
        className="tiptap-floating-tooltip__btn tiptap-floating-tooltip__btn--danger"
        title="Remove Link"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main TiptapEditor Component
   ───────────────────────────────────────────── */

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
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
          class: 'tiptap-link',
        },
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

  // Keyboard shortcut for link: Ctrl+K
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Trigger the link button click programmatically
        const linkBtn = document.querySelector(
          '.tiptap-toolbar__btn--link',
        ) as HTMLButtonElement
        if (linkBtn) linkBtn.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  return (
    <div className="tiptap-editor-wrapper" style={{ position: 'relative' }}>
      <Toolbar editor={editor} />
      <div className="tiptap-editor__content-area">
        <EditorContent
          editor={editor}
          className="tiptap-editor__content"
        />
      </div>
      {editor && <FloatingLinkTooltip editor={editor} />}
    </div>
  )
}
