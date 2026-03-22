"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NdaPreviewProps {
  markdown: string;
}

export default function NdaPreview({ markdown }: NdaPreviewProps) {
  return (
    <div className="prose prose-sm prose-zinc max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
