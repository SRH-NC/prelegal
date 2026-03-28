"use client";

import { useState, useCallback } from "react";
import ChatPanel from "./ChatPanel";
import DocumentPreview from "./DocumentPreview";
import { generateFullDocumentMarkdown } from "@/lib/generateDocument";
import { getDownloadFilename, getDocumentTitle } from "@/lib/documentTypes";
import { saveDocument } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface DocumentCreatorProps {
  initialDocType?: string | null;
  initialFields?: Record<string, string>;
  resetKey?: number;
}

export default function DocumentCreator({
  initialDocType,
  initialFields,
  resetKey,
}: DocumentCreatorProps) {
  const { user } = useAuth();
  const [docType, setDocType] = useState<string | null>(initialDocType ?? null);
  const [fields, setFields] = useState<Record<string, string>>(initialFields ?? {});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Reset state when resetKey changes (New Document)
  const [lastResetKey, setLastResetKey] = useState(resetKey ?? 0);
  if (resetKey !== undefined && resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setDocType(initialDocType ?? null);
    setFields(initialFields ?? {});
    setSaveMessage("");
  }

  const handleFieldsExtracted = useCallback(
    (newDocType: string | null, newFields: Record<string, string>) => {
      if (newDocType !== null) {
        setDocType(newDocType);
      }
      if (Object.keys(newFields).length > 0) {
        setFields((prev) => ({ ...prev, ...newFields }));
      }
    },
    []
  );

  function handleDownload() {
    if (!docType) return;
    const markdown = generateFullDocumentMarkdown(docType, fields);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getDownloadFilename(docType);
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  async function handleSave() {
    if (!docType || !user) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const title = getDocumentTitle(docType);
      await saveDocument(title, docType, fields);
      setSaveMessage("Saved!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch {
      setSaveMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 flex-1">
      <div className="lg:w-1/2 shrink-0">
        <div className="space-y-4">
          <ChatPanel
            key={resetKey}
            onFieldsExtracted={handleFieldsExtracted}
          />
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={!docType}
              className="flex-1 rounded px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#753991" }}
            >
              Download Markdown
            </button>
            {user && (
              <button
                onClick={handleSave}
                disabled={!docType || saving}
                className="flex-1 rounded px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#209dd7" }}
              >
                {saving ? "Saving..." : saveMessage || "Save Document"}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 min-w-0">
        <div className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
          <DocumentPreview docType={docType} fields={fields} />
        </div>
      </div>
    </div>
  );
}
