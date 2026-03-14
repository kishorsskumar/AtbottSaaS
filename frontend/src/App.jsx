import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Leads from './pages/Leads'
import Contacts from './pages/Contacts'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <nav className='bg-white shadow-sm border-b'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='flex justify-between h-16'>
              <div className='flex items-center space-x-8'>
                <h1 className='text-xl font-bold'>CRM</h1>
                <Link to='/' className='text-gray-600 hover:text-gray-900'>Dashboard</Link>
                <Link to='/leads' className='text-gray-600 hover:text-gray-900'>Leads</Link>
                <Link to='/contacts' className='text-gray-600 hover:text-gray-900'>Contacts</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className='max-w-7xl mx-auto py-6 px-4'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/leads' element={<Leads />} />
            <Route path='/contacts' element={<Contacts />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App