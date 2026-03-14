import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, contacts: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(r => r.json()),
      fetch('/api/contacts').then(r => r.json())
    ]).then(([leads, contacts]) => {
      setStats({ leads: leads.length, contacts: contacts.length })
    })
  }, [])

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-medium text-gray-900'>Total Leads</h3>
          <p className='text-3xl font-bold text-blue-600'>{stats.leads}</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-medium text-gray-900'>Total Contacts</h3>
          <p className='text-3xl font-bold text-green-600'>{stats.contacts}</p>
        </div>
      </div>
    </div>
  )
}