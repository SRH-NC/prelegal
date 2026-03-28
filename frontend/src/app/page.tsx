"use client";

import { useState } from "react";
import Link from "next/link";
import DocumentCreator from "@/components/DocumentCreator";
import MyDocumentsModal from "@/components/MyDocumentsModal";
import { useAuth } from "@/context/AuthContext";
import { type SavedDocument } from "@/lib/api";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [resetKey, setResetKey] = useState(0);
  const [loadedDocType, setLoadedDocType] = useState<string | null>(null);
  const [loadedFields, setLoadedFields] = useState<Record<string, string>>({});
  const [showMyDocs, setShowMyDocs] = useState(false);

  function handleNewDocument() {
    setResetKey((k) => k + 1);
    setLoadedDocType(null);
    setLoadedFields({});
  }

  function handleLoadDocument(doc: SavedDocument) {
    setLoadedDocType(doc.doc_type);
    setLoadedFields(doc.fields);
    setResetKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#032147" }}>
              Prelegal
            </h1>
            <p className="text-sm" style={{ color: "#888888" }}>
              Legal Document Creator
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={handleNewDocument}
              className="rounded px-3 py-1.5 text-sm font-medium border transition-colors"
              style={{ borderColor: "#209dd7", color: "#209dd7" }}
            >
              New Document
            </button>
            {!loading && user && (
              <button
                onClick={() => setShowMyDocs(true)}
                className="rounded px-3 py-1.5 text-sm font-medium border transition-colors"
                style={{ borderColor: "#032147", color: "#032147" }}
              >
                My Documents
              </button>
            )}
            {!loading && (
              <>
                {user ? (
                  <>
                    <span style={{ color: "#888888" }}>{user.email}</span>
                    <button
                      onClick={logout}
                      className="rounded px-3 py-1.5 text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: "#753991" }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="font-medium"
                      style={{ color: "#209dd7" }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded px-3 py-1.5 font-medium text-white transition-colors"
                      style={{ backgroundColor: "#753991" }}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <DocumentCreator
            key={resetKey}
            initialDocType={loadedDocType}
            initialFields={loadedFields}
            resetKey={resetKey}
          />
        </div>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-6 py-3">
        <div className="mx-auto max-w-7xl text-xs text-zinc-400">
          Templates sourced from{" "}
          <a
            href="https://github.com/CommonPaper"
            className="underline hover:text-zinc-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Common Paper
          </a>
          , licensed under CC BY 4.0.
        </div>
      </footer>

      <MyDocumentsModal
        open={showMyDocs}
        onClose={() => setShowMyDocs(false)}
        onLoad={handleLoadDocument}
      />
    </div>
  );
}
