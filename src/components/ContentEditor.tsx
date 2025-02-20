import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import './ContentEditor.css';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import History from '@tiptap/extension-history';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
// import Mathematics from '@tiptap/extension-mathematics';
// import TrackChanges from '@tiptap/extension-track-changes';
// import Comments from '@tiptap/extension-comments';
import { EditorToolbar } from './EditorToolbar';

interface ContentEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

const ContentEditor = ({ initialContent, onSave }: ContentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      // Basic structure
      Document,
      Paragraph,
      Text,
      
      // Headings
      Heading.configure({
        levels: [1, 2, 3, 4]
      }),
      
      // Text formatting
      Bold,
      Italic,
      Underline,
      Strike,
      Subscript,
      Superscript,
      
      // Tables
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'financial-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      
      // Lists
      BulletList,
      OrderedList,
      ListItem,
      
      // Useful elements
      HorizontalRule,
      History,  // Undo/Redo
      
      // Special features
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      FontFamily,
      TextStyle,
      Color,
      
      // Para fórmulas financieras
      // Mathematics,
      
      // // Para comentarios y revisiones
      // TrackChanges,
      // Comments
    ],
    content: initialContent,
    editable: false,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing && editor) {
      onSave(editor.getHTML());
    }
  };

  return (
    <div className="content-editor">
      {isEditing && <EditorToolbar editor={editor} />}
      <button 
        onClick={toggleEdit}
        className="edit-button"
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
      <div className={`editor-container ${isEditing ? 'editing' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ContentEditor; 