type Props = {
  loading?: boolean;
  className?: string;
};

export default function GeminiMark({ loading = false, className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`gemini-mark ${
        loading ? "gemini-mark-loading" : ""
      } ${className}`}
    />
  );
}
