import type { ReactNode } from 'react';
import forestBackground from '../../../assets/forestBackground.png';
import studentAvatar from '../../../assets/studentAvatarPlaceholder.png';
import studentFemaleAvatar from '../../../assets/female_AvatarPlaceholder.png';
import type { Gender } from '../../../types/user';

type StudentLayoutProps = {
  userName: string;
  onLogout: () => void;
  children: ReactNode;
  streak?: number;
  navActive: 'home' | 'discover' | 'calendar' | 'profile' | 'community';
  onNavChange: (tab: 'home' | 'discover' | 'calendar' | 'profile' | 'community') => void;
  gender?: Gender;
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
  gender = 'male',
}: StudentLayoutProps) {
  const today = new Date();
  const avatarSrc = gender === 'female' ? studentFemaleAvatar : studentAvatar;

  const NavIcon = ({ type }: { type: string }) => {
    const iconClass = "w-6 h-6";
    
    switch (type) {
      case 'home':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'community':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      case 'discover':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case 'profile':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

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
              <span>{streak} {streak === 1 ? 'Tag' : 'Tage'}</span>
            </div>
            <div className="h-12 w-12 rounded-full border-2 border-white shadow overflow-hidden bg-white flex items-center justify-center">
              <img src={avatarSrc} alt="Avatar" className="h-full w-full object-contain" />
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-3 rounded-full bg-slate-900 text-white shadow hover:bg-slate-800 transition-colors"
              title="Abmelden"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 pb-28">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 backdrop-blur border-t border-amber-200/50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-5 text-center">
          <button
            type="button"
            onClick={() => onNavChange('home')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              navActive === 'home' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <NavIcon type="home" />
            <span className="text-xs font-semibold">Start</span>
          </button>
          <button
            type="button"
            onClick={() => onNavChange('community')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              navActive === 'community' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <NavIcon type="community" />
            <span className="text-xs font-semibold">Community</span>
          </button>
          <button
            type="button"
            onClick={() => onNavChange('calendar')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              navActive === 'calendar' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <NavIcon type="calendar" />
            <span className="text-xs font-semibold">Kalender</span>
          </button>
          <button
            type="button"
            onClick={() => onNavChange('discover')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              navActive === 'discover' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <NavIcon type="discover" />
            <span className="text-xs font-semibold">Entdecken</span>
          </button>
          <button
            type="button"
            onClick={() => onNavChange('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              navActive === 'profile' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <NavIcon type="profile" />
            <span className="text-xs font-semibold">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
