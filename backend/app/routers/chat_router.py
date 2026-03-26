import os
from typing import Literal, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import litellm

from app.document_types import DOCUMENT_TYPES, build_catalog_summary, build_field_descriptions

router = APIRouter()

MODEL = "openrouter/nvidia/nemotron-3-super-120b-a12b:free"


def _get_api_key() -> str:
    return os.getenv("OPENROUTER_API_KEY", "")


def _build_system_prompt() -> str:
    valid_types = ", ".join(DOCUMENT_TYPES.keys())
    return f"""You are a friendly legal assistant helping users create legal documents. You can create any of the document types listed below.

Your job is to:
1. Identify what type of document the user needs from the conversation.
2. Have a natural conversation to gather the fields for that document type.
3. Ask one or two questions at a time. Be conversational and helpful.
4. When you have the required fields, confirm with the user and set is_complete to true.

{build_catalog_summary()}

{build_field_descriptions()}

IMPORTANT RULES:
- Set `document_type` to exactly one of: {valid_types}
- Do NOT invent new document type values.
- If the user asks for a document type not in the list above, politely refuse and list the available document types. Do NOT set document_type for unsupported requests.
- "Mutual NDA" and "Mutual NDA Cover Page" are the same document type: use `mutual_nda`.
- Only include fields in `fields` that have been explicitly provided or confirmed by the user. Do not include empty or unconfirmed fields.
- Set `is_complete` to true only when you have gathered at least all the required fields for the identified document type AND confirmed with the user.
- Dates should be in YYYY-MM-DD format.

You MUST respond with valid JSON matching this exact format:
{{
  "message": "Your conversational response to the user",
  "document_type": "the_doc_type_slug_or_null",
  "fields": {{
    "fieldName": "value"
  }},
  "is_complete": false
}}"""


GREETING = (
    "Hi! I'm here to help you create a legal document. I can help with:\n\n"
    "- Mutual NDA\n"
    "- Cloud Service Agreement\n"
    "- Pilot Agreement\n"
    "- Design Partner Agreement\n"
    "- Service Level Agreement\n"
    "- Professional Services Agreement\n"
    "- Data Processing Agreement\n"
    "- Partnership Agreement\n"
    "- Software License Agreement\n"
    "- Business Associate Agreement (HIPAA)\n"
    "- AI Addendum\n\n"
    "What type of document do you need?"
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    history: list[ChatMessage]
    message: str


class ExtractedFields(BaseModel):
    document_type: Optional[str] = None
    fields: dict[str, str] = {}


class LlmResponse(BaseModel):
    message: str
    document_type: Optional[str] = None
    fields: dict[str, str] = {}
    is_complete: bool = False


class ChatResponse(BaseModel):
    message: str
    document_type: Optional[str] = None
    extracted_fields: dict[str, str]
    is_complete: bool


class GreetingResponse(BaseModel):
    message: str


@router.get("/greeting", response_model=GreetingResponse)
async def greeting():
    return GreetingResponse(message=GREETING)


@router.post("/message", response_model=ChatResponse)
async def chat_message(body: ChatRequest):
    api_key = _get_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    history = body.history[-50:] if len(body.history) > 50 else body.history

    messages = [{"role": "system", "content": _build_system_prompt()}]

    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": body.message})

    try:
        response = litellm.completion(
            model=MODEL,
            messages=messages,
            api_key=api_key,
            response_format=LlmResponse,
            max_tokens=4000,
            temperature=0.7,
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty response from LLM")

        parsed = LlmResponse.model_validate_json(content)

        # Validate document_type if provided
        doc_type = parsed.document_type
        if doc_type and doc_type not in DOCUMENT_TYPES:
            doc_type = None

        clean_fields = {k: v for k, v in parsed.fields.items() if v and v.strip()}

        return ChatResponse(
            message=parsed.message,
            document_type=doc_type,
            extracted_fields=clean_fields,
            is_complete=parsed.is_complete,
        )

    except litellm.exceptions.APIError as e:
        raise HTTPException(status_code=502, detail=f"LLM service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
