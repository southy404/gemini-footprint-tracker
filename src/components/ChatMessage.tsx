import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, MoreHorizontal, RefreshCw } from "lucide-react";
import type { ChatItem } from "../types/chat";

type Props = {
  item: ChatItem;
  isLast?: boolean;
  onRedo?: () => void;
};

function GeminiMark({ loading = false }: { loading?: boolean }) {
  return (
    <div
      className={`gemini-mark ${loading ? "gemini-mark-loading" : ""}`}
      aria-hidden="true"
    />
  );
}

function GeminiLoadingRow() {
  return (
    <div className="mt-3 flex items-center gap-3 pl-1 text-[13px] text-[#9fb2cc] opacity-90">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-[14px]">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8ab4ff]/90 [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8ab4ff]/80 [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8ab4ff]/70" />
        </div>
        <span className="text-[#c9d7ea]">Generating</span>
      </div>
    </div>
  );
}

export default function ChatMessage({ item, isLast = false, onRedo }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function handleSeeImpact() {
    setMenuOpen(false);

    const metricsEl =
      document.getElementById("metrics-bar") ||
      document.querySelector("[data-metrics-bar='true']");

    if (metricsEl) {
      metricsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLearnMore() {
    setMenuOpen(false);
    window.location.href = "/learn";
  }

  if (item.role === "user") {
    const longMessage = item.content.length > 90 || item.content.includes("\n");

    return (
      <div className={`flex justify-end ${isLast ? "mb-10" : ""}`}>
        <div
          className={`whitespace-pre-wrap break-words rounded-[26px] border px-4 py-3 text-[15px] leading-7 text-white backdrop-blur-[22px] ${
            longMessage ? "max-w-[760px]" : "max-w-[360px]"
          } border-[#8ab4ff]/20 bg-[#8ab4ff]/10 shadow-[0_12px_36px_rgba(0,0,0,0.16)]`}
        >
          {item.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isLast ? "mb-20 md:mb-24" : ""}`}>
      <div className="grid w-full grid-cols-[28px_minmax(0,1fr)] gap-4">
        <div className="flex items-start justify-center pt-1">
          <GeminiMark loading={item.isLoading} />
        </div>

        <div className="min-w-0">
          <div className="rounded-[26px] border border-white/10 bg-[rgba(10,12,16,0.52)] px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-[24px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)]">
            <div className="prose prose-invert max-w-none text-[15px] leading-7 text-[#f2f5fd] prose-headings:text-white prose-strong:text-white prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-code:text-[#dbe1ef] prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.04] prose-blockquote:border-white/15 prose-blockquote:text-[#cfd6e4]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-3 list-disc pl-6">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-3 list-decimal pl-6">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9fc0ff] underline underline-offset-4 transition hover:text-white"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ inline, children, ...props }: any) =>
                    inline ? (
                      <code
                        className="rounded-lg bg-white/[0.08] px-1.5 py-0.5 text-[0.95em]"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code {...props}>{children}</code>
                    ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-2 border-white/15 pl-4 italic text-[#cfd6e4]">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {item.content}
              </ReactMarkdown>
            </div>
          </div>

          {item.isLoading ? (
            <GeminiLoadingRow />
          ) : (
            <div className="mt-3 flex items-center gap-2 pl-1 text-[13px] text-[#9fb2cc]">
              <button
                type="button"
                onClick={onRedo}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-[14px] transition hover:bg-white/[0.08] hover:text-white"
              >
                <RefreshCw size={14} />
                <span>Redo</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-[14px] transition hover:bg-white/[0.08] hover:text-white"
              >
                <Copy size={14} />
                <span>{copied ? "Copied" : "Copy response"}</span>
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-[14px] transition hover:bg-white/[0.08] hover:text-white"
                >
                  <MoreHorizontal size={14} />
                  <span>More</span>
                </button>

                {menuOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[180px] overflow-hidden rounded-[18px] border border-white/10 bg-[rgba(10,12,16,0.78)] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-[24px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.66)]">
                    <button
                      type="button"
                      onClick={handleSeeImpact}
                      className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm text-[#d8e2f2] transition hover:bg-white/[0.06] hover:text-white"
                    >
                      See impact
                    </button>

                    <button
                      type="button"
                      onClick={handleLearnMore}
                      className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm text-[#d8e2f2] transition hover:bg-white/[0.06] hover:text-white"
                    >
                      Learn more
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
