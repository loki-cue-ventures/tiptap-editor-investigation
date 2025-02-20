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
import { FontSizeExtension } from '../extensions/FontSizeExtension';
// import Mathematics from '@tiptap/extension-mathematics';
// import TrackChanges from '@tiptap/extension-track-changes';
// import Comments from '@tiptap/extension-comments';
import { EditorToolbar } from './EditorToolbar';
import { format } from 'date-fns';

interface Version {
  content: string;
  timestamp: number;
  id: string;
  restoredFrom?: {
    id: string;
    timestamp: number;
  };
}

interface ContentEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

const STORAGE_KEY = 'editor-versions';

const ContentEditor = ({ initialContent, onSave }: ContentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [versions, setVersions] = useState<Version[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [{
      content: initialContent,
      timestamp: Date.now(),
      id: 'initial'
    }];
  });
  const [currentVersionId, setCurrentVersionId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const versions = JSON.parse(saved);
      return versions[versions.length - 1].id;
    }
    return 'initial';
  });
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<string | null>(null);
  const [contentBeforeEdit, setContentBeforeEdit] = useState<string | null>(null);

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
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left'
      }),
      FontFamily,
      TextStyle,
      Color,
      FontSizeExtension.configure({
        types: ['textStyle', 'paragraph', 'heading']
      }),
      
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
      (window as any).editor = editor;
      console.log('Editor available in console as window.editor');
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
  }, [versions]);

  const startEditing = () => {
    if (editor) {
      setContentBeforeEdit(editor.getHTML());
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    if (editor && contentBeforeEdit !== null) {
      editor.commands.setContent(contentBeforeEdit);
      setContentBeforeEdit(null);
      setIsEditing(false);
    }
  };

  const saveEdit = () => {
    if (editor) {
      const newVersion: Version = {
        content: editor.getHTML(),
        timestamp: Date.now(),
        id: crypto.randomUUID()
      };
      
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      onSave(newVersion.content);
      setContentBeforeEdit(null);
      setIsEditing(false);
    }
  };

  const loadVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version && editor) {
      editor.commands.setContent(version.content);
      setCurrentVersionId(versionId);
    }
  };

  const handleRestoreClick = () => {
    setVersionToRestore(currentVersionId);
    setShowRestoreDialog(true);
  };

  const isLatestVersion = currentVersionId === versions[versions.length - 1].id;

  const restoreVersion = () => {
    const version = versions.find(v => v.id === versionToRestore);
    if (version && editor) {
      const newVersion: Version = {
        content: version.content,
        timestamp: Date.now(),
        id: crypto.randomUUID(),
        restoredFrom: {
          id: version.id,
          timestamp: version.timestamp
        }
      };
      
      editor.commands.setContent(version.content);
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      setShowRestoreDialog(false);
      setVersionToRestore(null);
    }
  };

  const formatVersionLabel = (version: Version) => {
    const date = new Date(version.timestamp);
    const isToday = new Date().toDateString() === date.toDateString();
    
    // Para versiones de hoy, mostrar solo la hora
    const timeStr = format(date, 'HH:mm:ss');
    const dateStr = isToday ? 'Today' : format(date, 'MMM dd, yyyy');
    
    let label = `${dateStr} ${timeStr}`;
    
    // Añadir indicadores especiales
    if (version.id === versions[versions.length - 1].id) {
      label += ' (Latest)';
    }
    if (version.restoredFrom) {
      label += ' (Restored)';
    }
    
    return label;
  };

  const groupVersionsByDate = () => {
    const groups: { [key: string]: Version[] } = {};
    
    versions.forEach(version => {
      const date = new Date(version.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(version);
    });
    
    return groups;
  };

  return (
    <div className="content-editor">
      {isEditing && <EditorToolbar editor={editor} />}
      {!isEditing && (
        <div className="version-controls">
          <select
            value={currentVersionId}
            onChange={(e) => loadVersion(e.target.value)}
          >
            {Object.entries(groupVersionsByDate()).reverse().map(([date, dateVersions]) => (
              <optgroup key={date} label={date === new Date().toDateString() ? 'Today' : format(new Date(date), 'MMM dd, yyyy')}>
                {dateVersions.reverse().map(version => (
                  <option key={version.id} value={version.id}>
                    {formatVersionLabel(version)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button 
            onClick={handleRestoreClick}
            className={`restore-button ${isLatestVersion ? 'disabled' : ''}`}
            disabled={isLatestVersion}
            title={isLatestVersion ? 'This is the latest version' : 'Restore this version'}
          >
            {isLatestVersion ? 'Latest Version' : 'Restore This Version'}
          </button>
        </div>
      )}
      <div className="editor-buttons">
        {isEditing ? (
          <>
            <button onClick={saveEdit} className="save-button">
              Save
            </button>
            <button onClick={cancelEdit} className="cancel-edit-button">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={startEditing} className="edit-button">
            Edit
          </button>
        )}
      </div>
      
      {showRestoreDialog && (
        <div className="restore-dialog">
          <p>Do you want to restore this version? A new version will be created based on this one.</p>
          <div className="dialog-buttons">
            <button onClick={restoreVersion} className="confirm-button">Restore</button>
            <button onClick={() => setShowRestoreDialog(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
      
      <div className={`editor-container ${isEditing ? 'editing' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ContentEditor; 