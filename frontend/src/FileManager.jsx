import { useEffect, useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    fetchFiles('');
  }, []);

  const fetchFiles = async (path) => {
    const res = await axios.get('/ai_engine/list', { params: { path } });
    setFiles(res.data.items);
    setCurrentPath(path);
  };

  const openFile = async (filename) => {
    const fullPath = currentPath ? `${currentPath}/${filename}` : filename;
    try {
      const res = await axios.get('/ai_engine/read', { params: { path: fullPath } });
      setSelectedFile(fullPath);
      setContent(res.data.content);
    } catch (err) {
      fetchFiles(fullPath);
    }
  };

  const saveFile = async () => {
    await axios.post('/ai_engine/write', {
      path: selectedFile,
      content
    });
    setStatus('Saved successfully');
    setTimeout(() => setStatus(''), 2000);
  };

  const goUp = () => {
    const parent = currentPath.split('/').slice(0, -1).join('/');
    fetchFiles(parent);
  };

  const getLanguage = (filename) => {
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'yaml';
    if (filename.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1e1e1e', color: '#fff' }}>
      <div style={{ width: '25%', borderRight: '1px solid #333', overflowY: 'auto', padding: '10px' }}>
        <h3>Project Files</h3>
        {currentPath && (
          <div onClick={goUp} style={{ cursor: 'pointer', padding: '4px 0', color: '#88f' }}>
            .. (go up)
          </div>
        )}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map(f => (
            <li key={f} onClick={() => openFile(f)} style={{ cursor: 'pointer', padding: '4px 0' }}>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #333' }}>
          <strong>{selectedFile || 'No file selected'}</strong>
          {selectedFile && (
            <button onClick={saveFile} style={{ marginLeft: '10px', padding: '4px 12px', background: '#28a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Save
            </button>
          )}
          <span style={{ marginLeft: '10px', color: '#0f0' }}>{status}</span>
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            theme="vs-dark"
            language={getLanguage(selectedFile)}
            value={content}
            onChange={(val) => setContent(val)}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
      </div>
    </div>
  );
}
