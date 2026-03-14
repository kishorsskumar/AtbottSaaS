import { useState, useEffect } from 'react'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '', notes: '' })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    const response = await fetch('/api/contacts')
    const data = await response.json()
    setContacts(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    })
    setNewContact({ name: '', email: '', phone: '', company: '', notes: '' })
    setShowForm(false)
    fetchContacts()
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Contacts</h1>
        <button onClick={() => setShowForm(true)} className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700'>
          Add Contact
        </button>
      </div>
      
      {showForm && (
        <div className='bg-white p-6 rounded-lg shadow mb-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input type='text' placeholder='Name' value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className='w-full border rounded-md px-3 py-2' required />
            <input type='email' placeholder='Email' value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} className='w-full border rounded-md px-3 py-2' required />
            <input type='text' placeholder='Phone' value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className='w-full border rounded-md px-3 py-2' />
            <input type='text' placeholder='Company' value={newContact.company} onChange={e => setNewContact({...newContact, company: e.target.value})} className='w-full border rounded-md px-3 py-2' />
            <textarea placeholder='Notes' value={newContact.notes} onChange={e => setNewContact({...newContact, notes: e.target.value})} className='w-full border rounded-md px-3 py-2' rows='3'></textarea>
            <div className='flex space-x-4'>
              <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700'>Save</button>
              <button type='button' onClick={() => setShowForm(false)} className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400'>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className='bg-white shadow overflow-hidden sm:rounded-md'>
        <ul className='divide-y divide-gray-200'>
          {contacts.map(contact => (
            <li key={contact.id} className='px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{contact.name}</p>
                  <p className='text-sm text-gray-500'>{contact.email}</p>
                  {contact.company && <p className='text-sm text-gray-500'>{contact.company}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}