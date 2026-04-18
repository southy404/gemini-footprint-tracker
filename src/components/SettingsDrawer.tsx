import { X, KeyRound, Database, PanelLeft } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  warning: string;
};

function FieldLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#aebcd2]">
      <span className="text-white/70">{icon}</span>
      <span>{children}</span>
    </label>
  );
}

export default function SettingsDrawer({
  open,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
  warning,
}: Props) {
  return (
    <div
      className={`fixed top-20 z-40 rounded-[28px] border border-white/10 bg-[rgba(10,12,16,0.72)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[30px] transition-all duration-200 supports-[backdrop-filter]:bg-[rgba(10,12,16,0.62)]
      ${
        open
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-2 scale-[0.985] opacity-0"
      }
      left-3 right-3 md:left-auto md:right-6 md:w-[420px]`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-[18px] font-medium tracking-[-0.02em] text-white">
            API settings
          </div>
          <div className="mt-1 max-w-[300px] text-sm leading-6 text-[#bcc9dd]">
            Add your Gemini API key to enable live footprint tracking and usage
            metadata.
          </div>
        </div>

        <button
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#c3cee0] transition hover:bg-white/[0.08] hover:text-white"
          aria-label="Close settings"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-4">
        <div>
          <FieldLabel icon={<KeyRound size={13} />}>Gemini API key</FieldLabel>
          <input
            type="password"
            placeholder="Paste your Google AI Studio key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-[#8190a7] focus:border-white/18 focus:bg-white/[0.07]"
          />
        </div>

        <div>
          <FieldLabel icon={<Database size={13} />}>Model</FieldLabel>
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-10 text-[15px] text-white outline-none transition focus:border-white/18 focus:bg-white/[0.07]"
            >
              <option value="gemini-2.5-flash-lite" className="bg-[#0b0f14]">
                gemini-2.5-flash-lite
              </option>
              <option value="gemini-2.5-flash" className="bg-[#0b0f14]">
                gemini-2.5-flash
              </option>
              <option value="gemini-2.5-pro" className="bg-[#0b0f14]">
                gemini-2.5-pro
              </option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#96a6be]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-200/80">
            Local storage
          </div>
          <div className="mt-1 text-sm leading-6 text-[#c8d7ea]">
            Your API key stays on this device in local browser storage. It is
            only used for direct requests to the selected API provider and is
            never stored on our servers.
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#aebcd2]">
            Methodology
          </div>
          <div className="mt-1 text-sm leading-6 text-[#bcc9dd]">
            This app uses Google’s published Gemini median baseline together
            with transparent scaling logic based on Gemini usage metadata.
          </div>
        </div>

        {!!warning && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-sm leading-6 text-amber-200">
            {warning}
          </div>
        )}
      </div>
    </div>
  );
}
