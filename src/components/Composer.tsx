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
  return (
    <div className="composer">
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
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
}
