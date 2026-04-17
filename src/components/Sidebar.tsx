import { Droplets, Flame, Menu, Plus, Settings } from "lucide-react";
import type { SessionEntry } from "../types/chat";

type Props = {
  menuOpen: boolean;
  sessionEntries: SessionEntry[];
  onToggleMenu: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
};

export default function Sidebar({
  menuOpen,
  sessionEntries,
  onToggleMenu,
  onNewChat,
  onOpenSettings,
}: Props) {
  return (
    <aside className="hidden lg:flex sticky top-0 h-screen flex-col overflow-hidden border-r border-white/8 bg-white/[0.03] backdrop-blur-[26px]">
      <div className="p-3 flex flex-col gap-2">
        <button
          onClick={onToggleMenu}
          className="h-10 rounded-xl px-3 text-[#c5cfde] hover:bg-white/8 hover:text-white flex items-center gap-3 transition"
        >
          <Menu size={18} />
          {menuOpen && <span>Menu</span>}
        </button>

        {menuOpen && (
          <>
            <button
              onClick={onNewChat}
              className="h-10 rounded-xl px-3 text-[#c5cfde] hover:bg-white/8 hover:text-white flex items-center gap-3 transition"
            >
              <Plus size={18} />
              <span>New chat</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="h-10 rounded-xl px-3 text-[#c5cfde] hover:bg-white/8 hover:text-white flex items-center gap-3 transition"
            >
              <Settings size={18} />
              <span>API settings</span>
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-auto px-3 pb-3">
        {menuOpen && (
          <>
            <div className="px-3 pb-2 pt-3 text-xs text-[#aab7cc]">
              Request history
            </div>

            <div className="grid gap-2">
              {sessionEntries.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-[#9ca8bc] backdrop-blur-[20px]">
                  No messages yet
                </div>
              ) : (
                sessionEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 backdrop-blur-[20px]"
                  >
                    <div className="mb-2 text-[12px] leading-5 text-[#eef3fb] break-words line-clamp-3">
                      {entry.prompt}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#c3cddd]">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Droplets size={12} className="text-cyan-300" />
                        {entry.water.toFixed(1)} ml
                      </span>

                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Flame size={12} className="text-sky-300" />
                        {entry.co2.toFixed(2)} g
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
