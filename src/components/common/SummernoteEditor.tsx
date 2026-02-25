import { useMemo } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

interface RichTextEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  height?: number
  disabled?: boolean
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link', 'image'],
  ['blockquote', 'code-block'],
  ['clean'],
]

export function SummernoteEditor({
  value = '',
  onChange,
  placeholder = '',
  height = 300,
  disabled = false,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR_OPTIONS,
    }),
    []
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'align',
    'link',
    'image',
    'blockquote',
    'code-block',
  ]

  const handleChange = (content: string) => {
    const isEmpty = content === '<p><br></p>' || content === '<p></p>'
    onChange?.(isEmpty ? '' : content)
  }

  return (
    <div
      className="quill-wrapper"
      style={{ '--quill-height': `${height}px` } as React.CSSProperties}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
      <style>{`
        .quill-wrapper .ql-container {
          min-height: var(--quill-height);
          font-size: 14px;
        }
        .quill-wrapper .ql-editor {
          min-height: var(--quill-height);
        }
        .quill-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: hsl(210 40% 96.1%);
        }
        .quill-wrapper .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .quill-wrapper .ql-disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
