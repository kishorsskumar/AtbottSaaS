import React from 'react'
import ReactDOM from 'react-dom/client'
import ProjectsDashboard from './ProjectsDashboard'
import FileManager from './FileManager'
import './index.css'

function App() {
  const [project, setProject] = React.useState("")
  return project
    ? <FileManager basePath={`projects/${project}`} onBack={() => setProject("")} />
    : <ProjectsDashboard onOpen={setProject} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App/></React.StrictMode>,
)
