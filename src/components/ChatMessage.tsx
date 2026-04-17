import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatItem } from "../types/chat";

type Props = {
  item: ChatItem;
  isLast?: boolean;
};

export default function ChatMessage({ item, isLast = false }: Props) {
  if (item.role === "user") {
    const longMessage = item.content.length > 90 || item.content.includes("\n");

    return (
      <div className={`flex justify-end ${isLast ? "mb-10" : ""}`}>
        <div
          className={`rounded-[26px] border border-white/10 bg-white/[0.08] px-4 py-3 text-[15px] leading-7 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-[22px] whitespace-pre-wrap break-words ${
            longMessage ? "max-w-[640px]" : "max-w-[260px]"
          }`}
        >
          {item.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${isLast ? "mb-20 md:mb-24" : ""}`}>
      <div className="grid w-full max-w-[760px] grid-cols-[24px_1fr] gap-4">
        <div className="mt-1 text-xl leading-none text-[#8ab4ff]">✦</div>

        <div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
            <div className="prose prose-invert max-w-none prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-strong:text-white prose-headings:text-white prose-code:text-[#dbe1ef] prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-white/15 prose-blockquote:text-[#cfd6e4] text-[15px] leading-7 text-[#f2f5fd]">
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
                      className="text-[#9fc0ff] underline underline-offset-4 hover:text-white"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ inline, children, ...props }: any) =>
                    inline ? (
                      <code
                        className="rounded bg-white/8 px-1.5 py-0.5 text-[0.95em]"
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

          {!item.isLoading && (
            <div className="mt-3 flex gap-3 text-[#bfd0e7]">👍 👎 ⟳ ⧉ ⋮</div>
          )}
        </div>
      </div>
    </div>
  );
}
