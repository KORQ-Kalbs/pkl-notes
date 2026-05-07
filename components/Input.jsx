export default function Input({ label, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`.trim()}>
      {label ? (
        <span className="text-xs text-text-secondary">{label}</span>
      ) : null}
      <input className="input-custom" {...props} />
    </label>
  );
}
