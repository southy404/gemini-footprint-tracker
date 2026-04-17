import { Mic, Plus, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  docked: boolean;
  showChips?: boolean;
};

export default function SharedComposer({
  value,
  onChange,
  onSend,
  loading,
  docked,
  showChips = false,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, docked ? 240 : 300);
    el.style.height = `${next}px`;
    el.style.overflowY =
      el.scrollHeight > (docked ? 240 : 300) ? "auto" : "hidden";
  }, [value, docked]);

  return (
    <motion.div
      layout
      layoutId="shared-gemini-composer"
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
      className="w-full max-w-[760px]"
    >
      <div
        className={`w-full rounded-[30px] border border-white/10 bg-[#1d1f27]/94 shadow-[0_20px_80px_rgba(0,0,0,0.42)] ${
          docked ? "px-5 py-4" : "px-5 py-5"
        }`}
      >
        <textarea
          ref={textareaRef}
          className={`w-full resize-none border-none bg-transparent text-white outline-none placeholder:text-[#b7bfcb] pr-2 font-normal tracking-[-0.01em] ${
            docked
              ? "min-h-[52px] max-h-[240px] text-[15px] leading-[1.55]"
              : "min-h-[78px] max-h-[300px] text-[16px] leading-[1.65]"
          }`}
          style={{ scrollbarWidth: "thin" }}
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

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[#a4adba]">
            <button className="hover:text-white transition">
              <Plus size={18} />
            </button>

            <button className="hover:text-white transition flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal size={16} />
              <span>Tools</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-[#a4adba] hover:text-white transition">
              <Mic size={18} />
            </button>

            <button
              onClick={onSend}
              disabled={loading}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:-translate-y-[1px] transition"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {showChips && (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {[
            "🌍 Track footprint",
            "📊 View usage metadata",
            "💧 Compare water impact",
            "🧪 Earth Day demo",
          ].map((chip) => (
            <div
              key={chip}
              className="rounded-full border border-white/5 bg-white/[0.045] px-4 py-2.5 text-sm font-normal text-[#dfe5f2]"
            >
              {chip}
            </div>
          ))}
        </div>
      )}

      {docked && (
        <div className="mt-2 text-center text-xs text-[#7d8593]">
          Gemini can make mistakes. Footprint values are estimates layered on
          top of Gemini usage metadata.
        </div>
      )}
    </motion.div>
  );
}
