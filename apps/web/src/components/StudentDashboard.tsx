import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Home, Calendar, Zap, User, LogOut } from 'lucide-react';
import StudentExerciseView from './StudentExerciseView';
import squirrelMascot from '../assets/eichhörnchen.png';
import { clearAuthToken } from '../services/auth';
import logoutVideo from '../assets/log_out.mp4';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [currentView, setCurrentView] = useState<'dashboard' | 'exercise'>('dashboard');
    const progress = 60; // mock progress percent

    const handleLogout = () => {
        setIsLoggingOut(true);
    };

    const finalizeLogout = () => {
        clearAuthToken();
        toast.success('Auf Wiedersehen!');
        navigate('/login');
    };

    // Build the main content depending on state to avoid nested JSX ternaries
    let content: ReactNode;
    if (isLoggingOut) {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center gap-8 p-8">
                <div className="flex flex-col justify-center items-start md:items-start text-left">
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Bis bald!</h2>
                    <p className="mt-4 text-slate-600">Übung macht den Meister.</p>

                    <button
                        onClick={finalizeLogout}
                        className="mt-6 px-4 py-2 rounded-md text-sm text-slate-800 bg-white/10 hover:bg-white/20 border border-white/10"
                    >
                        Logout sofort beenden
                    </button>
                </div>

                <div className="flex items-center justify-center w-full">
                    <div className="w-full rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                        <video
                            src={logoutVideo}
                            autoPlay
                            playsInline
                            muted
                            onEnded={finalizeLogout}
                            className="w-full h-full object-cover"
                            aria-label="Logout Animation"
                        />
                    </div>
                </div>
            </div>
        );
    } else if (currentView === 'dashboard') {
        content = (
            <>
                {/* Stats area */}
                <div className="flex items-center justify-between mb-6 mt-6">
                    <div className="flex items-center gap-6 w-full max-w-xl">
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600">Lvl 1</span>
                                <span className="text-sm text-slate-600">Lvl 2</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-xl h-4 overflow-hidden">
                                <div className="h-4 bg-gradient-to-r from-blue-600 to-green-600" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center ml-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white/60">
                            <Zap className="h-5 w-5 text-amber-500" />
                            <div className="text-sm font-semibold text-slate-800">Streak 7</div>
                        </div>
                    </div>
                </div>

                {/* Content: Action grid + Mascot */}
                <div className="flex flex-col md:flex-row items-start gap-8 flex-1">
                    {/* Main Action Grid (center) */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-6">
                            <button onClick={() => setCurrentView('exercise')} className="px-4 h-32 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center text-center">
                                <span className="whitespace-normal">Weiter mit nächster Aufgabe</span>
                            </button>

                            <button className="px-4 h-32 w-full rounded-2xl bg-white border border-slate-200 text-slate-800 font-medium shadow hover:shadow-md flex items-center justify-center">
                                Feedback
                            </button>

                            <button className="px-4 h-32 w-full rounded-2xl bg-white border border-slate-200 text-slate-800 font-medium shadow hover:shadow-md flex items-center justify-center">
                                Themen
                            </button>

                            <button className="px-4 h-32 w-full rounded-2xl bg-white border border-slate-200 text-slate-800 font-medium shadow hover:shadow-md flex items-center justify-center">
                                Fortschritt
                            </button>
                        </div>
                    </div>

                    {/* Mascot / Interaction Area */}
                    <div className="w-full md:w-56 flex flex-col items-center md:items-end gap-4">
                        <div className="max-w-xs bg-white/90 rounded-2xl px-4 py-3 shadow-sm text-slate-900">
                            <p className="text-sm">Hey, wie geht's dir heute? Lust auf Mathe?</p>
                        </div>

                        <div className="w-full flex items-center justify-center">
                            <img src={squirrelMascot} alt="Lern-Eichhörnchen" className="h-40 w-auto object-contain" />
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation inside the card */}
                <div className="mt-12 -mx-8 -mb-8">
                    <div className="w-full">
                        <div className="flex items-center justify-between px-12 py-6 bg-slate-50/80 backdrop-blur-sm rounded-b-[32px] border-t border-slate-200">
                            <button className="flex flex-col items-center text-blue-600">
                                <Home className="h-6 w-6" />
                                <span className="text-xs mt-1">Home</span>
                            </button>

                            <button className="flex flex-col items-center text-slate-600">
                                <Calendar className="h-6 w-6" />
                                <span className="text-xs mt-1">Kalender</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        content = (
            <div className="flex-1">
                <StudentExerciseView onBack={() => setCurrentView('dashboard')} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-10 px-4">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgba(59,130,246,0.12)] p-6 sm:p-8 md:p-10 max-w-5xl w-full border border-blue-100/50 flex flex-col min-h-[550px]">

                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dein Lernbereich</h1>
                        <p className="text-sm text-slate-500 mt-1">Willkommen zurück, Max</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button aria-label="Profile" className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-shadow shadow-sm">
                            <User className="h-5 w-5 text-slate-700" />
                        </button>
                        <button aria-label="Logout" onClick={handleLogout} className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-shadow shadow-sm">
                            <LogOut className="h-5 w-5 text-slate-700" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 border-t border-slate-200/60" />

                {content}
            </div>
        </div>
    );
}
