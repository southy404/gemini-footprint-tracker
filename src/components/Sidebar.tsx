import { Droplets, Cloud, Menu, Plus, Settings } from "lucide-react";
import type { SessionEntry } from "../types/chat";

type Props = {
  menuOpen: boolean;
  sessionEntries: SessionEntry[];
  onToggleMenu: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
};

function SidebarButton({
  icon,
  label,
  onClick,
  menuOpen,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  menuOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex h-11 items-center rounded-2xl text-[#c5cfde] transition-all duration-200 hover:bg-white/10 hover:text-white ${
        menuOpen ? "gap-3 px-3" : "justify-center px-0"
      }`}
      title={label}
    >
      <span className="shrink-0 opacity-90 transition group-hover:opacity-100">
        {icon}
      </span>
      {menuOpen && (
        <span className="truncate text-sm font-medium">{label}</span>
      )}
    </button>
  );
}

export default function Sidebar({
  menuOpen,
  sessionEntries,
  onToggleMenu,
  onNewChat,
  onOpenSettings,
}: Props) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden backdrop-blur-[26px] transition-[width,background-color] duration-200 lg:flex ${
        menuOpen
          ? "w-[280px] border-r border-white/10 bg-[rgba(8,10,14,0.72)] shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
          : "w-[72px] border-r border-white/10 bg-[rgba(10,12,16,0.52)] shadow-none supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)]"
      }`}
    >
      <div className={menuOpen ? "border-b border-white/8 p-3" : "p-3"}>
        <div className="flex flex-col gap-2">
          <SidebarButton
            icon={<Menu size={18} />}
            label="Menu"
            onClick={onToggleMenu}
            menuOpen={menuOpen}
          />

          {menuOpen && (
            <>
              <SidebarButton
                icon={<Plus size={18} />}
                label="New chat"
                onClick={onNewChat}
                menuOpen={menuOpen}
              />

              <SidebarButton
                icon={<Settings size={18} />}
                label="API settings"
                onClick={onOpenSettings}
                menuOpen={menuOpen}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 pb-3 pt-3 custom-scrollbar">
        {menuOpen && (
          <>
            <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#93a2ba]">
              Request history
            </div>

            <div className="grid gap-2">
              {sessionEntries.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-[#9ca8bc] backdrop-blur-[20px]">
                  No messages yet
                </div>
              ) : (
                sessionEntries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-left backdrop-blur-[20px] transition-all duration-200 hover:border-white/14 hover:bg-white/[0.08]"
                    title={entry.prompt}
                  >
                    <div className="mb-2 overflow-hidden break-words text-[13px] font-medium leading-5 text-[#eef3fb] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                      {entry.prompt}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#c3cddd]">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Droplets size={12} className="text-cyan-300" />
                        {entry.water.toFixed(1)} ml
                      </span>

                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Cloud size={12} className="text-sky-300" />
                        {entry.co2.toFixed(2)} g
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
