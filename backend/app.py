from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import leads, contacts

app = FastAPI(title='CRM SaaS')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(leads.router, prefix='/api')
app.include_router(contacts.router, prefix='/api')