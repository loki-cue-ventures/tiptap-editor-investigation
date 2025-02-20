import { Editor } from "@tiptap/react";

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      {/* Text formatting */}
      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strike"
        >
          S
        </button>
      </div>

      {/* Lists */}
      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Alignment */}
      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          Right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
        >
          Justify
        </button>
      </div>

      {/* Formatting */}
      <div className="toolbar-group">
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
        
        {/* Font size dropdown */}
        <select
          onChange={(e) => {
            editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()
          }}
          value={editor.getAttributes('textStyle').fontSize || '16px'}
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="30px">30</option>
          <option value="36px">36</option>
        </select>

        <input
          type="color"
          onInput={e => editor.chain().focus().setColor(e.currentTarget.value).run()}
          value={editor.getAttributes('textStyle').color}
        />
      </div>

      {/* Table controls */}
      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
          Insert Table
        </button>
        {editor.isActive('table') && (
          <>
            <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
              Add Column Before
            </button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
              Add Column After
            </button>
            <button onClick={() => editor.chain().focus().addRowBefore().run()}>
              Add Row Before
            </button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()}>
              Add Row After
            </button>
            <button onClick={() => editor.chain().focus().deleteTable().run()}>
              Delete Table
            </button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()}>
              Delete Column
            </button>
            <button onClick={() => editor.chain().focus().deleteRow().run()}>
              Delete Row
            </button>
          </>
        )}
      </div>

      {/* Undo/Redo */}
      <div className="toolbar-group">
        <button 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </button>
        <button 
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </button>
      </div>
    </div>
  );
}; 