import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function FileManager({ basePath = '' }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [currentPath, setCurrentPath] = useState(basePath);
  const [collabStatus, setCollabStatus] = useState('disconnected');
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
    };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.file === selectedFile && msg.content) {
          setContent(msg.content);
        }
      } catch (e) {}
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
    setStatus('Saved');
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
      <div style={{ width: '100%', overflowY: 'auto', padding: '10px' }}>
        <div style={{ fontSize: 11, marginBottom: 6, color: collabStatus === 'connected' ? '#4caf50' : '#f88' }}>
          {collabStatus === 'connected' ? 'Live' : 'Offline'}
        </div>
        {currentPath && (
          <div onClick={goUp} style={{ cursor: 'pointer', padding: '3px 0', color: '#88f', fontSize: 13 }}>
            .. (up)
          </div>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {files.map(f => (
            <li
              key={f}
              onClick={() => openFile(f)}
              style={{
                cursor: 'pointer', padding: '4px 6px', fontSize: 13, borderRadius: 4,
                background: selectedFile.endsWith(f) ? '#333' : 'transparent'
              }}
            >
              {f}
            </li>
          ))}
        </ul>
        {selectedFile && (
          <div style={{ marginTop: 12, borderTop: '1px solid #333', paddingTop: 8 }}>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1 }}>{selectedFile}</span>
              <button onClick={saveFile} style={{ padding: '2px 10px', background: '#16A0C6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                Save
              </button>
              {status && <span style={{ marginLeft: 6, color: '#4caf50', fontSize: 11 }}>{status}</span>}
            </div>
            <div style={{ height: 300 }}>
              <Editor
                theme="vs-dark"
                language={getLanguage(selectedFile)}
                value={content}
                onChange={(val) => setContent(val)}
                options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: 'on' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
