import { useState, useEffect } from 'react';

type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  component: React.ReactNode;
};

const SpeedMathChallenge = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const generateProblem = () => {
    let num1, num2;
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 10;
        num2 = Math.floor(Math.random() * 100) + 10;
        break;
    }
    setCurrentProblem({ num1, num2, answer: num1 + num2 });
  };

  const startChallenge = () => {
    setIsActive(true);
    setIsFinished(false);
    setScore(0);
    setTimeLeft(60);
    setUserAnswer('');
    generateProblem();
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === currentProblem.answer) {
      setScore(score + 1);
      setUserAnswer('');
      generateProblem();
    } else {
      setUserAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer) {
      checkAnswer();
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
    }
  }, [timeLeft, isActive]);

  const getBadge = () => {
    if (score >= 30) return { emoji: '🥇', text: 'Gold', color: 'text-amber-600' };
    if (score >= 20) return { emoji: '🥈', text: 'Silber', color: 'text-slate-400' };
    if (score >= 10) return { emoji: '🥉', text: 'Bronze', color: 'text-amber-700' };
    return { emoji: '👍', text: 'Gut gemacht', color: 'text-blue-600' };
  };

  if (isFinished) {
    const badge = getBadge();
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <span className="text-8xl animate-bounce">{badge.emoji}</span>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{badge.text}!</h3>
          <p className="text-6xl font-bold text-emerald-600 mb-2">{score}</p>
          <p className="text-slate-600">richtige Antworten</p>
        </div>
        <button
          onClick={startChallenge}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
        >
          Nochmal spielen
        </button>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center">
          <p className="text-slate-600 mb-6">
            Löse so viele Aufgaben wie möglich in 60 Sekunden!
          </p>
          <div className="flex gap-4 justify-center mb-8">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  difficulty === level
                    ? 'bg-emerald-600 text-white shadow-lg scale-110'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {level === 'easy' && '😊 Leicht (1-10)'}
                {level === 'medium' && '🤔 Mittel (1-50)'}
                {level === 'hard' && '🔥 Schwer (10-100)'}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={startChallenge}
          className="px-12 py-6 bg-emerald-600 text-white rounded-2xl font-bold text-2xl hover:bg-emerald-700 transition-all shadow-lg hover:scale-105"
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-2xl">
        <div className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-xl">
          ⏱️ {timeLeft}s
        </div>
        <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-xl">
          ✓ {score}
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-12 rounded-3xl shadow-xl border-4 border-emerald-200 w-full max-w-2xl">
        <div className="text-center space-y-8">
          <div className="text-6xl font-bold text-slate-900">
            {currentProblem.num1} + {currentProblem.num2} = ?
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="w-full text-4xl font-bold text-center p-6 rounded-2xl border-4 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-none"
            placeholder="?"
          />
          <button
            onClick={checkAnswer}
            disabled={!userAnswer}
            className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-bold text-2xl hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Überprüfen
          </button>
        </div>
      </div>
    </div>
  );
};

const NumberPuzzleChallenge = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [score, setScore] = useState(0);

  const puzzles = [
    { question: '__ + 7 = 15', answer: 8, hint: 'Was plus 7 ist 15?' },
    { question: '12 - __ = 5', answer: 7, hint: '12 minus was ist 5?' },
    { question: '3 × __ = 21', answer: 7, hint: '3 mal was ist 21?' },
    { question: '__ + 8 = 20', answer: 12, hint: 'Was plus 8 ist 20?' },
    { question: '25 - __ = 10', answer: 15, hint: '25 minus was ist 10?' },
    { question: '4 × __ = 28', answer: 7, hint: '4 mal was ist 28?' },
    { question: '__ + 15 = 33', answer: 18, hint: 'Was plus 15 ist 33?' },
    { question: '50 - __ = 22', answer: 28, hint: '50 minus was ist 22?' },
    { question: '6 × __ = 48', answer: 8, hint: '6 mal was ist 48?' },
    { question: '__ + 27 = 65', answer: 38, hint: 'Was plus 27 ist 65?' },
  ];

  const currentPuzzle = puzzles[currentLevel - 1];

  const checkAnswer = () => {
    if (parseInt(userAnswer) === currentPuzzle.answer) {
      setFeedback({ msg: '🎉 Richtig!', type: 'success' });
      setScore(score + 1);
      setTimeout(() => {
        if (currentLevel < puzzles.length) {
          setCurrentLevel(currentLevel + 1);
          setUserAnswer('');
          setFeedback(null);
        }
      }, 1500);
    } else {
      setFeedback({ msg: '❌ Versuch es nochmal!', type: 'error' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer) {
      checkAnswer();
    }
  };

  if (currentLevel > puzzles.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <span className="text-8xl">🏆</span>
        <h3 className="text-3xl font-bold text-slate-900">Alle Rätsel gelöst!</h3>
        <p className="text-2xl text-purple-600 font-bold">{score} / {puzzles.length} richtig</p>
        <button
          onClick={() => {
            setCurrentLevel(1);
            setScore(0);
            setUserAnswer('');
            setFeedback(null);
          }}
          className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-colors"
        >
          Nochmal spielen
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4 items-center">
        <div className="bg-purple-100 text-purple-800 px-6 py-2 rounded-xl font-bold">
          Rätsel {currentLevel} / {puzzles.length}
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-6 py-2 rounded-xl font-bold">
          ✓ {score} richtig
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-12 rounded-3xl shadow-xl border-4 border-purple-200 w-full max-w-2xl">
        <div className="text-center space-y-6">
          <p className="text-sm text-purple-600 font-semibold">Finde die fehlende Zahl</p>
          <div className="text-5xl font-bold text-slate-900 mb-4">
            {currentPuzzle.question}
          </div>
          <p className="text-slate-600 italic text-sm">{currentPuzzle.hint}</p>
          
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="w-full text-3xl font-bold text-center p-4 rounded-xl border-4 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none"
            placeholder="?"
          />

          {feedback && (
            <div
              className={`p-4 rounded-xl font-bold text-lg animate-in fade-in slide-in-from-top-2 ${
                feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {feedback.msg}
            </div>
          )}

          <button
            onClick={checkAnswer}
            disabled={!userAnswer}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-xl hover:bg-purple-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Überprüfen
          </button>
        </div>
      </div>
    </div>
  );
};

const WordProblemChallenge = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);

  const problems = [
    { text: 'Anna hat 5 Äpfel. Sie kauft 3 weitere. Wie viele Äpfel hat sie jetzt?', answer: 8, emoji: '🍎' },
    { text: 'Max hat 12 Euro. Er kauft ein Buch für 7 Euro. Wie viel Geld hat er noch?', answer: 5, emoji: '💶' },
    { text: 'In einer Klasse sind 8 Jungen und 9 Mädchen. Wie viele Kinder sind es insgesamt?', answer: 17, emoji: '👧👦' },
    { text: 'Lisa hat 20 Bonbons und isst 4. Wie viele Bonbons hat sie noch?', answer: 16, emoji: '🍬' },
    { text: 'Ein Regal hat 3 Fächer. In jedem Fach sind 6 Bücher. Wie viele Bücher sind es?', answer: 18, emoji: '📚' },
    { text: 'Tom sammelt Steine. Er hat 15 Steine und findet 8 weitere. Wie viele hat er jetzt?', answer: 23, emoji: '🪨' },
    { text: 'Sarah hat 24 Stifte und verschenkt 9. Wie viele Stifte hat sie noch?', answer: 15, emoji: '✏️' },
    { text: 'In einem Park sind 30 Bäume. 12 davon sind Eichen. Wie viele sind keine Eichen?', answer: 18, emoji: '🌳' },
  ];

  const currentProblem = problems[currentLevel];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
  }, [timeLeft, isActive]);

  const startChallenge = () => {
    setIsActive(true);
    setCurrentLevel(0);
    setScore(0);
    setTimeLeft(90);
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === currentProblem.answer) {
      setFeedback({ msg: '🎉 Super!', type: 'success' });
      setScore(score + 1);
      setTimeout(() => {
        if (currentLevel < problems.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setUserAnswer('');
          setFeedback(null);
        } else {
          setIsActive(false);
        }
      }, 1500);
    } else {
      setFeedback({ msg: '❌ Nicht ganz. Versuch es nochmal!', type: 'error' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer) {
      checkAnswer();
    }
  };

  if (!isActive && score > 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <span className="text-8xl">🏆</span>
        <h3 className="text-3xl font-bold text-slate-900">Challenge beendet!</h3>
        <p className="text-2xl text-blue-600 font-bold">{score} / {problems.length} richtig gelöst</p>
        <button
          onClick={startChallenge}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors"
        >
          Nochmal spielen
        </button>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center">
          <p className="text-slate-600 mb-6">
            Löse so viele Textaufgaben wie möglich in 90 Sekunden!
          </p>
        </div>
        <button
          onClick={startChallenge}
          className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-bold text-2xl hover:bg-blue-700 transition-all shadow-lg hover:scale-105"
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-2xl">
        <div className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-xl">
          ⏱️ {timeLeft}s
        </div>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-xl">
          {currentLevel + 1} / {problems.length}
        </div>
        <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-xl">
          ✓ {score}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl shadow-xl border-4 border-blue-200 w-full max-w-2xl">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">{currentProblem.emoji}</div>
          <p className="text-xl text-slate-800 leading-relaxed">
            {currentProblem.text}
          </p>
          
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="w-full text-3xl font-bold text-center p-4 rounded-xl border-4 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none"
            placeholder="?"
          />

          {feedback && (
            <div
              className={`p-4 rounded-xl font-bold text-lg animate-in fade-in slide-in-from-top-2 ${
                feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {feedback.msg}
            </div>
          )}

          <button
            onClick={checkAnswer}
            disabled={!userAnswer}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-xl hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Überprüfen
          </button>
        </div>
      </div>
    </div>
  );
};

const challenges: Challenge[] = [
  {
    id: 'speed-math',
    title: 'Blitz-Rechnen',
    description: 'Löse so viele Aufgaben wie möglich in 60 Sekunden!',
    icon: '⚡',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    component: <SpeedMathChallenge />
  },
  {
    id: 'number-puzzle',
    title: 'Zahlen-Rätsel',
    description: 'Finde die fehlenden Zahlen in den Aufgaben.',
    icon: '🧩',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    component: <NumberPuzzleChallenge />
  },
  {
    id: 'word-problems',
    title: 'Textaufgaben-Sprint',
    description: 'Beantworte Textaufgaben gegen die Zeit!',
    icon: '📝',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    component: <WordProblemChallenge />
  },
];

export default function ChallengesSection({ onBack }: { onBack: () => void }) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  if (selectedChallenge) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setSelectedChallenge(null)}
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
          <div className={`p-10 ${selectedChallenge.color.split(' ')[0]} border-b-4 ${selectedChallenge.color.split(' ')[2]}`}>
            <div className="flex items-center gap-5 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                <span className="text-5xl">{selectedChallenge.icon}</span>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedChallenge.title}</h2>
                <p className="text-lg text-slate-700 font-medium">{selectedChallenge.description}</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            {selectedChallenge.component}
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

      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-3xl p-8 shadow-lg border-4 border-white mb-8">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
            <span className="text-5xl">🏆</span>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2">Herausforderungen</h2>
            <p className="text-lg text-white/90 font-medium">Stelle dich spannenden Aufgaben und zeige, was du kannst!</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className={`flex flex-col items-start p-6 rounded-3xl border text-left transition-all hover:shadow-md hover:-translate-y-1 ${challenge.color}`}
          >
            <span className="text-3xl mb-4 block">{challenge.icon}</span>
            <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
            <p className="text-sm opacity-80">{challenge.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
