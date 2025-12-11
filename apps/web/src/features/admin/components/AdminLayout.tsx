import type { ReactNode } from 'react';
import forestBackground from '../../../assets/forestBackground.png';

type AdminLayoutProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminLayout({ title, subtitle, actions, children }: AdminLayoutProps) {
  return (
    <div
      className="min-h-screen px-4 py-10 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url(${forestBackground})`,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-purple-600 font-semibold">Admin-Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </header>
        <div className="bg-white/80 backdrop-blur-xl border border-purple-100/60 rounded-3xl shadow-[0_16px_60px_rgba(147,51,234,0.12)] p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
