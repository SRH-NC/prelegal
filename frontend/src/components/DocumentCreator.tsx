"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";
import DocumentPreview from "./DocumentPreview";
import { generateFullDocumentMarkdown } from "@/lib/generateDocument";
import { getDownloadFilename } from "@/lib/documentTypes";

export default function DocumentCreator() {
  const [docType, setDocType] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  function handleFieldsExtracted(
    newDocType: string | null,
    newFields: Record<string, string>
  ) {
    if (newDocType !== null) {
      setDocType(newDocType);
    }
    if (Object.keys(newFields).length > 0) {
      setFields((prev) => ({ ...prev, ...newFields }));
    }
  }

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

  return (
    <div className="flex flex-col lg:flex-row gap-8 flex-1">
      <div className="lg:w-1/2 shrink-0">
        <div className="space-y-4">
          <ChatPanel onFieldsExtracted={handleFieldsExtracted} />
          <button
            onClick={handleDownload}
            disabled={!docType}
            className="w-full rounded px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#753991" }}
          >
            Download Markdown
          </button>
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
