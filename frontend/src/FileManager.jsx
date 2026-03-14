import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import LivePreview from './LivePreview';

export default function FileManager({ basePath = '' }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [currentPath, setCurrentPath] = useState(basePath);
  const [collabStatus, setCollabStatus] = useState('disconnected');
  const [showPreview, setShowPreview] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    fetchFiles(basePath);
  }, [basePath]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/collab/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      setCollabStatus('connected');
      console.log('Collab connected');
    };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log('Edit event', msg);
        if (msg.file === selectedFile && msg.content) {
          setContent(msg.content);
        }
      } catch (e) {
        console.log('Collab message', event.data);
      }
    };
    ws.onclose = () => setCollabStatus('disconnected');
    ws.onerror = () => setCollabStatus('error');

    return () => ws.close();
  }, []);

  const broadcastEdit = (file, newContent) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ file, content: newContent }));
    }
  };

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
    await axios.post('/ai_engine/write', { path: selectedFile, content });
    setStatus('Saved successfully');
    broadcastEdit(selectedFile, content);
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
    <div style={{ display: 'flex', height: '100%', background: '#1e1e1e', color: '#fff' }}>
      <div style={{ width: '25%', borderRight: '1px solid #333', overflowY: 'auto', padding: '10px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Project Files</h3>
        <div style={{ fontSize: 12, marginBottom: 8, color: collabStatus === 'connected' ? '#4caf50' : '#f88' }}>
          Collab: {collabStatus}
        </div>
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
        <div style={{ padding: '10px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center' }}>
          <strong>{selectedFile || 'No file selected'}</strong>
          {selectedFile && (
            <button onClick={saveFile} style={{ marginLeft: '10px', padding: '4px 12px', background: '#28a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Save
            </button>
          )}
          <span style={{ marginLeft: '10px', color: '#0f0' }}>{status}</span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{ marginLeft: 'auto', padding: '4px 12px', background: showPreview ? '#a33' : '#383', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Editor
              theme="vs-dark"
              language={getLanguage(selectedFile)}
              value={content}
              onChange={(val) => setContent(val)}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </div>
          {showPreview && (
            <div style={{ width: '40%', borderLeft: '1px solid #333' }}>
              <LivePreview url={window.location.origin} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
