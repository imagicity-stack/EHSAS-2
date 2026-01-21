from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'ehsas-super-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# SMTP Settings
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
SMTP_FROM_EMAIL = os.environ.get('SMTP_FROM_EMAIL', 'ehsas@eldenheights.org')
SMTP_FROM_NAME = os.environ.get('SMTP_FROM_NAME', 'EHSAS - Elden Heights School Alumni Society')

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# =============================================================================
# MODELS
# =============================================================================

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: str
    email: str
    role: str
    token: str

class AlumniRegistration(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str
    year_of_joining: int
    year_of_leaving: int
    class_of_joining: str
    last_class_studied: str
    last_house: str
    full_address: str
    city: str
    pincode: str
    state: str
    country: str
    profession: Optional[str] = ""
    organization: Optional[str] = ""

class Alumni(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str
    year_of_joining: int
    year_of_leaving: int
    class_of_joining: str
    last_class_studied: str
    last_house: str
    full_address: str
    city: str
    pincode: str
    state: str
    country: str
    profession: str = ""
    organization: str = ""
    status: str = "pending"  # pending, approved, rejected
    ehsas_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved_at: Optional[datetime] = None

class AlumniResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    first_name: str
    last_name: str
    email: str
    mobile: str
    year_of_joining: int
    year_of_leaving: int
    class_of_joining: str
    last_class_studied: str
    last_house: str
    city: str
    state: str
    country: str
    profession: str
    organization: str
    status: str
    ehsas_id: Optional[str]
    created_at: str
    approved_at: Optional[str]

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_type: str  # reunion, webinar, campus, meetup
    date: str
    time: str
    location: str
    image_url: Optional[str] = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    event_type: str
    date: str
    time: str
    location: str
    image_url: Optional[str] = ""

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # registration, approval, event
    title: str
    message: str
    alumni_id: Optional[str] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SpotlightAlumni(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    batch: str
    profession: str
    achievement: str
    category: str  # founder, doctor, civil_servant, creator, corporate
    image_url: Optional[str] = ""
    is_featured: bool = True

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def create_jwt_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload

def generate_ehsas_id(year_of_leaving: int, count: int) -> str:
    # Format: EH<Last 2 digits of YearOfLeaving><4 digit incremental counter>
    # Example: EH190042
    year_suffix = str(year_of_leaving)[-2:]
    return f"EH{year_suffix}{str(count).zfill(4)}"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# =============================================================================
# AUTH ROUTES
# =============================================================================

@api_router.post("/auth/admin/login", response_model=AdminResponse)
async def admin_login(login: AdminLogin):
    admin = await db.admins.find_one({"email": login.email}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({"id": admin["id"], "email": admin["email"], "role": "admin"})
    
    return AdminResponse(
        id=admin["id"],
        email=admin["email"],
        role="admin",
        token=token
    )

# =============================================================================
# ALUMNI ROUTES
# =============================================================================

@api_router.post("/alumni/register", status_code=201)
async def register_alumni(data: AlumniRegistration):
    # Check if email already exists
    existing = await db.alumni.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    alumni = Alumni(**data.model_dump())
    doc = alumni.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.alumni.insert_one(doc)
    
    # Create notification for admin
    notification = Notification(
        type="registration",
        title="New Alumni Registration",
        message=f"{data.first_name} {data.last_name} ({data.email}) has registered from batch {data.year_of_leaving}",
        alumni_id=alumni.id
    )
    notif_doc = notification.model_dump()
    notif_doc['created_at'] = notif_doc['created_at'].isoformat()
    await db.notifications.insert_one(notif_doc)
    
    # Mock: Send email to ehsas@eldenheights.org
    logger.info(f"[MOCK EMAIL] To: ehsas@eldenheights.org - New registration from {data.email}")
    
    return {"message": "Registration submitted successfully. You will receive confirmation once approved.", "id": alumni.id}

@api_router.get("/alumni", response_model=List[AlumniResponse])
async def get_alumni(
    batch: Optional[int] = None,
    profession: Optional[str] = None,
    city: Optional[str] = None,
    status: Optional[str] = "approved"
):
    query = {}
    if batch:
        query["year_of_leaving"] = batch
    if profession:
        query["profession"] = {"$regex": profession, "$options": "i"}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if status:
        query["status"] = status
    
    alumni_list = await db.alumni.find(query, {"_id": 0}).to_list(1000)
    
    result = []
    for a in alumni_list:
        a['created_at'] = a['created_at'] if isinstance(a['created_at'], str) else a['created_at'].isoformat()
        a['approved_at'] = a.get('approved_at', None)
        if a['approved_at'] and not isinstance(a['approved_at'], str):
            a['approved_at'] = a['approved_at'].isoformat()
        result.append(AlumniResponse(**a))
    
    return result

@api_router.get("/alumni/pending", response_model=List[AlumniResponse])
async def get_pending_alumni(admin: dict = Depends(get_current_admin)):
    alumni_list = await db.alumni.find({"status": "pending"}, {"_id": 0}).to_list(1000)
    
    result = []
    for a in alumni_list:
        a['created_at'] = a['created_at'] if isinstance(a['created_at'], str) else a['created_at'].isoformat()
        a['approved_at'] = a.get('approved_at', None)
        result.append(AlumniResponse(**a))
    
    return result

@api_router.get("/alumni/all", response_model=List[AlumniResponse])
async def get_all_alumni(admin: dict = Depends(get_current_admin)):
    alumni_list = await db.alumni.find({}, {"_id": 0}).to_list(1000)
    
    result = []
    for a in alumni_list:
        a['created_at'] = a['created_at'] if isinstance(a['created_at'], str) else a['created_at'].isoformat()
        a['approved_at'] = a.get('approved_at', None)
        if a['approved_at'] and not isinstance(a['approved_at'], str):
            a['approved_at'] = a['approved_at'].isoformat()
        result.append(AlumniResponse(**a))
    
    return result

@api_router.put("/alumni/{alumni_id}/approve")
async def approve_alumni(alumni_id: str, admin: dict = Depends(get_current_admin)):
    alumni = await db.alumni.find_one({"id": alumni_id}, {"_id": 0})
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    # Count approved alumni for this batch to generate EHSAS ID
    count = await db.alumni.count_documents({
        "year_of_leaving": alumni["year_of_leaving"],
        "status": "approved"
    })
    ehsas_id = generate_ehsas_id(alumni["year_of_leaving"], count + 1)
    
    await db.alumni.update_one(
        {"id": alumni_id},
        {"$set": {
            "status": "approved",
            "ehsas_id": ehsas_id,
            "approved_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Mock: Send approval email with EHSAS ID
    logger.info(f"[MOCK EMAIL] To: {alumni['email']} - Your EHSAS membership approved! ID: {ehsas_id}")
    
    return {"message": f"Alumni approved with EHSAS ID: {ehsas_id}", "ehsas_id": ehsas_id}

@api_router.put("/alumni/{alumni_id}/reject")
async def reject_alumni(alumni_id: str, admin: dict = Depends(get_current_admin)):
    alumni = await db.alumni.find_one({"id": alumni_id}, {"_id": 0})
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    await db.alumni.update_one(
        {"id": alumni_id},
        {"$set": {"status": "rejected"}}
    )
    
    # Mock: Send rejection email
    logger.info(f"[MOCK EMAIL] To: {alumni['email']} - Your EHSAS registration was not approved")
    
    return {"message": "Alumni registration rejected"}

# =============================================================================
# EVENTS ROUTES
# =============================================================================

@api_router.get("/events", response_model=List[Event])
async def get_events(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    events = await db.events.find(query, {"_id": 0}).to_list(100)
    return events

@api_router.post("/events", response_model=Event)
async def create_event(data: EventCreate, admin: dict = Depends(get_current_admin)):
    event = Event(**data.model_dump())
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.events.insert_one(doc)
    return event

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, data: EventCreate, admin: dict = Depends(get_current_admin)):
    result = await db.events.update_one(
        {"id": event_id},
        {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated"}

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}

# =============================================================================
# SPOTLIGHT ROUTES
# =============================================================================

@api_router.get("/spotlight", response_model=List[SpotlightAlumni])
async def get_spotlight_alumni():
    spotlight = await db.spotlight.find({"is_featured": True}, {"_id": 0}).to_list(20)
    return spotlight

class SpotlightCreate(BaseModel):
    name: str
    batch: str
    profession: str
    achievement: str
    category: str
    image_url: Optional[str] = ""

@api_router.post("/spotlight", response_model=SpotlightAlumni)
async def create_spotlight(data: SpotlightCreate, admin: dict = Depends(get_current_admin)):
    spotlight = SpotlightAlumni(**data.model_dump())
    doc = spotlight.model_dump()
    await db.spotlight.insert_one(doc)
    return spotlight

@api_router.put("/spotlight/{spotlight_id}")
async def update_spotlight(spotlight_id: str, data: SpotlightCreate, admin: dict = Depends(get_current_admin)):
    result = await db.spotlight.update_one(
        {"id": spotlight_id},
        {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Spotlight alumni not found")
    return {"message": "Spotlight alumni updated"}

@api_router.delete("/spotlight/{spotlight_id}")
async def delete_spotlight(spotlight_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.spotlight.delete_one({"id": spotlight_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Spotlight alumni not found")
    return {"message": "Spotlight alumni deleted"}

# =============================================================================
# ADMIN ROUTES
# =============================================================================

@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_current_admin)):
    total_alumni = await db.alumni.count_documents({"status": "approved"})
    pending_registrations = await db.alumni.count_documents({"status": "pending"})
    total_events = await db.events.count_documents({"is_active": True})
    
    # Get batch distribution
    pipeline = [
        {"$match": {"status": "approved"}},
        {"$group": {"_id": "$year_of_leaving", "count": {"$sum": 1}}},
        {"$sort": {"_id": -1}},
        {"$limit": 10}
    ]
    batch_distribution = await db.alumni.aggregate(pipeline).to_list(10)
    
    return {
        "total_alumni": total_alumni,
        "pending_registrations": pending_registrations,
        "total_events": total_events,
        "batch_distribution": [{"batch": b["_id"], "count": b["count"]} for b in batch_distribution]
    }

@api_router.get("/admin/notifications")
async def get_notifications(admin: dict = Depends(get_current_admin)):
    notifications = await db.notifications.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return notifications

@api_router.put("/admin/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, admin: dict = Depends(get_current_admin)):
    await db.notifications.update_one({"id": notif_id}, {"$set": {"is_read": True}})
    return {"message": "Notification marked as read"}

# =============================================================================
# SEED DATA
# =============================================================================

@app.on_event("startup")
async def seed_admin():
    # Seed admin account only
    admin_email = "deweshkk@gmail.com"
    existing_admin = await db.admins.find_one({"email": admin_email})
    if not existing_admin:
        admin_doc = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password": hash_password("Dew@2002k"),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.admins.insert_one(admin_doc)
        logger.info(f"Admin account seeded: {admin_email}")

# =============================================================================
# MAIN APP CONFIG
# =============================================================================

@api_router.get("/")
async def root():
    return {"message": "EHSAS API - Elden Heights School Alumni Society"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
