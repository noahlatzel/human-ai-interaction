import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, LogOut, Edit2, Plus, X } from 'lucide-react';
import { clearAuthToken } from '../services/auth';
import logoutVideo from '../assets/log_out.mp4';
import plusIcon from '../assets/plus.png';
import addStudentIcon from '../assets/add_student.png';

type MathematicalOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

interface MathWordProblem {
    id: string;
    problemDescription: string;
    solution: string;
    difficulty: number; // 1 to 5
    operations: MathematicalOperation[];
}

interface Note {
    id: string;
    date: string; // YYYY-MM-DD
    content: string;
}

interface Student {
    id: string;
    name: string;
    initials: string;
    score: number;
    total: number;
    notes: Note[];
    classId: string;
}

const initialStudents: Student[] = [
    {
        id: '1',
        name: 'Lisa M.',
        initials: 'LM',
        score: 4,
        total: 12,
        notes: [
            { id: 'n1', date: '2025-11-01', content: 'Stark in Kopfrechnen, Übung: Schwerpunkt Brüche.' },
            { id: 'n2', date: '2025-11-12', content: 'Brauchte Hilfestellung bei Textaufgaben.' },
        ],
        classId: '3a',
    },
    { id: '2', name: 'Tim K.', initials: 'TK', score: 9, total: 12, notes: [{ id: 'n3', date: '2025-10-20', content: 'Gute Leistungen, weiter so.' }], classId: '3a' },
    { id: '3', name: 'Anna S.', initials: 'AS', score: 12, total: 12, notes: [], classId: '3b' },
    { id: '4', name: 'Jonas P.', initials: 'JP', score: 7, total: 10, notes: [], classId: '3b' },
    { id: '5', name: 'Mia L.', initials: 'ML', score: 5, total: 8, notes: [], classId: '4a' },
];

const availableClasses = ['Alle', '3a', '3b', '4a'];

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [noteInput, setNoteInput] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState<string>('new');
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);

    // Form state for creating a new math problem
    const [problemDescription, setProblemDescription] = useState('');
    const [solutionInput, setSolutionInput] = useState('');
    const [difficultyInput, setDifficultyInput] = useState<number>(3);
    const [selectedOperations, setSelectedOperations] = useState<MathematicalOperation[]>([]);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '', password: '', classId: '3a' });
    const [selectedClass, setSelectedClass] = useState<string>('3a');

    const filteredStudents = selectedClass === 'Alle' ? students : students.filter((s) => s.classId === selectedClass);

    const openNoteEditor = (s: Student) => {
        setSelectedStudent(s);
        setSelectedNoteId('new');
        setNoteInput('');
    };

    const closeNoteEditor = () => {
        setSelectedStudent(null);
        setNoteInput('');
    };

    const handleLogout = () => {
        // Start logout animation; actual cleanup happens in finalizeLogout
        setIsLoggingOut(true);
    };

    const finalizeLogout = () => {
        clearAuthToken();
        toast.success('Auf Wiedersehen!');
        navigate('/login');
    };

    const handleSaveNote = () => {
        if (!selectedStudent) return;

        setStudents((prev) => {
            return prev.map((st) => {
                if (st.id !== selectedStudent.id) return st;

                const notes = [...st.notes];

                if (selectedNoteId === 'new') {
                    const newNote: Note = {
                        id: `${st.id}-${Date.now()}`,
                        date: new Date().toISOString().slice(0, 10),
                        content: noteInput,
                    };
                    notes.push(newNote);
                } else {
                    // update existing note
                    const idx = notes.findIndex((n) => n.id === selectedNoteId);
                    if (idx !== -1) {
                        notes[idx] = { ...notes[idx], content: noteInput };
                    }
                }

                return { ...st, notes };
            });
        });

        closeNoteEditor();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-10 px-4">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgba(59,130,246,0.12)] p-8 sm:p-10 md:p-12 max-w-5xl w-full border border-blue-100/50">
                {isLoggingOut ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center gap-8 p-8">
                        {/* Left column: Text & Skip */}
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

                        {/* Right column: Video */}
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
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
                                <p className="text-sm text-slate-500 mt-1">Übersicht und Aktionen für die Klasse</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    aria-label="Profile"
                                    className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-shadow shadow-sm"
                                >
                                    <User className="h-5 w-5 text-slate-700" />
                                </button>

                                <button
                                    aria-label="Logout"
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-shadow shadow-sm"
                                >
                                    <LogOut className="h-5 w-5 text-slate-700" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-slate-200/60" />

                        {/* Main */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-semibold text-slate-900">Klassenübersicht</h2>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="bg-white/50 border border-slate-200 rounded-lg px-3 py-1 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-200"
                                    >
                                        {availableClasses.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Student List */}
                                <section className="bg-white/60 border border-slate-100 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-slate-800">Klassenliste</h3>
                                        <span className="text-sm text-slate-500">Success rate</span>
                                    </div>

                                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                                        {filteredStudents.map((s) => {
                                            const percent = s.total ? Math.round((s.score / s.total) * 100) : 0;
                                            return (
                                                <div key={s.id} className="flex items-center justify-between py-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-sm font-semibold text-slate-800 shadow-sm">
                                                            {s.initials}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900">{s.name}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex flex-col items-end mr-2">
                                                            <div className="text-xs text-slate-500">{s.score}/{s.total}</div>
                                                            <div className="text-sm text-slate-600 font-medium">{percent}%</div>
                                                        </div>

                                                        <button
                                                            onClick={() => openNoteEditor(s)}
                                                            aria-label={`Edit notes for ${s.name}`}
                                                            className="p-2 rounded-md hover:bg-slate-100 transition"
                                                        >
                                                            <Edit2 className="h-4 w-4 text-slate-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Right: Actions */}
                                <section className="flex flex-col gap-4">
                                    <button onClick={() => setShowStudentModal(true)} className="flex items-center justify-between border border-slate-200 rounded-xl p-6 bg-white/60 hover:shadow-lg transform hover:-translate-y-1 transition-all">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">Neuen Schüler anlegen</div>
                                            <div className="text-xs text-slate-500 mt-1">Lege einen neuen Schüler an</div>
                                        </div>
                                        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-visible">
                                            <img src={plusIcon} alt="Plus" className="h-12 w-12 object-contain -m-2" />
                                        </div>
                                    </button>

                                    <button onClick={() => setIsProblemModalOpen(true)} className="flex items-center justify-between border border-slate-200 rounded-xl p-6 bg-white/60 hover:shadow-lg transform hover:-translate-y-1 transition-all">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">Add new Math Problem</div>
                                            <div className="text-xs text-slate-500 mt-1">Create and assign a new exercise</div>
                                        </div>
                                        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-visible">
                                            <img src={addStudentIcon} alt="Add" className="h-16 w-16 object-contain -m-2" />
                                        </div>
                                    </button>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal / Overlay for editing notes */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeNoteEditor} />

                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-xl mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">{selectedStudent.name}</h3>
                                <p className="text-xs text-slate-500">ID: {selectedStudent.id}</p>
                            </div>
                            <button onClick={closeNoteEditor} className="text-slate-500 hover:text-slate-700">✕</button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Notizen</label>

                            {/* Dropdown to select existing note or New Note */}
                            <select
                                value={selectedNoteId}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setSelectedNoteId(id);
                                    if (id === 'new') {
                                        setNoteInput('');
                                    } else {
                                        const note = selectedStudent?.notes.find((n) => n.id === id);
                                        setNoteInput(note?.content ?? '');
                                    }
                                }}
                                className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                            >
                                <option value="new">➕ New Note</option>
                                {selectedStudent?.notes.map((n) => (
                                    <option key={n.id} value={n.id}>{n.date}</option>
                                ))}
                            </select>

                            <textarea
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                className="w-full min-h-[160px] rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                placeholder="Schreibe hier Notizen zum Schüler..."
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={closeNoteEditor}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNote}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Neue Rechenaufgabe erstellen */}
            {isProblemModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsProblemModalOpen(false)} />

                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Neue Rechenaufgabe erstellen</h3>
                                <p className="text-xs text-slate-500">Fülle die Felder aus und speichere die Aufgabe.</p>
                            </div>
                            <button onClick={() => setIsProblemModalOpen(false)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Beschreibung</label>
                                <textarea
                                    value={problemDescription}
                                    onChange={(e) => setProblemDescription(e.target.value)}
                                    placeholder="Beschreibe die Sachaufgabe..."
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Lösung</label>
                                <input
                                    type="text"
                                    value={solutionInput}
                                    onChange={(e) => setSolutionInput(e.target.value)}
                                    placeholder="Die richtige Lösung"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Schwierigkeitsgrad</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min={1}
                                        max={5}
                                        value={difficultyInput}
                                        onChange={(e) => setDifficultyInput(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="w-24 text-sm text-slate-700">Stufe {difficultyInput}</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Operationen</label>
                                <div className="flex flex-wrap gap-2">
                                    {(
                                        [
                                            { key: 'addition', label: 'Addition' },
                                            { key: 'subtraction', label: 'Subtraktion' },
                                            { key: 'multiplication', label: 'Multiplikation' },
                                            { key: 'division', label: 'Division' },
                                        ] as { key: MathematicalOperation; label: string }[]
                                    ).map((op) => {
                                        const active = selectedOperations.includes(op.key);
                                        return (
                                            <button
                                                key={op.key}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedOperations((prev) =>
                                                        prev.includes(op.key) ? prev.filter((p) => p !== op.key) : [...prev, op.key]
                                                    );
                                                }}
                                                className={`px-3 py-1 rounded-full border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}`}
                                            >
                                                {op.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsProblemModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={() => {
                                    if (!problemDescription.trim() || !solutionInput.trim() || selectedOperations.length === 0) return;
                                    const payload: MathWordProblem = {
                                        id: `p-${Date.now()}`,
                                        problemDescription: problemDescription.trim(),
                                        solution: solutionInput.trim(),
                                        difficulty: difficultyInput,
                                        operations: selectedOperations,
                                    };
                                    console.log('Neue Aufgabe:', payload);
                                    setProblemDescription('');
                                    setSolutionInput('');
                                    setDifficultyInput(3);
                                    setSelectedOperations([]);
                                    setIsProblemModalOpen(false);
                                }}
                                disabled={!problemDescription.trim() || !solutionInput.trim() || selectedOperations.length === 0}
                                className={`px-4 py-2 rounded-xl inline-flex items-center gap-2 text-white ${(!problemDescription.trim() || !solutionInput.trim() || selectedOperations.length === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'}`}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Speichern</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Neuen Schüler anlegen */}
            {showStudentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setShowStudentModal(false)} />

                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Neuen Schüler anlegen</h3>
                                <p className="text-xs text-slate-500">Bitte Daten eingeben</p>
                            </div>
                            <button onClick={() => setShowStudentModal(false)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vorname</label>
                                <input
                                    type="text"
                                    value={newStudent.firstName}
                                    onChange={(e) => setNewStudent((s) => ({ ...s, firstName: e.target.value }))}
                                    placeholder="Max"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nachname</label>
                                <input
                                    type="text"
                                    value={newStudent.lastName}
                                    onChange={(e) => setNewStudent((s) => ({ ...s, lastName: e.target.value }))}
                                    placeholder="Mustermann"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail Adresse</label>
                                <input
                                    type="email"
                                    value={newStudent.email}
                                    onChange={(e) => setNewStudent((s) => ({ ...s, email: e.target.value }))}
                                    placeholder="max@schule.de"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Passwort setzen</label>
                                <input
                                    type="password"
                                    value={newStudent.password}
                                    onChange={(e) => setNewStudent((s) => ({ ...s, password: e.target.value }))}
                                    placeholder="••••••"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Klasse zuweisen</label>
                                <select
                                    value={newStudent.classId}
                                    onChange={(e) => setNewStudent((s) => ({ ...s, classId: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-white"
                                >
                                    <option value="3a">3a</option>
                                    <option value="3b">3b</option>
                                    <option value="4a">4a</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowStudentModal(false)}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={() => {
                                    // Validation
                                    if (!newStudent.firstName.trim() || !newStudent.email.trim() || !newStudent.password.trim()) return;

                                    const id = `s-${Date.now()}`;
                                    const initials = (newStudent.firstName[0] || '').toUpperCase() + (newStudent.lastName ? (newStudent.lastName[0] || '').toUpperCase() : '');
                                    const studentObj: Student = {
                                        id,
                                        name: `${newStudent.firstName}${newStudent.lastName ? ' ' + newStudent.lastName[0] + '.' : ''}`,
                                        initials: initials || 'NN',
                                        score: 0,
                                        total: 0,
                                        notes: [],
                                        classId: newStudent.classId || '3a',
                                    };

                                    setStudents((prev) => [studentObj, ...prev]);
                                    setNewStudent({ firstName: '', lastName: '', email: '', password: '', classId: '3a' });
                                    setShowStudentModal(false);
                                }}
                                disabled={!newStudent.firstName.trim() || !newStudent.email.trim() || !newStudent.password.trim()}
                                className={`px-4 py-2 rounded-xl inline-flex items-center gap-2 text-white ${(!newStudent.firstName.trim() || !newStudent.email.trim() || !newStudent.password.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'}`}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Schüler hinzufügen</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
