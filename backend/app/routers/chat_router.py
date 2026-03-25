import os
from typing import Literal, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import litellm

router = APIRouter()

MODEL = "openrouter/nvidia/nemotron-3-super-120b-a12b:free"


def _get_api_key() -> str:
    return os.getenv("OPENROUTER_API_KEY", "")

SYSTEM_PROMPT = """You are a friendly legal assistant helping a user create a Mutual Non-Disclosure Agreement (NDA).

Your job is to have a natural conversation to gather the information needed to fill in the NDA fields. Ask one or two questions at a time. Be conversational and helpful.

The NDA has these fields you need to gather:
- purpose: How confidential information may be used (default: "Evaluating whether to enter into a business relationship with the other party.")
- effectiveDate: When the NDA takes effect (YYYY-MM-DD format, default: today's date)
- mndaTermType: Either "expires" or "until_terminated" (default: "expires")
- mndaTermYears: Number of years if mndaTermType is "expires" (default: "1")
- confidentialityTermType: Either "years" or "perpetual" (default: "years")
- confidentialityTermYears: Number of years if confidentialityTermType is "years" (default: "1")
- governingLaw: The US state whose laws govern the agreement
- jurisdiction: Where legal disputes will be resolved (e.g., "courts located in New Castle, DE")
- modifications: Any modifications to the standard NDA terms (default: none)
- party1Name: Name of the person signing for Party 1
- party1Title: Title of Party 1's signer
- party1Company: Company name for Party 1
- party1Address: Notice address (email or postal) for Party 1
- party2Name: Name of the person signing for Party 2
- party2Title: Title of Party 2's signer
- party2Company: Company name for Party 2
- party2Address: Notice address (email or postal) for Party 2

Guidelines:
- Start by asking about the purpose and the two companies involved.
- Ask about governing law and jurisdiction together.
- Ask about party details (names, titles, addresses) after the main terms.
- For term types and years, explain the options briefly.
- When you have enough information, confirm with the user and set is_complete to true.
- The minimum required fields to be complete are: purpose, governingLaw, jurisdiction, party1Company, party2Company.
- Only include fields in extracted_fields that you have gathered from the conversation. Do not include fields you haven't discussed yet.

You MUST respond with valid JSON matching this exact format:
{
  "message": "Your conversational response to the user",
  "extracted_fields": {
    "fieldName": "value"
  },
  "is_complete": false
}

Only include fields in extracted_fields that have been explicitly provided or confirmed by the user. The is_complete field should be true only when you have gathered at least the minimum required fields and confirmed with the user."""

GREETING = (
    "Hi! I'm here to help you create a Mutual Non-Disclosure Agreement. "
    "Let's start with the basics — what's the purpose of this NDA, "
    "and which two companies will be entering into this agreement?"
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    history: list[ChatMessage]
    message: str


class ExtractedNdaFields(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[Literal["expires", "until_terminated"]] = None
    mndaTermYears: Optional[str] = None
    confidentialityTermType: Optional[Literal["years", "perpetual"]] = None
    confidentialityTermYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None
    party1Name: Optional[str] = None
    party1Title: Optional[str] = None
    party1Company: Optional[str] = None
    party1Address: Optional[str] = None
    party2Name: Optional[str] = None
    party2Title: Optional[str] = None
    party2Company: Optional[str] = None
    party2Address: Optional[str] = None


class LlmResponse(BaseModel):
    """Schema passed to LiteLLM as response_format for structured outputs."""
    message: str
    extracted_fields: ExtractedNdaFields
    is_complete: bool


class ChatResponse(BaseModel):
    message: str
    extracted_fields: dict
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

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

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
        clean_fields = {
            k: v
            for k, v in parsed.extracted_fields.model_dump(exclude_none=True).items()
            if v != ""
        }

        return ChatResponse(
            message=parsed.message,
            extracted_fields=clean_fields,
            is_complete=parsed.is_complete,
        )

    except litellm.exceptions.APIError as e:
        raise HTTPException(status_code=502, detail=f"LLM service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
