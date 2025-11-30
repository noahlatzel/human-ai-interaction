import type { ReactNode } from 'react';
import logo from '../../../assets/applicationIcon.webp';
import forestBackground from '../../../assets/forestBackground.png';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footnote?: ReactNode;
  badge?: string;
};

export default function AuthLayout({ title, subtitle, children, footnote, badge }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-10 px-4 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url(${forestBackground})`,
      }}
    >
      <div className="relative bg-white/90 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgba(59,130,246,0.12)] p-8 sm:p-10 md:p-12 max-w-md w-full border border-blue-100/50">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 shadow-lg rounded-3xl overflow-hidden">
            <img src={logo} alt="MathApp Logo" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              MathApp
            </h1>
            <p className="text-sm text-slate-500">Lerne Mathematik auf eine neue Art</p>
          </div>
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="space-y-2 text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>

        <div className="space-y-6">{children}</div>

        {footnote ? <div className="mt-6 text-center text-sm text-slate-600 space-y-2">{footnote}</div> : null}
      </div>
    </div>
  );
}
