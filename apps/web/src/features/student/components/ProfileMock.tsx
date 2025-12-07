import { useState } from 'react';
import studentAvatar from '../../../assets/studentAvatarPlaceholder.png';

type ProfileMockProps = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  onLogout: () => void;
};

export default function ProfileMock({ firstName, lastName, email, onLogout }: ProfileMockProps) {
  const [profile, setProfile] = useState({
    firstName: firstName ?? 'Max',
    lastName: lastName ?? 'Mustermann',
    email: email ?? 'max@example.com',
    klasse: '5a',
  });

  const handleChange = (key: keyof typeof profile, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4 flex items-center gap-4">
        <img src={studentAvatar} alt="Avatar" className="h-14 w-14 rounded-full border border-white shadow object-contain bg-white" />
        <div>
          <p className="text-sm text-slate-600">Profil (Mock)</p>
          <p className="text-lg font-bold text-slate-900">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-slate-600">{profile.email}</p>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow hover:bg-slate-950"
          >
            Abmelden
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
        <p className="text-sm font-semibold text-slate-900">Profil bearbeiten</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm font-medium text-slate-700 space-y-1">
            Vorname
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={profile.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700 space-y-1">
            Nachname
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={profile.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700 space-y-1">
            E-Mail
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700 space-y-1">
            Klasse
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={profile.klasse}
              onChange={(e) => handleChange('klasse', e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700"
        >
          Änderungen speichern (Mock)
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'XP Gesamt', value: '650', icon: '📊' },
          { label: 'Tage Streak', value: '7', icon: '🔥' },
          { label: 'Aufgaben gelöst', value: '42', icon: '✅' },
          { label: 'Abzeichen', value: '5', icon: '🏆' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/70 bg-white/90 backdrop-blur shadow-sm p-3 space-y-1 text-center"
          >
            <div className="text-xl" aria-hidden>
              {stat.icon}
            </div>
            <div className="text-lg font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
