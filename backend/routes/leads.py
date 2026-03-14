from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import sqlite3

router = APIRouter()

class Lead(BaseModel):
    id: int = None
    name: str
    email: str
    phone: str = None
    status: str = 'new'
    source: str = None

@router.get('/leads', response_model=List[Lead])
def get_leads():
    conn = sqlite3.connect('crm.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM leads')
    leads = [Lead(id=row[0], name=row[1], email=row[2], phone=row[3], status=row[4], source=row[5]) for row in cursor.fetchall()]
    conn.close()
    return leads

@router.post('/leads', response_model=Lead)
def create_lead(lead: Lead):
    conn = sqlite3.connect('crm.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO leads (name, email, phone, status, source) VALUES (?, ?, ?, ?, ?)', 
                   (lead.name, lead.email, lead.phone, lead.status, lead.source))
    lead_id = cursor.lastrowid
    conn.commit()
    conn.close()
    lead.id = lead_id
    return lead

@router.put('/leads/{lead_id}')
def update_lead(lead_id: int, lead: Lead):
    conn = sqlite3.connect('crm.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE leads SET name=?, email=?, phone=?, status=?, source=? WHERE id=?',
                   (lead.name, lead.email, lead.phone, lead.status, lead.source, lead_id))
    conn.commit()
    conn.close()
    return {'message': 'Lead updated'}