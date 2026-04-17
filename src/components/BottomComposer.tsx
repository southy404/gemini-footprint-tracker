import { Mic, Plus, SlidersHorizontal } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  mode: "normal" | "eco";
  setMode: (mode: "normal" | "eco") => void;
  loading: boolean;
  visible: boolean;
};

export default function BottomComposer({
  value,
  onChange,
  onSend,
  mode,
  setMode,
  loading,
  visible,
}: Props) {
  return (
    <div
      className={`fixed bottom-0 right-0 left-0 z-30 bg-gradient-to-b from-transparent via-[#050608]/90 to-[#050608] px-3 md:px-6 pb-4 pt-5 transition-all duration-300 lg:left-auto ${
        visible
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto w-full max-w-[680px]">
        <div className="rounded-[32px] border border-white/10 bg-[#1d1f27]/95 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.42)]">
          <textarea
            className="w-full min-h-[42px] max-h-[180px] resize-none border-none bg-transparent text-base leading-[1.45] text-white outline-none placeholder:text-[#b7bfcb]"
            placeholder="Ask Gemini"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[#a4adba]">
              <button className="hover:text-white transition">
                <Plus size={18} />
              </button>
              <button className="hover:text-white transition flex items-center gap-2">
                <SlidersHorizontal size={16} />
                <span>Tools</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "normal" | "eco")}
                className="bg-transparent text-white outline-none"
              >
                <option value="normal">Normal</option>
                <option value="eco">Eco mode</option>
              </select>

              <button className="text-[#a4adba] hover:text-white transition">
                <Mic size={18} />
              </button>

              <button
                onClick={onSend}
                disabled={loading}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white disabled:opacity-50 hover:-translate-y-[1px] transition"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-xs text-[#7d8593]">
            Gemini can make mistakes. Footprint values are estimates layered on
            top of Gemini usage metadata.
          </div>
        </div>
      </div>
    </div>
  );
}
