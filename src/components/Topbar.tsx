export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between backdrop-blur-[22px] bg-white/[0.04] border-b border-white/8">
      <div className="text-[17px] font-medium tracking-[-0.02em] text-white">
        Gemini
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white whitespace-nowrap backdrop-blur-[18px] hover:bg-white/[0.12] transition">
          Upgrade to Google AI Plus
        </button>
        <div className="grid h-8 w-8 place-items-center rounded-full bg-violet-600/90 text-sm font-semibold shadow-lg">
          D
        </div>
      </div>
    </header>
  );
}
