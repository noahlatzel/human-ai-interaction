import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { LoginFormData } from '../types/auth';
import { loginUser, storeAuthToken } from '../services/auth';
import logo from '../assets/login2.webp';

interface TeacherLoginProps {
    onLoginSuccess?: () => void;
}

export default function TeacherLogin({ onLoginSuccess }: TeacherLoginProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            usernameOrEmail: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            // Immer erfolgreich - Demo-Modus für Lehrer
            toast.success('Erfolgreich als Lehrer angemeldet!');
            // Simuliere einen Token für Demo-Zwecke
            const demoToken = 'teacher-demo-token-' + Date.now();
            storeAuthToken(demoToken, rememberMe);
            onLoginSuccess?.();
            // Navigate to teacher dashboard
            navigate('/teacher-dashboard');
        } catch (error) {
            toast.error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
            console.error('Teacher login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-10 px-4">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgba(59,130,246,0.12)] p-8 sm:p-10 md:p-12 max-w-md w-full border border-blue-100/50">
                {/* Branding Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 mb-4 shadow-lg rounded-3xl overflow-hidden">
                        <img src={logo} alt="MathApp Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MathApp</h1>
                    <p className="mt-2 text-sm text-slate-500">Lehrer-Login</p>
                </div>

                {/* Login Form */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Lehrer-Login</h2>
                        <p className="text-sm text-slate-500 mt-1">Melde dich mit deinen Lehrer-Zugangsdaten an</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="usernameOrEmail" className="block text-sm font-semibold text-slate-700 ml-1">
                                E-Mail
                            </label>
                            <input
                                id="usernameOrEmail"
                                type="text"
                                autoComplete="username"
                                disabled={isLoading}
                                {...register('usernameOrEmail')}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 transition-all focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 focus:border-blue-400 focus:ring-blue-100"
                                placeholder="lehrer@schule.de (optional)"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ml-1">
                                Passwort
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    {...register('password')}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 transition-all focus:ring-4 focus:outline-none pr-12 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 focus:border-blue-400 focus:ring-blue-100"
                                    placeholder="•••••••••• (optional)"
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </span>
                            </div>
                            <div className="text-right mt-2">
                                <a
                                    href="#"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toast('Passwort-zurücksetzen kommt bald!', { icon: '🔒' });
                                    }}
                                >
                                    Passwort vergessen?
                                </a>
                            </div>
                        </div>

                        {/* Remember Me Toggle */}
                        <div className="flex items-center justify-between py-4 px-1">
                            <label htmlFor="rememberToggle" className="text-sm font-semibold text-slate-700 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                                Angemeldet bleiben
                            </label>
                            <button
                                id="rememberToggle"
                                type="button"
                                role="switch"
                                aria-checked={rememberMe}
                                disabled={isLoading}
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${rememberMe ? 'bg-gradient-to-r from-blue-600 to-green-600' : 'bg-slate-300'
                                    }`}
                            >
                                <span
                                    className={`h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out ${rememberMe ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-4 mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-green-700 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Wird angemeldet...
                                </>
                            ) : (
                                'Als Lehrer anmelden'
                            )}
                        </button>
                    </form>

                    {/* Back to Student Login */}
                    <div className="pt-5 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            ← Zurück zur Schüler-Login-Seite
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

