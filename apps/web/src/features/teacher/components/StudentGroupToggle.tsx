type StudentGroupToggleProps = {
  value: 'A' | 'B';
  onToggle: () => void;
};

export default function StudentGroupToggle({ value, onToggle }: StudentGroupToggleProps) {
  const isA = value === 'A';
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
      <span>Gr. {value}</span>
      <button
        type="button"
        onClick={onToggle}
        className="relative inline-flex h-7 w-16 items-center rounded-full bg-blue-100 border border-blue-200 transition hover:bg-blue-200"
        aria-label="Gruppe umschalten"
      >
        <span
          className={`absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            isA ? 'translate-x-0' : 'translate-x-9'
          }`}
          aria-hidden
        />
      </button>
    </div>
  );
}
