import { useState, useEffect } from 'react';
import studentAvatar from '../../../assets/studentAvatarPlaceholder.png';
import studentFemaleAvatar from '../../../assets/female_AvatarPlaceholder.png';
import teacherAvatar from '../../../assets/teacherAvatarPlaceholder.png';
import { updateUser } from '../../auth/api/user';
import { ApiError } from '../../../lib/apiClient';
import type { Gender } from '../../../types/user';

type ProfileMockProps = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | null;
  classGrade?: number | null;
  classLabel?: string | null;
  streak?: number;
  xp?: number;
  solvedTasks?: number;
  gender?: Gender | null;
};

export default function ProfileMock({ firstName, lastName, email, role, classGrade, classLabel, streak = 0, xp = 0, solvedTasks = 0, gender }: ProfileMockProps) {
  // Compute class display name from grade and label
  const classDisplayName = classGrade ? `${classGrade}${classLabel || ''}` : null;
  
  const [profile, setProfile] = useState({
    firstName: firstName ?? 'Max',
    lastName: lastName ?? 'Mustermann',
    email: email ?? 'max@example.com',
    role: role ?? 'student',
    klasse: classDisplayName ?? '',
    gender: gender ?? 'male' as Gender,
    newPassword: '',
    confirmPassword: '',
  });

  // Sync state with props when they change
  useEffect(() => {
    const updatedClass = classGrade ? `${classGrade}${classLabel || ''}` : '';
    setProfile((prev) => ({
      ...prev,
      firstName: firstName ?? prev.firstName,
      lastName: lastName ?? prev.lastName,
      email: email ?? prev.email,
      role: role ?? prev.role,
      klasse: updatedClass || prev.klasse,
      gender: gender ?? prev.gender,
    }));
  }, [firstName, lastName, email, role, classGrade, classLabel, gender]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (key: keyof typeof profile, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setMessage(null);
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwörter stimmen nicht überein.' });
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      };
      if (profile.newPassword) {
        payload.password = profile.newPassword;
      }

      await updateUser(payload);
      setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert.' });
      setProfile(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err) {
      const errorMsg = err instanceof ApiError ? err.message : 'Fehler beim Speichern.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Lehrer';
      case 'admin':
        return 'Admin';
      default:
        return 'Schüler';
    }
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'female' ? 'Weiblich' : 'Männlich';
  };

  // Select avatar based on role and gender
  const getAvatarSrc = () => {
    if (profile.role === 'teacher') return teacherAvatar;
    return profile.gender === 'female' ? studentFemaleAvatar : studentAvatar;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4 flex items-center gap-4">
        <img src={avatarSrc} alt="Avatar" className="h-14 w-14 rounded-full border border-white shadow object-contain bg-white" />
        <div>
          <p className="text-sm text-slate-600">{getRoleLabel(profile.role)}</p>
          <p className="text-lg font-bold text-slate-900">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-slate-600">{profile.email}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
        <p className="text-sm font-semibold text-slate-900">Profil bearbeiten</p>
        
        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

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
              readOnly
              disabled
            />
          </label>
          <label className="text-sm font-medium text-slate-700 space-y-1">
            Geschlecht
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={getGenderLabel(profile.gender)}
              readOnly
              disabled
            />
          </label>
          <label className="text-sm font-medium text-slate-700 space-y-1">
            Neues Passwort
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={profile.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 space-y-1">
            Passwort bestätigen
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={profile.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Speichere...' : 'Änderungen speichern'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: 'XP Gesamt', value: xp.toString(), icon: '📊' },
          { label: streak === 1 ? 'Tag Streak' : 'Tage Streak', value: streak.toString(), icon: '🔥' },
          { label: 'Aufgaben gelöst', value: solvedTasks.toString(), icon: '✅' },
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
