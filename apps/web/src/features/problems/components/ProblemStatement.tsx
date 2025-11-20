type ProblemStatementProps = {
  text: string;
  hint?: string | null;
};

export default function ProblemStatement({ text, hint }: ProblemStatementProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 space-y-3">
      <p className="text-lg leading-relaxed text-slate-900">{text}</p>
      {hint ? (
        <div className="rounded-xl bg-amber-50 text-amber-800 px-3 py-2 text-sm font-medium flex items-center gap-2">
          <span aria-hidden>💡</span>
          <span>{hint}</span>
        </div>
      ) : null}
    </div>
  );
}
