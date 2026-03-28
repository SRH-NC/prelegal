"use client";

import { useState, useEffect } from "react";
import { listDocuments, deleteDocument, type SavedDocument } from "@/lib/api";
import { getDocumentTitle } from "@/lib/documentTypes";

interface MyDocumentsModalProps {
  open: boolean;
  onClose: () => void;
  onLoad: (doc: SavedDocument) => void;
}

export default function MyDocumentsModal({
  open,
  onClose,
  onLoad,
}: MyDocumentsModalProps) {
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError("");
      listDocuments()
        .then(setDocs)
        .catch(() => setError("Failed to load documents"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  async function handleDelete(id: string) {
    await deleteDocument(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold" style={{ color: "#032147" }}>
            My Documents
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <p className="text-sm" style={{ color: "#888888" }}>
              Loading...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && docs.length === 0 && (
            <p className="text-sm" style={{ color: "#888888" }}>
              No saved documents yet. Create a document and click Save to store it here.
            </p>
          )}
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#032147" }}
                >
                  {doc.title}
                </p>
                <p className="text-xs" style={{ color: "#888888" }}>
                  {getDocumentTitle(doc.doc_type)} &middot;{" "}
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 ml-3 shrink-0">
                <button
                  onClick={() => {
                    onLoad(doc);
                    onClose();
                  }}
                  className="rounded px-3 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: "#209dd7" }}
                >
                  Load
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="rounded px-3 py-1 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
