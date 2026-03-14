import { useState, useEffect } from 'react'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', status: 'new', source: '' })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const response = await fetch('/api/leads')
    const data = await response.json()
    setLeads(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
    setNewLead({ name: '', email: '', phone: '', status: 'new', source: '' })
    setShowForm(false)
    fetchLeads()
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Leads</h1>
        <button onClick={() => setShowForm(true)} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
          Add Lead
        </button>
      </div>
      
      {showForm && (
        <div className='bg-white p-6 rounded-lg shadow mb-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input type='text' placeholder='Name' value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className='w-full border rounded-md px-3 py-2' required />
            <input type='email' placeholder='Email' value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className='w-full border rounded-md px-3 py-2' required />
            <input type='text' placeholder='Phone' value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className='w-full border rounded-md px-3 py-2' />
            <select value={newLead.status} onChange={e => setNewLead({...newLead, status: e.target.value})} className='w-full border rounded-md px-3 py-2'>
              <option value='new'>New</option>
              <option value='contacted'>Contacted</option>
              <option value='qualified'>Qualified</option>
              <option value='closed'>Closed</option>
            </select>
            <input type='text' placeholder='Source' value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})} className='w-full border rounded-md px-3 py-2' />
            <div className='flex space-x-4'>
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>Save</button>
              <button type='button' onClick={() => setShowForm(false)} className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400'>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className='bg-white shadow overflow-hidden sm:rounded-md'>
        <ul className='divide-y divide-gray-200'>
          {leads.map(lead => (
            <li key={lead.id} className='px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{lead.name}</p>
                  <p className='text-sm text-gray-500'>{lead.email}</p>
                </div>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {lead.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}