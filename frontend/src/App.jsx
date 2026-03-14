import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('/generate', { message: prompt });
      const text = res.data.content?.[0]?.text || JSON.stringify(res.data);
      setOutput(text);
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '20px',
      background: '#1e1e1e',
      color: '#fff'
    }}>
      <h2>Atbott SaaS Project Workspace</h2>
      <textarea
        placeholder="Describe what you want to build or generate..."
        style={{ flex: 1, padding: 10, fontSize: '16px', marginBottom: 10, background: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: 4 }}
        onChange={e => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        style={{ padding: 10, background: '#28a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '16px' }}
        onClick={sendPrompt}
      >
        {loading ? 'Generating...' : 'Run Prompt'}
      </button>
      <div style={{
        flex: 2,
        background: '#111',
        marginTop: 20,
        overflow: 'auto',
        padding: 10,
        borderRadius: 4
      }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>
      </div>
    </div>
  );
}
