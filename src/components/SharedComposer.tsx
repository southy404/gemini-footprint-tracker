import { Mic, Plus, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: (overrideValue?: string) => void;
  onToggleVoice: () => void;
  loading: boolean;
  docked: boolean;
  showChips?: boolean;
  isListening: boolean;
  micSupported: boolean;
  helperText?: string;

  // Community stats for chip prompts (never shown to user)
  communityWater?: number;
  communityCo2?: number;
  uniqueUsers?: number;
};

function formatWater(value: number) {
  if (value < 1000) return `${value.toFixed(1)} mL`;
  if (value < 10000) return `${(value / 1000).toFixed(2)} L`;
  return `${(value / 1000).toFixed(1)} L`;
}

function formatCo2(value: number) {
  if (value < 1000) return `${value.toFixed(2)} g`;
  return `${(value / 1000).toFixed(2)} kg`;
}

function formatUsers(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function SharedComposer({
  value,
  onChange,
  onSend,
  onToggleVoice,
  loading,
  docked,
  showChips = false,
  isListening,
  micSupported,
  helperText = "",
  communityWater = 0,
  communityCo2 = 0,
  uniqueUsers = 0,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasValue = useMemo(() => value.trim().length > 0, [value]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, docked ? 240 : 300);
    el.style.height = `${next}px`;
    el.style.overflowY =
      el.scrollHeight > (docked ? 240 : 300) ? "auto" : "hidden";
  }, [value, docked]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleLearnMore() {
    setMenuOpen(false);
    window.location.href = "/learn";
  }

  function handleSeeCode() {
    setMenuOpen(false);
    window.open(
      "https://github.com/southy404/gemini-footprint-tracker",
      "_blank"
    );
  }

  const chips = [
    {
      label: "🌍 What is GFT?",
      prompt:
        "What is Gemini Footprint Tracker and how does it measure water usage and CO2 impact?",
    },
    {
      label: "♻️ Reduce footprint",
      prompt: "How can I reduce both water consumption and CO2 footprint?",
    },
    {
      label: "🤖 How can AI help?",
      prompt:
        "How can AI help reduce both water consumption and CO2 footprint?",
    },
    {
      label: "📊 Compare impact",
      prompt: `Compare this community AI usage with real-world equivalents:\n\nWater used: ${formatWater(
        communityWater
      )}\nCO2 emitted: ${formatCo2(communityCo2)}\nUnique users: ${formatUsers(
        uniqueUsers
      )}\n\nExplain using relatable examples like showers, driving distances, or everyday habits.`,
    },
  ];

  return (
    <motion.div
      layout
      layoutId="shared-gemini-composer"
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
      className="w-full max-w-[900px]"
    >
      <div
        className={`composer w-full rounded-[30px] border shadow-[0_20px_80px_rgba(0,0,0,0.42)] backdrop-blur-[26px] ${
          isListening
            ? "border-[#8ab4ff]/30 bg-[rgba(33,39,52,0.96)]"
            : "border-white/10 bg-[#1d1f27]/94"
        } ${docked ? "px-5 py-4" : "px-5 py-5"}`}
      >
        <textarea
          ref={textareaRef}
          className={`w-full resize-none border-none bg-transparent pr-2 font-normal tracking-[-0.01em] text-white outline-none placeholder:text-[#b7bfcb] ${
            docked
              ? "min-h-[52px] max-h-[240px] text-[15px] leading-[1.55]"
              : "min-h-[78px] max-h-[300px] text-[16px] leading-[1.65]"
          }`}
          style={{ scrollbarWidth: "thin" }}
          placeholder={isListening ? "Listening…" : "Ask Gemini"}
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
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="transition hover:text-white"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Plus size={18} />
              </button>

              {menuOpen && (
                <div className="absolute bottom-[calc(100%+10px)] left-0 z-20 min-w-[180px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0a0c10] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-[24px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.66)]">
                  <button
                    type="button"
                    onClick={handleLearnMore}
                    className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm text-[#d8e2f2] transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Learn more
                  </button>
                  <button
                    type="button"
                    onClick={handleSeeCode}
                    className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm text-[#d8e2f2] transition hover:bg-white/[0.06] hover:text-white"
                  >
                    See code
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleVoice}
              disabled={loading || !micSupported}
              aria-label={
                isListening ? "Stop voice input" : "Start voice input"
              }
              aria-pressed={isListening}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                isListening
                  ? "border-[#8ab4ff]/35 bg-[#8ab4ff]/14 text-white"
                  : "border-white/10 bg-white/[0.05] text-[#a4adba] hover:bg-white/[0.08] hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <Mic size={18} />
              <span className="hidden sm:inline">
                {isListening ? "Listening" : "Voice"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSend()}
              disabled={loading || !hasValue}
              aria-label="Send message"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${
                hasValue
                  ? "border-[#8ab4ff]/30 bg-[#8ab4ff]/12 text-white hover:border-[#8ab4ff]/40 hover:bg-[#8ab4ff]/18"
                  : "border-white/10 bg-white/[0.05] text-[#a4adba]"
              }`}
            >
              <SendHorizontal size={17} />
              <span>{loading ? "Sending..." : "Send"}</span>
            </button>
          </div>
        </div>
      </div>

      {showChips && (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSend(chip.prompt)}
              className="rounded-full border border-white/5 bg-white/[0.045] px-4 py-2.5 text-sm font-normal text-[#dfe5f2] transition hover:text-white"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Helper text only shown after first message (docked state) */}
      {docked && (
        <div className="mt-2 text-center text-xs text-[#7d8593]">
          {helperText ||
            "Gemini can make mistakes. Footprint values are estimates layered on top of Gemini usage metadata."}
        </div>
      )}
    </motion.div>
  );
}
