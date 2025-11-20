type ScratchPadToggleProps = {
  mode: 'draw' | 'text';
  onChange: (mode: 'draw' | 'text') => void;
};

export default function ScratchPadToggle({ mode, onChange }: ScratchPadToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
      <button
        type="button"
        onClick={() => onChange('draw')}
        className={`px-4 py-2 rounded-full transition ${
          mode === 'draw' ? 'bg-white shadow text-slate-900' : 'hover:text-slate-900'
        }`}
      >
        Zeichnen
      </button>
      <button
        type="button"
        onClick={() => onChange('text')}
        className={`px-4 py-2 rounded-full transition ${
          mode === 'text' ? 'bg-white shadow text-slate-900' : 'hover:text-slate-900'
        }`}
      >
        Text
      </button>
    </div>
  );
}
