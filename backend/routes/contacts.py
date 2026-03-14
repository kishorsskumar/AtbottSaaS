from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import sqlite3

router = APIRouter()

class Contact(BaseModel):
    id: int = None
    name: str
    email: str
    phone: str = None
    company: str = None
    notes: str = None

@router.get('/contacts', response_model=List[Contact])
def get_contacts():
    conn = sqlite3.connect('crm.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contacts')
    contacts = [Contact(id=row[0], name=row[1], email=row[2], phone=row[3], company=row[4], notes=row[5]) for row in cursor.fetchall()]
    conn.close()
    return contacts

@router.post('/contacts', response_model=Contact)
def create_contact(contact: Contact):
    conn = sqlite3.connect('crm.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO contacts (name, email, phone, company, notes) VALUES (?, ?, ?, ?, ?)', 
                   (contact.name, contact.email, contact.phone, contact.company, contact.notes))
    contact_id = cursor.lastrowid
    conn.commit()
    conn.close()
    contact.id = contact_id
    return contact