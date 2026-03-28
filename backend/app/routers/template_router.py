import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

router = APIRouter()

def _find_templates_dir() -> str:
    env_dir = os.getenv("TEMPLATES_DIR")
    if env_dir:
        return env_dir
    # Docker: /app/templates
    if os.path.isdir("/app/templates"):
        return "/app/templates"
    # Local dev: relative to backend/app/routers/
    return os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "templates"))

TEMPLATES_DIR = _find_templates_dir()

# Map doc type slugs to template filenames
DOC_TYPE_TO_TEMPLATE: dict[str, str] = {
    "mutual_nda": "Mutual-NDA.md",
    "csa": "CSA.md",
    "pilot_agreement": "Pilot-Agreement.md",
    "design_partner": "Design-Partner-Agreement.md",
    "sla": "SLA.md",
    "psa": "PSA.md",
    "dpa": "DPA.md",
    "partnership": "Partnership-Agreement.md",
    "software_license": "Software-License-Agreement.md",
    "baa": "BAA.md",
    "ai_addendum": "AI-Addendum.md",
}


@router.get("/{doc_type}", response_class=PlainTextResponse)
async def get_template(doc_type: str):
    filename = DOC_TYPE_TO_TEMPLATE.get(doc_type)
    if not filename:
        raise HTTPException(status_code=404, detail=f"Unknown document type: {doc_type}")

    filepath = os.path.join(TEMPLATES_DIR, filename)
    filepath = os.path.normpath(filepath)

    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail=f"Template file not found: {filename}")

    with open(filepath, "r") as f:
        return f.read()
