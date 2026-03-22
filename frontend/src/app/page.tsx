import NdaCreator from "@/components/NdaCreator";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-semibold text-zinc-900">Prelegal</h1>
          <p className="text-sm text-zinc-500">Mutual NDA Creator</p>
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
