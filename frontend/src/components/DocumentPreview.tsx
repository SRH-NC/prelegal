"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateCoverPageMarkdown } from "@/lib/generateDocument";
import { getDocumentTitle } from "@/lib/documentTypes";

interface DocumentPreviewProps {
  docType: string | null;
  fields: Record<string, string>;
}

export default function DocumentPreview({ docType, fields }: DocumentPreviewProps) {
  if (!docType) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-sm" style={{ color: "#888888" }}>
        <div className="text-center">
          <p className="text-lg font-medium" style={{ color: "#032147" }}>
            Document Preview
          </p>
          <p className="mt-2">
            Your document will appear here as you chat with the AI assistant.
          </p>
        </div>
      </div>
    );
  }

  const markdown = generateCoverPageMarkdown(docType, fields);

  return (
    <div>
      <div className="mb-4 pb-2 border-b border-zinc-200">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#209dd7" }}>
          {getDocumentTitle(docType)}
        </p>
      </div>
      <div className="prose prose-sm prose-zinc max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
