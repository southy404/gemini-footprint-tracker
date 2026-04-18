type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  mode: string;
  setMode: (m: any) => void;
};

export default function Composer({
  value,
  onChange,
  onSend,
  mode,
  setMode,
}: Props) {
  const isActive = value.trim().length > 0;

  return (
    <div className={`composer ${isActive ? "composer-active" : ""}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask Gemini"
      />
      <div className="row">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="eco">Eco</option>
        </select>
        <button className="send-btn" onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
}
