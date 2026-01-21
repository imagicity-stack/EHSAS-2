# EHSAS (Frontend + Backend)

This repository contains the EHSAS alumni portal frontend (React) and backend (FastAPI). The backend now uses **Firebase Firestore** for data storage and serves the built frontend from the same server, keeping the existing UI and API behavior intact.

## Architecture Overview

- **Frontend:** React app in `frontend/`.
- **Backend:** FastAPI app in `backend/`.
- **Merged delivery:** After running a frontend build, the backend serves `frontend/build` as static assets while continuing to expose API routes under `/api`.

## Firebase (Firestore) Setup

Follow these steps to create the Firestore collections and credentials that the backend expects.

### 1) Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts.
3. Once created, open the project.

### 2) Enable Cloud Firestore

1. In the left sidebar, click **Firestore Database**.
2. Click **Create database**.
3. Choose **Production mode** (recommended) or **Test mode** (for local/dev).
4. Select a Firestore location and click **Enable**.

### 3) Create a service account key

1. In the Firebase Console, click the gear icon → **Project settings**.
2. Open the **Service accounts** tab.
3. Click **Generate new private key** and download the JSON file.
4. Store the JSON file securely (do not commit it).

### 4) Set backend environment variables

Create `backend/.env` (or export in your shell) and set:

```bash
FIREBASE_CREDENTIALS=/absolute/path/to/firebase-service-account.json
JWT_SECRET=ehsas-super-secret-key-2024
CORS_ORIGINS=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=ehsas@eldenheights.org
SMTP_FROM_NAME="EHSAS - Elden Heights School Alumni Society"
```

### 5) Create Firestore collections

Firestore collections are created automatically on first write, but you can pre-create them in the console for clarity. The backend expects the following collections and document fields:

#### `admins` (collection)
- `id` (string, document id and field)
- `email` (string)
- `password` (string, bcrypt hash)
- `role` (string, `admin`)
- `created_at` (string, ISO timestamp)

> The backend seeds a default admin on startup if none exists:
> - email: `deweshkk@gmail.com`
> - password: `Dew@2002k`

#### `alumni` (collection)
- `id` (string, document id and field)
- `first_name` / `last_name`
- `email`, `mobile`
- `year_of_joining`, `year_of_leaving`
- `class_of_joining`, `last_class_studied`, `last_house`
- `full_address`, `city`, `pincode`, `state`, `country`
- `profession`, `organization`
- `status` (`pending`, `approved`, `rejected`)
- `ehsas_id` (string, optional)
- `created_at`, `approved_at` (ISO timestamps)

#### `events` (collection)
- `id` (string, document id and field)
- `title`, `description`, `event_type`, `date`, `time`, `location`
- `image_url`, `is_active`
- `created_at` (ISO timestamp)

#### `spotlight` (collection)
- `id` (string, document id and field)
- `name`, `batch`, `profession`, `achievement`, `category`
- `image_url`, `is_featured`

#### `notifications` (collection)
- `id` (string, document id and field)
- `type`, `title`, `message`
- `alumni_id` (optional)
- `is_read` (boolean)
- `created_at` (ISO timestamp)

### 6) Create required Firestore indexes

Firestore requires composite indexes for some multi-field queries used by the backend. Create these indexes in **Firestore Database → Indexes**:

1. **Collection:** `alumni`
   - Fields: `status` (Ascending), `year_of_leaving` (Ascending)
   - Query Scope: Collection

2. **Collection:** `alumni`
   - Fields: `year_of_leaving` (Ascending), `status` (Ascending)
   - Query Scope: Collection

These indexes cover filtering by `status` and `year_of_leaving` together.

## Running the app (merged frontend + backend)

### 1) Install backend dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 2) Install frontend dependencies

```bash
cd frontend
yarn install
```

### 3) Build the frontend

```bash
yarn build
```

The build output is placed in `frontend/build`.

### 4) Run the backend (serves API + frontend)

```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

- **Frontend:** http://localhost:8000/
- **API:** http://localhost:8000/api

## Notes

- The backend now uses Firebase Firestore; MongoDB is no longer required.
- Keep the service account JSON private and never commit it.
