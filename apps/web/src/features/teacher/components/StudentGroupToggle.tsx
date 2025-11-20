type StudentGroupToggleProps = {
  value: 'A' | 'B';
  onToggle: () => void;
};

export default function StudentGroupToggle({ value, onToggle }: StudentGroupToggleProps) {
  const isA = value === 'A';
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center justify-between w-20 rounded-full px-2 py-1 text-sm font-semibold transition ${isA ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}
    >
      <span>Gr. {value}</span>
      <span
        className={`h-5 w-5 rounded-full bg-white shadow transition ${isA ? '' : 'translate-x-2'}`}
        aria-hidden
      />
    </button>
  );
}
