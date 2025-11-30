import type { ReactNode } from 'react';
import forestBackground from '../../../assets/forestBackground.png';
import studentAvatar from '../../../assets/studentAvatarPlaceholder.png';

type StudentLayoutProps = {
  userName: string;
  onLogout: () => void;
  children: ReactNode;
  streak?: number;
  navActive: 'home' | 'discover' | 'calendar' | 'profile';
  onNavChange: (tab: 'home' | 'discover' | 'calendar' | 'profile') => void;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);

export default function StudentLayout({
  userName,
  onLogout,
  children,
  streak = 0,
  navActive,
  onNavChange,
}: StudentLayoutProps) {
  const today = new Date();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url(${forestBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden />

      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Schüler:innen</p>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hallo {userName}</h1>
            <p className="text-sm text-slate-500">{formatDate(today)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 border border-emerald-200 px-4 py-2 text-emerald-700 font-semibold shadow-sm">
              <span aria-hidden>🔥</span>
              <span>{streak} Tage</span>
            </div>
            <div className="h-12 w-12 rounded-full border-2 border-white shadow overflow-hidden bg-white">
              <img src={studentAvatar} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow hover:bg-slate-950 transition"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 pb-28">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-200/70 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-4 text-center text-sm text-slate-600 font-semibold">
          <button
            type="button"
            onClick={() => onNavChange('home')}
            className={`flex items-center justify-center gap-1 transition ${
              navActive === 'home' ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            🏠 Start
          </button>
          <button
            type="button"
            onClick={() => onNavChange('discover')}
            className={`flex items-center justify-center gap-1 transition ${
              navActive === 'discover' ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            🧭 Entdecken
          </button>
          <button
            type="button"
            onClick={() => onNavChange('calendar')}
            className={`flex items-center justify-center gap-1 transition ${
              navActive === 'calendar' ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            🗓️ Kalender
          </button>
          <button
            type="button"
            onClick={() => onNavChange('profile')}
            className={`flex items-center justify-center gap-1 transition ${
              navActive === 'profile' ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            👤 Profil
          </button>
        </div>
      </nav>
    </div>
  );
}
