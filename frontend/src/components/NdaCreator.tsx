"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";
import NdaPreview from "./NdaPreview";
import { NdaFormData, defaultFormData, generateFullNda } from "@/lib/generateNda";

export default function NdaCreator() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const markdown = generateFullNda(formData);

  function handleFieldsExtracted(_docType: string | null, fields: Record<string, string>) {
    setFormData((prev) => ({ ...prev, ...fields } as NdaFormData));
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Mutual-NDA.md";
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
            className="w-full rounded px-4 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#753991" }}
          >
            Download Markdown
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 min-w-0">
        <div className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
          <NdaPreview markdown={markdown} />
        </div>
      </div>
    </div>
  );
}
