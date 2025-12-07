import { useState } from 'react';

type Article = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  content: React.ReactNode;
};

const GeometryGame = () => {
  const [items, setItems] = useState([
    { id: 'clock', emoji: '⏰', name: 'Uhr', type: 'circle' },
    { id: 'dice', emoji: '🎲', name: 'Würfel', type: 'square' },
    { id: 'coin', emoji: '🪙', name: 'Münze', type: 'circle' },
    { id: 'window', emoji: '🪟', name: 'Fenster', type: 'square' },
    { id: 'cookie', emoji: '🍪', name: 'Keks', type: 'circle' },
    { id: 'present', emoji: '🎁', name: 'Geschenk', type: 'square' },
    { id: 'pizza', emoji: '🍕', name: 'Pizza', type: 'circle' },
    { id: 'frame', emoji: '🖼️', name: 'Bilderrahmen', type: 'square' },
    { id: 'ruler', emoji: '📐', name: 'Geodreieck', type: 'triangle' },
    { id: 'warning', emoji: '⚠️', name: 'Warnschild', type: 'triangle' },
    { id: 'tent', emoji: '⛺', name: 'Zelt', type: 'triangle' },
    { id: 'sandwich', emoji: '🥪', name: 'Sandwich', type: 'triangle' },
    { id: 'door', emoji: '🚪', name: 'Tür', type: 'rectangle' },
    { id: 'tv', emoji: '📺', name: 'Fernseher', type: 'rectangle' },
    { id: 'phone', emoji: '📱', name: 'Handy', type: 'rectangle' },
    { id: 'envelope', emoji: '✉️', name: 'Brief', type: 'rectangle' },
    { id: 'kite', emoji: '🪁', name: 'Drachen', type: 'parallelogram' },
    { id: 'diamond', emoji: '🔶', name: 'Edelstein', type: 'parallelogram' },
  ]);
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const handleSelect = (id: string) => {
    setSelectedItem(id);
    setFeedback(null);
  };

  const handleAssign = (targetType: string) => {
    if (!selectedItem) return;
    
    const item = items.find(i => i.id === selectedItem);
    if (!item) return;

    if (item.type === targetType) {
      setScore(s => s + 1);
      setItems(prev => prev.filter(i => i.id !== selectedItem));
      setSelectedItem(null);
      setFeedback({ msg: 'Super! Das stimmt.', type: 'success' });
    } else {
      setFeedback({ msg: 'Versuch es noch einmal!', type: 'error' });
    }
    
    setTimeout(() => setFeedback(null), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-emerald-50 rounded-2xl border border-emerald-100">
        <span className="text-6xl mb-4 block">🎉</span>
        <h3 className="text-2xl font-bold text-emerald-800 mb-2">Fantastisch!</h3>
        <p className="text-emerald-700 mb-6">Du hast alle Gegenstände richtig zugeordnet.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
        >
          Nochmal spielen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-600 font-medium">
          Wähle einen Gegenstand und klicke dann auf die richtige Form.
        </p>
        <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
          Punkte: {score}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-2 ${
          feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 min-h-[100px]">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`aspect-square flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
              selectedItem === item.id
                ? 'border-emerald-500 bg-emerald-50 scale-110 shadow-md z-10'
                : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-3xl mb-1">{item.emoji}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handleAssign('square')}
          className={`w-40 p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
            selectedItem ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer' : 'border-slate-200 bg-slate-50 opacity-70 cursor-default'
          }`}
        >
          <div className="w-16 h-16 border-4 border-emerald-600 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-10 h-10 bg-emerald-200 rounded-sm"></div>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-emerald-900">Quadrat</h4>
            <p className="text-xs text-emerald-700">4 gleiche Seiten</p>
          </div>
        </button>

        <button
          onClick={() => handleAssign('circle')}
          className={`w-40 p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
            selectedItem ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer' : 'border-slate-200 bg-slate-50 opacity-70 cursor-default'
          }`}
        >
          <div className="w-16 h-16 border-4 border-emerald-600 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-10 h-10 bg-emerald-200 rounded-full"></div>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-emerald-900">Kreis</h4>
            <p className="text-xs text-emerald-700">Rund</p>
          </div>
        </button>

        <button
          onClick={() => handleAssign('triangle')}
          className={`w-40 p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
            selectedItem ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer' : 'border-slate-200 bg-slate-50 opacity-70 cursor-default'
          }`}
        >
          <div className="w-16 h-16 border-4 border-emerald-600 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <polygon points="50,15 90,85 10,85" fill="#A7F3D0" stroke="#059669" strokeWidth="5" />
            </svg>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-emerald-900">Dreieck</h4>
            <p className="text-xs text-emerald-700">3 Ecken</p>
          </div>
        </button>

        <button
          onClick={() => handleAssign('rectangle')}
          className={`w-40 p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
            selectedItem ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer' : 'border-slate-200 bg-slate-50 opacity-70 cursor-default'
          }`}
        >
          <div className="w-16 h-16 border-4 border-emerald-600 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect x="10" y="25" width="80" height="50" fill="#A7F3D0" stroke="#059669" strokeWidth="5" />
            </svg>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-emerald-900">Rechteck</h4>
            <p className="text-xs text-emerald-700">Unterschiedliche Seiten</p>
          </div>
        </button>

        <button
          onClick={() => handleAssign('parallelogram')}
          className={`w-40 p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
            selectedItem ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer' : 'border-slate-200 bg-slate-50 opacity-70 cursor-default'
          }`}
        >
          <div className="w-16 h-16 border-4 border-emerald-600 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <polygon points="30,75 80,75 70,25 20,25" fill="#A7F3D0" stroke="#059669" strokeWidth="5" />
            </svg>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-emerald-900">Parallelogramm</h4>
            <p className="text-xs text-emerald-700">Schiefe Seiten</p>
          </div>
        </button>
      </div>
    </div>
  );
};

const ClockGame = () => {
  const [time, setTime] = useState({ hours: 9, minutes: 0 });

  const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
    setTime(prev => {
      if (type === 'hours') return { ...prev, hours: (prev.hours + value + 12) % 12 || 12 };
      return { ...prev, minutes: (prev.minutes + value + 60) % 60 };
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
      <div className="relative w-64 h-64 bg-white rounded-full border-8 border-slate-800 shadow-xl flex items-center justify-center">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-1 h-3 bg-slate-400" 
            style={{ transform: `rotate(${i * 30}deg) translateY(-110px)` }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute w-2 h-4 bg-slate-800" 
            style={{ transform: `rotate(${i * 90}deg) translateY(-110px)` }} />
        ))}
        <div className="absolute w-2 h-16 bg-slate-900 rounded-full origin-bottom"
          style={{ 
            transform: `rotate(${(time.hours % 12 + time.minutes / 60) * 30}deg)`,
            bottom: '50%',
            left: 'calc(50% - 4px)'
          }} />
        <div className="absolute w-1.5 h-24 bg-rose-500 rounded-full origin-bottom"
          style={{ 
            transform: `rotate(${time.minutes * 6}deg)`,
            bottom: '50%',
            left: 'calc(50% - 3px)'
          }} />
        <div className="absolute w-4 h-4 bg-rose-500 rounded-full border-2 border-white z-10" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-slate-100 p-6 rounded-2xl text-center min-w-[200px]">
          <div className="text-sm text-slate-500 mb-1">Digitale Anzeige</div>
          <div className="text-4xl font-mono font-bold text-slate-800 flex justify-center items-center gap-1">
            <span className="w-16 text-right">{String(time.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="w-16 text-left">{String(time.minutes).padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs font-bold text-center text-slate-500">STUNDEN</span>
            <button onClick={() => handleTimeChange('hours', 1)} className="w-full bg-slate-200 hover:bg-slate-300 p-2 rounded-lg font-bold transition-colors">+</button>
            <button onClick={() => handleTimeChange('hours', -1)} className="w-full bg-slate-200 hover:bg-slate-300 p-2 rounded-lg font-bold transition-colors">-</button>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs font-bold text-center text-slate-500">MINUTEN</span>
            <button onClick={() => handleTimeChange('minutes', 5)} className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-lg font-bold transition-colors">+5</button>
            <button onClick={() => handleTimeChange('minutes', -5)} className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-lg font-bold transition-colors">-5</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FractionGame = () => {
  const [denominator, setDenominator] = useState(2);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4">
        {[2, 3, 4, 6, 8].map(d => (
          <button 
            key={d}
            onClick={() => setDenominator(d)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${denominator === d ? 'bg-orange-500 text-white shadow-lg scale-110' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
          >
            1/{d}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 rounded-full bg-orange-100 border-4 border-orange-300 overflow-hidden shadow-inner">
        <div 
          className="w-full h-full rounded-full transition-all duration-500"
          style={{
            background: `repeating-conic-gradient(
              from 0deg,
              #FDBA74 0deg ${360/denominator - 2}deg,
              #FFF ${360/denominator - 2}deg ${360/denominator}deg
            )`
          }}
        >
          <div className="absolute top-10 left-10 w-4 h-4 bg-rose-500 rounded-full opacity-50"></div>
          <div className="absolute bottom-12 right-14 w-4 h-4 bg-rose-500 rounded-full opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-rose-500 rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl font-bold text-slate-800">
          Du hast die Pizza in <span className="text-orange-600">{denominator}</span> Teile geteilt.
        </p>
        <p className="text-slate-500 mt-2">
          Jedes Stück ist 1/{denominator} vom Ganzen.
        </p>
      </div>
    </div>
  );
};

const WeightGame = () => {
  const [leftItems, setLeftItems] = useState<{icon: string, weight: number}[]>([]);
  const [rightItems, setRightItems] = useState<{icon: string, weight: number}[]>([]);

  const leftWeight = leftItems.reduce((acc, item) => acc + item.weight, 0);
  const rightWeight = rightItems.reduce((acc, item) => acc + item.weight, 0);
  const rotation = Math.max(Math.min((rightWeight - leftWeight) * 2, 20), -20);

  const items = [
    { name: 'Feder', weight: 1, icon: '🪶' },
    { name: 'Apfel', weight: 5, icon: '🍎' },
    { name: 'Buch', weight: 10, icon: '📚' },
    { name: 'Stein', weight: 20, icon: '🪨' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-lg h-48 mb-12">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-32 bg-slate-800 rounded-t-lg"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full"></div>
        
        <div 
          className="absolute top-16 left-0 w-full h-2 bg-slate-700 rounded-full transition-transform duration-700 ease-out origin-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute left-0 top-1 w-24 h-24 border-x-2 border-b-2 border-slate-400 rounded-b-3xl bg-slate-50/50 flex flex-wrap content-end justify-center p-2 gap-1"
            style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: 'top center' }}>
            {leftItems.map((item, i) => <span key={i} className="text-xl animate-in zoom-in">{item.icon}</span>)}
          </div>
          <div className="absolute right-0 top-1 w-24 h-24 border-x-2 border-b-2 border-slate-400 rounded-b-3xl bg-slate-50/50 flex flex-wrap content-end justify-center p-2 gap-1"
            style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: 'top center' }}>
            {rightItems.map((item, i) => <span key={i} className="text-xl animate-in zoom-in">{item.icon}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
        <div className="bg-blue-50 p-4 rounded-2xl">
          <h3 className="font-bold text-blue-900 mb-3 text-center">Linke Schale</h3>
          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <button key={item.name} onClick={() => setLeftItems([...leftItems, item])} className="bg-white p-2 rounded-lg shadow-sm hover:bg-blue-100 transition-colors text-sm font-medium">
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl">
          <h3 className="font-bold text-green-900 mb-3 text-center">Rechte Schale</h3>
          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <button key={item.name} onClick={() => setRightItems([...rightItems, item])} className="bg-white p-2 rounded-lg shadow-sm hover:bg-green-100 transition-colors text-sm font-medium">
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <button onClick={() => { setLeftItems([]); setRightItems([]); }} className="mt-8 text-slate-500 underline hover:text-slate-800">Waage leeren</button>
    </div>
  );
};

const SymmetryGame = () => {
  const [grid, setGrid] = useState<boolean[][]>(Array.from({ length: 6 }, () => Array(6).fill(false)));

  const toggleCell = (r: number, c: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = !newGrid[r][c];
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center gap-1 mb-6">
        <div className="grid grid-cols-6 gap-1 bg-slate-200 p-1 rounded-l-lg border-r-4 border-dashed border-indigo-300">
          {grid.map((row, r) => (
            row.map((cell, c) => (
              <div 
                key={`l-${r}-${c}`}
                onClick={() => toggleCell(r, c)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm cursor-pointer transition-colors duration-200 ${cell ? 'bg-indigo-500' : 'bg-white hover:bg-indigo-50'}`}
              />
            ))
          ))}
        </div>

        <div className="grid grid-cols-6 gap-1 bg-slate-200 p-1 rounded-r-lg">
          {grid.map((row, r) => (
            [...row].reverse().map((cell, c) => (
              <div 
                key={`r-${r}-${c}`}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm transition-colors duration-200 ${cell ? 'bg-indigo-500 opacity-60' : 'bg-white'}`}
              />
            ))
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => setGrid(Array.from({ length: 6 }, () => Array(6).fill(false)))}
        className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 font-medium transition-colors"
      >
        Alles löschen
      </button>
    </div>
  );
};

const MoneyGame = () => {
  const [current, setCurrent] = useState(0);
  const target = 385;

  const coins = [
    { val: 1, label: '1ct', color: 'bg-rose-300' },
    { val: 2, label: '2ct', color: 'bg-rose-300' },
    { val: 5, label: '5ct', color: 'bg-rose-300' },
    { val: 10, label: '10ct', color: 'bg-amber-300' },
    { val: 20, label: '20ct', color: 'bg-amber-300' },
    { val: 50, label: '50ct', color: 'bg-amber-300' },
    { val: 100, label: '1€', color: 'bg-slate-300 border-amber-400 border-4' },
    { val: 200, label: '2€', color: 'bg-slate-300 border-amber-400 border-4' },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-lg text-slate-600">Bezahle den genauen Betrag: <span className="font-bold text-emerald-600 text-2xl">{(target / 100).toFixed(2).replace('.', ',')} €</span></p>

      <div className="bg-slate-800 text-white p-6 rounded-2xl w-full max-w-md text-center shadow-lg transition-all">
        <div className="text-sm text-slate-400 mb-1">Aktueller Betrag</div>
        <div className={`text-5xl font-mono font-bold transition-colors ${current === target ? 'text-emerald-400' : current > target ? 'text-rose-400' : 'text-white'}`}>
          {(current / 100).toFixed(2).replace('.', ',')} €
        </div>
        {current === target && (
          <div className="mt-2 text-emerald-400 font-bold animate-pulse">Perfekt! 🎉</div>
        )}
        {current > target && (
          <div className="mt-2 text-rose-400 font-bold">Zu viel!</div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {coins.map(coin => (
          <button 
            key={coin.val}
            onClick={() => setCurrent(c => c + coin.val)}
            className={`w-16 h-16 rounded-full flex items-center justify-center font-bold shadow-md transform active:scale-95 transition-all hover:-translate-y-1 ${coin.color} text-slate-900`}
          >
            {coin.label}
          </button>
        ))}
      </div>

      <button onClick={() => setCurrent(0)} className="text-rose-500 font-bold hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors">
        Zurücksetzen
      </button>
    </div>
  );
};

const FingerMultiplicationGame = () => {
  const [selectedNumber, setSelectedNumber] = useState(3);
  const result = selectedNumber * 9;
  const tensDigit = Math.floor(result / 10);
  const onesDigit = result % 10;

  const Finger = ({ number, isBent }: { number: number; isBent: boolean }) => (
    <div className="flex flex-col items-center gap-1">
      <div className={`transition-all duration-300 ${isBent ? 'scale-75 opacity-40' : ''}`}>
        <svg width="30" height="80" viewBox="0 0 30 80" className="drop-shadow-md">
          {/* Finger */}
          <ellipse cx="15" cy="65" rx="8" ry="12" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5"/>
          {/* Fingernail */}
          <ellipse cx="15" cy="60" rx="5" ry="6" fill="#FDE68A" stroke="#92400E" strokeWidth="1"/>
          {/* Finger main body */}
          <rect x="7" y="40" width="16" height="30" rx="8" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5"/>
          {/* Knuckle line */}
          <line x1="7" y1="55" x2="23" y2="55" stroke="#92400E" strokeWidth="1" opacity="0.3"/>
        </svg>
      </div>
      <span className={`text-xs font-bold ${isBent ? 'text-red-600' : 'text-indigo-600'}`}>
        {number}
      </span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">🖐️ Der 9er-Finger-Trick</h3>
        <p className="text-indigo-800 text-lg leading-relaxed">
          Mit deinen 10 Fingern kannst du ganz einfach die 9er-Reihe rechnen!
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border-2 border-indigo-200 shadow-lg">
        <div className="text-center mb-6">
          <p className="text-slate-600 mb-4">Wähle eine Zahl zwischen 1 und 10:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                  selectedNumber === num
                    ? 'bg-indigo-600 text-white shadow-lg scale-110'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100">
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-indigo-900">
              {selectedNumber} × 9 = ?
            </p>
          </div>

          <div className="flex justify-center gap-1 mb-8 bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(num => (
                <Finger key={num} number={num} isBent={num === selectedNumber} />
              ))}
            </div>
            <div className="w-8" />
            <div className="flex gap-1">
              {[6, 7, 8, 9, 10].map(num => (
                <Finger key={num} number={num} isBent={num === selectedNumber} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
              <h4 className="font-bold text-emerald-800 mb-3 text-lg">📝 So funktioniert es:</h4>
              <ol className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-base">
                    Knicke den <strong className="text-indigo-700">{selectedNumber}. Finger</strong> um (der ist jetzt kleiner).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-base">
                    Zähle die Finger <strong className="text-emerald-600">LINKS</strong> vom geknickten Finger: <strong className="text-emerald-700 text-xl">{tensDigit} Finger</strong>
                    <br />
                    <span className="text-sm text-slate-500 ml-2">→ Das sind die Zehner</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span className="text-base">
                    Zähle die Finger <strong className="text-blue-600">RECHTS</strong> vom geknickten Finger: <strong className="text-blue-700 text-xl">{onesDigit} Finger</strong>
                    <br />
                    <span className="text-sm text-slate-500 ml-2">→ Das sind die Einer</span>
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl p-6 text-center shadow-xl">
              <p className="text-sm mb-2 opacity-90">Ergebnis:</p>
              <p className="text-5xl font-bold mb-2">{result}</p>
              <p className="text-lg">
                <span className="bg-white/20 px-3 py-1 rounded-lg">{tensDigit} Zehner</span>
                {' + '}
                <span className="bg-white/20 px-3 py-1 rounded-lg">{onesDigit} Einer</span>
                {' = '}
                <span className="bg-white/30 px-4 py-1 rounded-lg font-bold">{result}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceValueGame = () => {
  const [number, setNumber] = useState<number>(2435);

  const digits = {
    T: Math.floor((number % 10000) / 1000),
    H: Math.floor((number % 1000) / 100),
    Z: Math.floor((number % 100) / 10),
    E: number % 10
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= 9999) {
      setNumber(val);
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-slate-700">
        Jede Ziffer in einer Zahl hat einen bestimmten Wert, je nachdem wo sie steht.
        Gib eine Zahl ein, um zu sehen, wie sie aufgebaut ist.
      </p>
      
      <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-sm overflow-hidden flex flex-col items-center gap-8">
        
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="numberInput" className="text-sm font-bold text-slate-500 uppercase tracking-wider">Deine Zahl</label>
          <input 
            id="numberInput"
            type="number" 
            min="0" 
            max="9999" 
            value={number} 
            onChange={handleInputChange}
            className="text-4xl font-bold text-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4 w-48 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
          />
        </div>

        <div className="flex justify-center items-end gap-4 flex-wrap">
          {/* Tausender */}
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-40 bg-amber-200 border-2 border-amber-400 rounded-xl flex items-center justify-center relative shadow-sm transition-all hover:scale-105">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-5 opacity-20">
                {[...Array(10)].map((_, i) => <div key={i} className="border border-amber-600"></div>)}
              </div>
              <span className="text-4xl font-bold text-amber-800 z-10">{digits.T}</span>
            </div>
            <span className="font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">Tausender</span>
          </div>
          
          {/* Hunderter */}
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="w-20 h-32 bg-amber-100 border-2 border-amber-300 rounded-xl flex items-center justify-center shadow-sm transition-all hover:scale-105">
              <span className="text-4xl font-bold text-amber-800">{digits.H}</span>
            </div>
            <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">Hunderter</span>
          </div>

          {/* Zehner */}
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="w-20 h-24 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-center justify-center shadow-sm transition-all hover:scale-105">
              <span className="text-4xl font-bold text-amber-800">{digits.Z}</span>
            </div>
            <span className="font-bold text-amber-700 bg-white border border-amber-100 px-3 py-1 rounded-lg">Zehner</span>
          </div>

          {/* Einer */}
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="w-20 h-16 bg-white border-2 border-amber-100 rounded-xl flex items-center justify-center shadow-sm transition-all hover:scale-105">
              <span className="text-4xl font-bold text-amber-800">{digits.E}</span>
            </div>
            <span className="font-bold text-amber-700 bg-white border border-amber-50 px-3 py-1 rounded-lg">Einer</span>
          </div>
        </div>
        
        <div className="text-center bg-amber-50/50 p-6 rounded-xl w-full">
          <p className="text-slate-500 mb-2 text-sm uppercase tracking-wide font-bold">So spricht man die Zahl</p>
          <p className="text-xl text-slate-700">
            {digits.T > 0 && <><span className="font-bold text-amber-700">{digits.T}</span> Tausender, </>}
            {digits.H > 0 && <><span className="font-bold text-amber-700">{digits.H}</span> Hunderter, </>}
            {digits.Z > 0 && <><span className="font-bold text-amber-700">{digits.Z}</span> Zehner, </>}
            <span className="font-bold text-amber-700">{digits.E}</span> Einer
          </p>
        </div>
      </div>
    </div>
  );
};

const articles: Article[] = [
  {
    id: 'clock',
    title: 'Die Uhr lesen',
    description: 'Wie spät ist es? Lerne die Uhrzeit auf analogen und digitalen Uhren.',
    icon: '⏰',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    content: <ClockGame />
  },
  {
    id: 'fractions',
    title: 'Brüche schneiden',
    description: 'Teile Pizza und Kuchen in gleich große Stücke.',
    icon: '🍕',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    content: <FractionGame />
  },
  {
    id: 'weights',
    title: 'Gewichte schätzen',
    description: 'Was ist schwerer? Bringe die Waage ins Gleichgewicht.',
    icon: '⚖️',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    content: <WeightGame />
  },
  {
    id: 'symmetry',
    title: 'Symmetrie-Spiegel',
    description: 'Ergänze die Figuren so, dass sie auf beiden Seiten gleich aussehen.',
    icon: '🦋',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    content: <SymmetryGame />
  },
  {
    id: 'money',
    title: 'Geld zählen',
    description: 'Lerne mit Euro und Cent zu bezahlen.',
    icon: '💶',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    content: <MoneyGame />
  },
  {
    id: 'geometry-shapes',
    title: 'Formen-Detektiv',
    description: 'Entdecke geometrische Formen in deinem Alltag.',
    icon: '📐',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    content: <GeometryGame />,
  },
  {
    id: 'multiplication-fingers',
    title: 'Der 9er-Trick mit den Fingern',
    description: 'Lerne, wie du die 9er-Reihe ganz einfach mit deinen Händen rechnen kannst.',
    icon: '🖐️',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    content: <FingerMultiplicationGame />,
  },
  {
    id: 'place-value',
    title: 'Die Stellenwert-Tafel',
    description: 'Verstehe Einer, Zehner, Hunderter und Tausender.',
    icon: '🔢',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    content: <PlaceValueGame />,
  },
];

export default function NewTopicsSection({ onBack }: { onBack: () => void }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-lg">Zurück zur Übersicht</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className={`p-10 ${selectedArticle.color.split(' ')[0]} border-b-4 ${selectedArticle.color.split(' ')[2]}`}>
            <div className="flex items-center gap-5 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                <span className="text-5xl">{selectedArticle.icon}</span>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedArticle.title}</h2>
                <p className="text-lg text-slate-700 font-medium">{selectedArticle.description}</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            {selectedArticle.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 mb-6"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
        <span className="text-lg">Zurück</span>
      </button>

      <div className="bg-gradient-to-br from-blue-500 via-teal-400 to-green-400 rounded-3xl p-8 shadow-lg border-4 border-white mb-8">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
            <span className="text-5xl">🎯</span>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2">Neue Themen entdecken</h2>
            <p className="text-lg text-white/90 font-medium">Tauche ein in spannende mathematische Abenteuer!</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className={`flex flex-col items-start p-6 rounded-3xl border text-left transition-all hover:shadow-md hover:-translate-y-1 ${article.color}`}
          >
            <span className="text-3xl mb-4 block">{article.icon}</span>
            <h3 className="text-lg font-bold mb-2">{article.title}</h3>
            <p className="text-sm opacity-80">{article.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
