type ScratchPadTextProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ScratchPadText({ value, onChange }: ScratchPadTextProps) {
  return (
    <div className="space-y-2">
      <textarea
        id="text-answer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Gib hier dein Ergebnis ein."
        className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        rows={6}
      />
    </div>
  );
}
