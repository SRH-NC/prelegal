# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The product is under active development.

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

### Not Yet Implemented

#### PL-5: AI Chat (Mutual NDA only)
- Replace manual form with freeform AI chat
- AI asks questions and populates NDA fields from responses
- Uses LiteLLM via OpenRouter (openai/gpt-oss-120b model)
- Structured outputs for field extraction

#### PL-6: All Document Types
- Expand AI chat to support all 12 document types
- Document type detection from user requests
- Graceful handling of unsupported document requests

#### PL-7: Multi-User Support & Polish
- User document persistence (save/load/delete)
- My Documents view for previously created documents
- Professional SaaS polish
- Legal disclaimer on generated documents
