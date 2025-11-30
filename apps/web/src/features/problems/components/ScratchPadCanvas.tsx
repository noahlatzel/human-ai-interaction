import { useEffect, useRef, useState } from 'react';

type ScratchPadCanvasProps = {
  onChange?: (dataUrl: string | null) => void;
};

export default function ScratchPadCanvas({ onChange }: ScratchPadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    contextRef.current = ctx;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#111827';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPosition = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event) {
      const touch = event.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasContent(true);
    const ctx = contextRef.current;
    if (!ctx) return;
    const { x, y } = getPosition(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    event.preventDefault();
    const ctx = contextRef.current;
    if (!ctx) return;
    const { x, y } = getPosition(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange?.(null);
    setHasContent(false);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1 rounded-lg bg-white/90 border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm hover:bg-white"
        >
          Löschen
        </button>
      </div>
      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm relative">
        <canvas
          ref={canvasRef}
          className="w-full h-72 md:h-80 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasContent && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-slate-400 text-sm font-medium">Zeichne hier deine Lösung</div>
          </div>
        )}
      </div>
    </div>
  );
}
