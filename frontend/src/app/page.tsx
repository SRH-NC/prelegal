"use client";

import Link from "next/link";
import NdaCreator from "@/components/NdaCreator";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#032147" }}>
              Prelegal
            </h1>
            <p className="text-sm" style={{ color: "#888888" }}>
              Mutual NDA Creator
            </p>
          </div>
          {!loading && (
            <div className="flex items-center gap-4 text-sm">
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
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <NdaCreator />
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
    </div>
  );
}
