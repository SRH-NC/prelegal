# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

All planned features (PL-2 through PL-7) are complete.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use LiteLLM via OpenRouter to the `nvidia/nemotron-3-super-120b-a12b:free` model. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
Consider statically building the frontend and serving it via FastAPI, if that will work.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Completed

#### PL-2: Legal Document Templates
- 12 markdown templates from CommonPaper in `templates/`
- `catalog.json` with name, description, and filename for each template
- CC BY 4.0 license attribution

#### PL-3: Mutual NDA Creator Prototype
- Next.js 16 frontend with React 19 and Tailwind CSS 4
- Manual form for NDA fields (purpose, dates, terms, parties)
- Live markdown preview with react-markdown
- Client-side markdown download

#### PL-4: V1 Foundation
- FastAPI backend (`backend/`) with uv project management
- SQLite database, created fresh each container start
- User auth (signup/signin/signout) with JWT in HttpOnly cookies and bcrypt
- Auth API: POST /api/auth/signup, POST /api/auth/signin, POST /api/auth/signout, GET /api/auth/me
- GET /api/health endpoint
- Multi-stage Dockerfile (Node frontend build + Python runtime)
- docker-compose.yml for orchestration
- Start/stop scripts for Mac, Linux, Windows in `scripts/`
- Static Next.js export served by FastAPI at localhost:8000
- Sign in and sign up pages with project color scheme
- Auth context provider and auth-aware header

#### PL-5: AI Chat (Mutual NDA only)
- AI chat interface replaces manual NDA form (NdaForm.tsx kept as backup)
- Backend POST /api/chat/message calls Nvidia Nemotron 120B (free) via LiteLLM/OpenRouter
- GET /api/chat/greeting for initial AI message
- Structured outputs using Pydantic model as response_format
- Live NDA preview updates as AI extracts fields from conversation
- ChatPanel component with chat bubbles, typing indicator, auto-scroll
- Conversation history kept client-side, 50-message cap

#### PL-6: All Document Types
- AI detects document type from conversation (no dropdown)
- All 11 document types supported via document_types.py config
- Unsupported document requests refused with list of available types
- Full legal text from CommonPaper templates served via GET /api/templates/{doc_type}
- Cover page + standard terms rendered in preview and included in download
- DocumentCreator and DocumentPreview replace NdaCreator
- System prompt built dynamically from document type config

#### PL-7: Multi-User Support & Polish
- Document persistence: Save button (auth required), stored as doc_type + fields JSON
- Document CRUD API: GET/POST /api/documents, DELETE /api/documents/{id}
- My Documents modal to view, load, and delete saved documents
- New Document button in header to reset chat and start fresh
- Legal disclaimer in document preview and downloaded markdown
- Save button only visible when signed in; chat open to all

### Current API Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in and receive JWT cookie
- `POST /api/auth/signout` - Clear auth cookie
- `GET /api/auth/me` - Get current user info
- `GET /api/chat/greeting` - Get AI greeting with available document types
- `POST /api/chat/message` - Send chat message, receive AI response with extracted fields
- `GET /api/documents` - List user's saved documents (auth required)
- `POST /api/documents` - Save new document (auth required)
- `DELETE /api/documents/{id}` - Delete document (auth required)
- `GET /api/templates/{doc_type}` - Get CommonPaper template markdown
- `GET /api/health` - Health check

### All Planned Features Complete
