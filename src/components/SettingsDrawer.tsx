import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  menuPinned: boolean;
  setMenuPinned: (v: boolean) => void;
  warning: string;
};

export default function SettingsDrawer({
  open,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
  menuPinned,
  setMenuPinned,
  warning,
}: Props) {
  return (
    <div
      className={`fixed top-20 z-40 rounded-[26px] border border-white/15 bg-white/[0.09] p-5 shadow-2xl shadow-black/40 backdrop-blur-[28px] transition-all duration-200
      ${
        open
          ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
          : "pointer-events-none opacity-0 -translate-y-2 scale-[0.98]"
      }
      left-3 right-3 md:right-6 md:left-auto md:w-[380px]`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-lg font-medium text-white">
            Gemini Footprint Tracker
          </div>
          <div className="text-sm leading-6 text-[#d3ddef]">
            Configure your Gemini API key and model.
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-2 text-[#c3cee0] hover:bg-white/8 hover:text-white transition"
          aria-label="Close settings"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-3 grid gap-2">
        <label className="text-sm text-[#d3ddef]">Gemini API key</label>
        <input
          type="password"
          placeholder="Paste your Google AI Studio key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-[#9ca9bd]"
        />
      </div>

      <div className="mb-3 grid gap-2">
        <label className="text-sm text-[#d3ddef]">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-white outline-none"
        >
          <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
          <option value="gemini-2.5-flash">gemini-2.5-flash</option>
          <option value="gemini-2.5-pro">gemini-2.5-pro</option>
        </select>
      </div>

      <div className="mb-3 flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/[0.06] p-4">
        <div>
          <strong className="block text-white">Keep sidebar open</strong>
          <span className="text-xs leading-5 text-[#c3cee0]">
            Useful while adjusting API settings.
          </span>
        </div>
        <input
          type="checkbox"
          checked={menuPinned}
          onChange={(e) => setMenuPinned(e.target.checked)}
          className="h-4 w-4"
        />
      </div>

      <div className="mt-2 text-xs leading-6 text-[#c3cee0]">
        This app uses Google’s published Gemini median baseline and transparent
        scaling logic based on Gemini usage metadata.
      </div>

      {!!warning && (
        <div className="mt-2 text-xs text-amber-300">{warning}</div>
      )}
    </div>
  );
}
