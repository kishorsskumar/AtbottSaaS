import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import ProjectsDashboard from './ProjectsDashboard'
import FileManager from './FileManager'
import AppBarAtbott from './AppBarAtbott'
import './index.css'

const darkTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#0d1117' } },
})

function App() {
  const [project, setProject] = React.useState("")
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {project ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <AppBarAtbott project={project} onExit={() => setProject("")} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <FileManager basePath={`projects/${project}`} />
          </div>
        </div>
      ) : (
        <ProjectsDashboard onOpen={setProject} />
      )}
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
)
