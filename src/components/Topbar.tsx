import { Cloud, Droplets, Users } from "lucide-react";

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

type Props = {
  communityWater: number;
  communityCo2: number;
  uniqueUsers: number;
  menuOpen: boolean;
};

function StatPill({
  icon,
  value,
  compact = false,
}: {
  icon: React.ReactNode;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-[18px] ${
        compact ? "px-2 py-1.5" : "px-4 py-2"
      }`}
    >
      <div
        className={`flex items-center whitespace-nowrap font-medium text-white ${
          compact ? "gap-1.5 text-[11px]" : "gap-2 text-sm"
        }`}
      >
        <span className="text-white/80">{icon}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8 fill-current"
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.248c0 4.526 2.865 8.367 6.839 9.722.5.096.682-.222.682-.494 0-.244-.009-.89-.014-1.747-2.782.617-3.37-1.367-3.37-1.367-.455-1.177-1.11-1.491-1.11-1.491-.908-.636.069-.623.069-.623 1.004.072 1.532 1.054 1.532 1.054.892 1.56 2.341 1.11 2.91.849.091-.664.349-1.11.635-1.365-2.221-.259-4.555-1.137-4.555-5.063 0-1.119.389-2.034 1.029-2.751-.103-.26-.446-1.303.098-2.717 0 0 .84-.276 2.75 1.051A9.303 9.303 0 0 1 12 6.836a9.27 9.27 0 0 1 2.504.349c1.909-1.327 2.748-1.051 2.748-1.051.546 1.414.202 2.457.1 2.717.64.717 1.028 1.632 1.028 2.751 0 3.936-2.338 4.801-4.566 5.055.359.318.679.944.679 1.903 0 1.374-.012 2.482-.012 2.82 0 .274.18.594.688.493C19.138 20.611 22 16.772 22 12.248 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

export default function Topbar({
  communityWater,
  communityCo2,
  uniqueUsers,
  menuOpen,
}: Props) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[70] h-16 border-b border-white/10 bg-[rgba(10,12,16,0.52)] backdrop-blur-[26px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)] transition-[left] duration-200 ${
        menuOpen ? "lg:left-[280px]" : "lg:left-[72px]"
      }`}
    >
      <div className="flex h-full items-center justify-between gap-2 px-3 md:px-6">
        <div className="min-w-0 shrink-0 text-white">
          <div className="block text-[14px] font-medium tracking-[-0.02em] sm:hidden">
            GFT
          </div>
          <div className="hidden truncate text-[15px] font-medium tracking-[-0.02em] text-white sm:block md:text-[17px]">
            Gemini Footprint Tracker
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2 md:gap-3">
          <div className="hidden items-center gap-2 sm:flex md:gap-3">
            <StatPill
              icon={<Users size={14} className="text-violet-300" />}
              value={formatUsers(uniqueUsers)}
            />
            <StatPill
              icon={<Droplets size={14} className="text-cyan-300" />}
              value={formatWater(communityWater)}
            />
            <StatPill
              icon={<Cloud size={14} className="text-sky-300" />}
              value={formatCo2(communityCo2)}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:hidden">
            <StatPill
              compact
              icon={<Users size={12} className="text-violet-300" />}
              value={formatUsers(uniqueUsers)}
            />
            <StatPill
              compact
              icon={<Droplets size={12} className="text-cyan-300" />}
              value={formatWater(communityWater)}
            />
            <StatPill
              compact
              icon={<Cloud size={12} className="text-sky-300" />}
              value={formatCo2(communityCo2)}
            />
          </div>

          <a
            href="https://github.com/southy404/gemini-footprint-tracker"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white/70 transition hover:text-white"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </header>
  );
}
