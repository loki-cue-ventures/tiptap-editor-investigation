import  { useState } from 'react';
import ContentEditor from './components/ContentEditor';
import './App.css';

const LOCAL_STORAGE_KEY = 'editor-content';

function App() {
  const [content, setContent] = useState(() => {
    // Try to retrieve saved content from localStorage
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedContent || '<p>This is an AI-generated sample content that you can edit by clicking the "Edit" button.</p>';
  });

  const handleSave = (newContent: string) => {
    setContent(newContent);
    // Save to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, newContent);
    console.log('Content saved:', newContent);
  };

  return (
    <div className="App">
      <h1>AI Content Editor</h1>
      <ContentEditor 
        initialContent={content} 
        onSave={handleSave} 
      />
    </div>
  );
}

export default App; 