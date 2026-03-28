import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import User, Document
from app.auth import get_current_user

router = APIRouter()


class SaveDocumentRequest(BaseModel):
    title: str
    doc_type: str
    fields: dict[str, str]


class DocumentResponse(BaseModel):
    id: str
    title: str
    doc_type: str
    fields: dict[str, str]
    created_at: str


def _doc_to_response(doc: Document) -> DocumentResponse:
    return DocumentResponse(
        id=doc.id,
        title=doc.title,
        doc_type=doc.doc_type,
        fields=json.loads(doc.fields_json),
        created_at=doc.created_at.isoformat(),
    )


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Document)
        .where(Document.user_id == user.id)
        .order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()
    return [_doc_to_response(doc) for doc in docs]


@router.post("", status_code=201, response_model=DocumentResponse)
async def save_document(
    body: SaveDocumentRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc = Document(
        user_id=user.id,
        title=body.title,
        doc_type=body.doc_type,
        fields_json=json.dumps(body.fields),
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return _doc_to_response(doc)


@router.delete("/{doc_id}", status_code=204)
async def delete_document(
    doc_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Document).where(Document.id == doc_id, Document.user_id == user.id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.delete(doc)
    await db.commit()
