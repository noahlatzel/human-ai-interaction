import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Eraser } from 'lucide-react';
import squirrelMascot from '../assets/eichhörnchen.png';

interface StudentExerciseViewProps {
    onBack: () => void;
}

export default function StudentExerciseView({ onBack }: StudentExerciseViewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [answer, setAnswer] = useState('');
    const hasStartedDrawing = useRef(false);

    // Canvas drawing logic & Placeholder text
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#0f172a'; // slate-900

            if (!hasStartedDrawing.current) {
                drawPlaceholder(ctx, canvas.width, canvas.height);
            }
        };

        const drawPlaceholder = (context: CanvasRenderingContext2D, w: number, h: number) => {
            context.font = 'italic 20px sans-serif';
            context.fillStyle = '#cbd5e1'; // slate-300
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('... male deine Lösung hier ...', w / 2, h / 2);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (!hasStartedDrawing.current) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hasStartedDrawing.current = true;
        }

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.closePath();
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasStartedDrawing.current = false;

        ctx.font = 'italic 20px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('... male deine Lösung hier ...', canvas.width / 2, canvas.height / 2);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Zurück
                </button>
                <h2 className="text-xl font-bold text-slate-800">Aufgabenbereich</h2>
                <div className="w-24"></div>
            </div>

            {/* Task Description */}
            <div className="w-full text-center mb-4 px-4">
                <p className="text-lg md:text-xl text-slate-700 font-medium">
                    Lisa hat 5 Äpfel. Sie gibt Tim 2 Äpfel. Wie viele Äpfel hat Lisa noch?
                </p>
            </div>

            {/* Main Grid - Responsive (Tablets use md:grid-cols-3 to stay side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Left: Canvas Area */}
                <div className="md:col-span-2 h-[350px] relative">
                    <div className="w-full h-full bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm relative touch-none">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-full cursor-crosshair"
                        />
                        <button
                            onClick={clearCanvas}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                        >
                            <Eraser className="h-3.5 w-3.5" />
                            Löschen
                        </button>
                    </div>
                </div>

                {/* Right: Mascot & Speech Bubble Input */}
                <div className="md:col-span-1 h-full flex flex-col items-center justify-end">
                    <div className="relative w-full flex flex-col items-center">

                        {/* Speech Bubble Container */}
                        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 mb-6 shadow-sm relative w-full max-w-[240px]">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Lösung"
                                className="w-full text-center text-2xl font-bold text-slate-800 outline-none border-none bg-transparent placeholder:text-slate-300 placeholder:font-normal"
                            />

                            {/* Tail Border (Back Layer) */}
                            <svg className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 h-[22px] w-[26px] text-slate-200" viewBox="0 0 24 20" fill="currentColor" aria-hidden="true">
                                <path d="M12 20L0 0h24L12 20z" />
                            </svg>

                            {/* Tail Fill (Front Layer) */}
                            <svg className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 h-[20px] w-[24px] text-white z-10" viewBox="0 0 24 20" fill="currentColor" aria-hidden="true">
                                <path d="M12 20L0 0h24L12 20z" />
                            </svg>
                        </div>

                        {/* Mascot Image */}
                        <img
                            src={squirrelMascot}
                            alt="Lern-Maskottchen"
                            className="max-h-[220px] w-auto object-contain"
                        />
                    </div>
                </div>

                {/* Bottom Row: Check Button Only */}
                <div className="md:col-span-3 mt-auto">
                    <button
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center"
                    >
                        Antwort prüfen
                    </button>
                </div>
            </div>
        </div>
    );
}