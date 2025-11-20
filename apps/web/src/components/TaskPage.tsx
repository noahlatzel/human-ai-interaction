import React, { useRef, useState, useEffect } from 'react';
import squirrelImage from '../assets/WhatsApp_Image_2025-11-19_at_19.11.00-removebg-preview.png';
import forestBackground from '../assets/ChatGPT Image 19. Nov. 2025, 19_18_02.png';

interface Task {
  text: string;
  source?: string;
}

interface TaskPageProps {
  task?: Task;
  onSubmit?: (data: { task: Task; sketch: string | null; textAnswer: string }) => void;
  onBackToDashboard?: () => void;
  onNextTask?: () => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ task, onSubmit, onBackToDashboard, onNextTask }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  
  const defaultTask: Task = task || {
    text: "Lisa hat 600 Legosteine. Die Hälfte davon ist rot. Die andere Hälfte besteht zu gleichen Teilen aus gelben und blauen Steinen. Wie viele Legosteine sind es jeweils?",
    source: "Wenn du dir unsicher bist, frage das Eichhörnchen"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Reconfigure canvas properties after resize (setting width/height resets canvas state)
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    setContext(ctx);
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas || !context) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const canvas = canvasRef.current;
      const imageData = canvas ? canvas.toDataURL('image/png') : null;
      onSubmit({
        task: defaultTask,
        sketch: imageData,
        textAnswer: textAnswer
      });
    }
  };

  return (
    <div className="task-page-wrapper" style={{ 
      backgroundImage: `url("${forestBackground}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="task-page-overlay"></div>
      
      {/* Back Button */}
      <button 
        className="task-back-btn"
        onClick={onBackToDashboard}
        aria-label="Zurück zum Dashboard"
      >
        ← Zurück
      </button>

      <div className="task-page-main">
        {/* Task Statement Card */}
        <div className="task-statement-card">
          <div className="task-header">
            <h2 className="task-title">Aufgabe</h2>
            <div className="task-number">#1</div>
          </div>
          <div className="task-question-box">
            <p className="task-question-text">{defaultTask.text}</p>
          </div>
          {defaultTask.source && (
            <div className="task-hint">
              <span className="hint-icon">💡</span>
              <span className="hint-text">{defaultTask.source}</span>
            </div>
          )}
        </div>

        {/* Solution Section */}
        <div className="task-solution-section">
          <div className="solution-header">
            <h3 className="solution-title">Deine Lösung</h3>
            <button 
              className="clear-canvas-btn"
              onClick={clearCanvas}
              aria-label="Sketch löschen"
            >
              <span className="clear-icon">🗑️</span>
              <span>Löschen</span>
            </button>
          </div>

          {/* Drawing Canvas */}
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              className="drawing-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="canvas-placeholder">
              <span className="placeholder-icon">✏️</span>
              <span className="placeholder-text">Zeichne hier deine Lösung</span>
            </div>
          </div>

          {/* Text Answer */}
          <div className="text-answer-section">
            <label htmlFor="textAnswer" className="text-answer-label">
              Oder gib deine Antwort als Text ein:
            </label>
            <textarea
              id="textAnswer"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Gib hier deine Antwort ein..."
              className="text-answer-field"
              rows={4}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="task-actions">
          <button 
            className="submit-btn primary"
            onClick={handleSubmit}
          >
            <span>✓</span>
            <span>Abgeben</span>
          </button>
          <button 
            className="submit-btn secondary"
            onClick={onNextTask}
          >
            <span>→</span>
            <span>Nächste Aufgabe</span>
          </button>
        </div>
      </div>

      {/* AI Helper (Squirrel) */}
      <div className="task-helper">
        <div className="helper-bubble">
          <p className="helper-text">
            Brauchst du Hilfe? Klicke auf mich! 🐿️
          </p>
        </div>
        <div className="helper-squirrel">
          <img 
            src={squirrelImage} 
            alt="MatheBuddy Helper" 
            className="squirrel-img"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.nextSibling) {
                (target.nextSibling as HTMLElement).style.display = 'block';
              }
            }}
          />
          <div className="squirrel-emoji" style={{ display: 'none' }}>🐿️</div>
        </div>
      </div>

      <style>{`
        .task-page-wrapper {
          min-height: 100vh;
          position: relative;
          padding: 20px;
          background-color: #87CEEB;
          overflow-x: hidden;
        }

        .task-page-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(135, 206, 235, 0.05) 0%,
            transparent 20%,
            transparent 80%,
            rgba(34, 139, 34, 0.05) 100%
          );
          z-index: 0;
          pointer-events: none;
        }

        .task-back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(33, 150, 243, 0.3);
          border-radius: 16px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #2196F3;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .task-back-btn:hover {
          background: white;
          border-color: #2196F3;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .task-page-main {
          max-width: 900px;
          margin: 0 auto;
          padding-top: 80px;
          padding-bottom: 120px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Task Statement Card */
        .task-statement-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .task-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .task-number {
          background: linear-gradient(135deg, #2196F3 0%, #4CAF50 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
        }

        .task-question-box {
          background: rgba(33, 150, 243, 0.08);
          border-left: 4px solid #2196F3;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .task-question-text {
          font-size: 20px;
          line-height: 1.6;
          color: #333;
          margin: 0;
          font-weight: 500;
        }

        .task-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
        }

        .hint-icon {
          font-size: 20px;
        }

        .hint-text {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        /* Solution Section */
        .task-solution-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .solution-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .solution-title {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .clear-canvas-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(244, 67, 54, 0.1);
          border: 2px solid rgba(244, 67, 54, 0.3);
          border-radius: 12px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #f44336;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-canvas-btn:hover {
          background: rgba(244, 67, 54, 0.2);
          border-color: #f44336;
        }

        .clear-icon {
          font-size: 16px;
        }

        /* Canvas Container */
        .canvas-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: white;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .drawing-canvas {
          width: 100%;
          height: 100%;
          display: block;
          cursor: crosshair;
          touch-action: none;
        }

        .canvas-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          pointer-events: none;
          opacity: 0.3;
        }

        .placeholder-icon {
          font-size: 48px;
        }

        .placeholder-text {
          font-size: 16px;
          color: #999;
          font-weight: 500;
        }

        /* Text Answer Section */
        .text-answer-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .text-answer-label {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .text-answer-field {
          width: 100%;
          padding: 16px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          font-size: 16px;
          font-family: inherit;
          background: white;
          color: #333;
          transition: all 0.3s ease;
          resize: vertical;
          min-height: 100px;
        }

        .text-answer-field:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }

        .text-answer-field::placeholder {
          color: #999;
        }

        /* Action Buttons */
        .task-actions {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .submit-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 32px;
          border: none;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .submit-btn.primary {
          background: linear-gradient(135deg, #2196F3 0%, #4CAF50 100%);
          color: white;
        }

        .submit-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
        }

        .submit-btn.secondary {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          color: #2196F3;
          border: 2px solid rgba(33, 150, 243, 0.3);
        }

        .submit-btn.secondary:hover {
          background: white;
          border-color: #2196F3;
          transform: translateY(-2px);
        }

        .submit-btn span:first-child {
          font-size: 20px;
        }

        /* AI Helper */
        .task-helper {
          position: fixed;
          right: 30px;
          bottom: 30px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          pointer-events: none;
        }

        .helper-bubble {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 3px solid #9C27B0;
          border-radius: 20px;
          padding: 16px 20px;
          max-width: 280px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          position: relative;
          pointer-events: auto;
        }

        .helper-bubble::after {
          content: '';
          position: absolute;
          bottom: -20px;
          right: 60px;
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 20px solid #9C27B0;
        }

        .helper-text {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
        }

        .helper-squirrel {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .helper-squirrel:hover {
          transform: scale(1.1);
        }

        .squirrel-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .squirrel-emoji {
          font-size: 200px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        /* Responsive */
        @media (max-width: 768px) {
          .task-page-main {
            padding-top: 70px;
            padding-left: 16px;
            padding-right: 16px;
          }

          .task-statement-card,
          .task-solution-section {
            padding: 20px;
          }

          .task-title {
            font-size: 24px;
          }

          .task-question-text {
            font-size: 18px;
          }

          .canvas-container {
            height: 300px;
          }

          .task-actions {
            flex-direction: column;
          }

          .task-helper {
            right: 15px;
            bottom: 15px;
          }

          .helper-bubble {
            max-width: 220px;
            padding: 12px 16px;
          }

          .helper-squirrel {
            width: 150px;
            height: 150px;
          }

          .task-back-btn {
            top: 10px;
            left: 10px;
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskPage;
