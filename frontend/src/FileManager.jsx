import { useEffect, useState, useRef, createContext, useContext } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const FileContext = createContext();

export function FileProvider({ basePath, children }) {
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
    ws.onopen = () => setCollabStatus('connected');
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.file === selectedFile && msg.content) setContent(msg.content);
      } catch (e) {}
    };
    ws.onclose = () => setCollabStatus('disconnected');
    ws.onerror = () => setCollabStatus('error');
    return () => ws.close();
  }, []);

  const broadcastEdit = (file, newContent) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ file, content: newContent }));
    }
  };

  const fetchFiles = async (path) => {
    try {
      const res = await axios.get('/ai_engine/list', { params: { path } });
      setFiles(res.data.items || []);
      setCurrentPath(path);
    } catch { setFiles([]); }
  };

  const openFile = async (filename) => {
    const fullPath = currentPath ? `${currentPath}/${filename}` : filename;
    try {
      const res = await axios.get('/ai_engine/read', { params: { path: fullPath } });
      setSelectedFile(fullPath);
      setContent(res.data.content);
    } catch {
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

  return (
    <FileContext.Provider value={{ files, selectedFile, content, setContent, status, currentPath, collabStatus, openFile, saveFile, goUp }}>
      {children}
    </FileContext.Provider>
  );
}

export function FileTree() {
  const { files, selectedFile, currentPath, collabStatus, openFile, goUp } = useContext(FileContext);

  return (
    <div style={{ height: '100%', background: '#1e1e1e', color: '#c9d1d9', overflowY: 'auto', padding: 10, fontSize: 13 }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#8b949e', marginBottom: 8, letterSpacing: 1 }}>
        Explorer
      </div>
      <div style={{ fontSize: 10, marginBottom: 8, color: collabStatus === 'connected' ? '#3fb950' : '#f85149' }}>
        {collabStatus === 'connected' ? 'Live' : 'Offline'}
      </div>
      {currentPath && (
        <div onClick={goUp} style={{ cursor: 'pointer', padding: '4px 6px', color: '#58a6ff', borderRadius: 4 }}>
          .. (up)
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {files.map(f => (
          <li
            key={f}
            onClick={() => openFile(f)}
            style={{
              cursor: 'pointer', padding: '4px 8px', borderRadius: 4,
              background: selectedFile.endsWith(f) ? '#2d333b' : 'transparent',
              color: selectedFile.endsWith(f) ? '#fff' : '#c9d1d9',
            }}
          >
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CodeEditor() {
  const { selectedFile, content, setContent, status, saveFile } = useContext(FileContext);

  const getLanguage = (filename) => {
    if (!filename) return 'plaintext';
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

  if (!selectedFile) {
    return (
      <div style={{ height: '100%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#484f58' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{'{ }'}</div>
          <div style={{ fontSize: 14 }}>Select a file to edit</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', background: '#161b22', fontSize: 13 }}>
        <span style={{ flex: 1, color: '#c9d1d9' }}>{selectedFile.split('/').pop()}</span>
        <button onClick={saveFile} style={{ padding: '3px 12px', background: '#238636', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          Save
        </button>
        {status && <span style={{ marginLeft: 8, color: '#3fb950', fontSize: 11 }}>{status}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <Editor
          theme="vs-dark"
          language={getLanguage(selectedFile)}
          value={content}
          onChange={(val) => setContent(val)}
          options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, padding: { top: 8 } }}
        />
      </div>
    </div>
  );
}

export default function FileManager({ basePath = '' }) {
  return (
    <FileProvider basePath={basePath}>
      <div style={{ display: 'flex', height: '100%' }}>
        <FileTree />
        <CodeEditor />
      </div>
    </FileProvider>
  );
}
