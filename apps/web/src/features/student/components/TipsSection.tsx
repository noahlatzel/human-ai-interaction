import { useState } from 'react';

type Tip = {
  id: string;
  title: string;
  icon: string;
  category: string;
  color: string;
  preview: string;
  content: React.ReactNode;
};

export default function TipsSection({ onBack }: { onBack: () => void }) {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  const tips: Tip[] = [
    {
      id: 'learn-better',
      title: 'Wie lerne ich am besten?',
      icon: '🎯',
      category: 'Lernen',
      color: 'from-blue-50 to-cyan-50 border-blue-200',
      preview: 'Finde heraus, wie du am besten Mathe lernen kannst!',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Jeder lernt anders! Hier sind ein paar Tipps, wie du für dich den besten Weg findest:
          </p>
          
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-bold text-lg mb-3 text-blue-900">📚 Kleine Schritte sind besser!</h4>
            <p className="text-slate-700 leading-relaxed">
              Lerne lieber jeden Tag 15 Minuten, als einmal 2 Stunden. Dein Gehirn kann sich dann besser erinnern.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-bold text-lg mb-3 text-green-900">🎨 Benutze verschiedene Farben!</h4>
            <p className="text-slate-700 leading-relaxed">
              Male wichtige Dinge bunt an. Zum Beispiel: Plus-Aufgaben in Grün, Minus-Aufgaben in Rot. So merkst du es dir leichter.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h4 className="font-bold text-lg mb-3 text-purple-900">🗣️ Erkläre es jemandem!</h4>
            <p className="text-slate-700 leading-relaxed">
              Wenn du einer anderen Person (oder deinem Kuscheltier!) etwas erklären kannst, hast du es wirklich verstanden!
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h4 className="font-bold text-lg mb-3 text-amber-900">🎵 Lerne mit Musik!</h4>
            <p className="text-slate-700 leading-relaxed">
              Manche Kinder können sich besser konzentrieren, wenn leise Musik läuft. Probiere es aus!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'stay-focused',
      title: 'Wie bleibe ich konzentriert?',
      icon: '🧠',
      category: 'Konzentration',
      color: 'from-purple-50 to-pink-50 border-purple-200',
      preview: 'Tipps, wie du beim Lernen konzentriert bleibst.',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Manchmal ist es schwer, sich zu konzentrieren. Diese Tricks helfen dir:
          </p>

          <div className="bg-red-50 rounded-xl p-5 border border-red-200">
            <h4 className="font-bold text-lg mb-3 text-red-900">📱 Handy weg!</h4>
            <p className="text-slate-700 leading-relaxed">
              Leg dein Handy in einen anderen Raum. Nachrichten können warten! So bist du viel schneller fertig.
            </p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
            <h4 className="font-bold text-lg mb-3 text-emerald-900">⏰ Mache Pausen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Lerne 20 Minuten, dann mache 5 Minuten Pause. Steh auf, trinke etwas oder mache Hampelmänner!
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-bold text-lg mb-3 text-blue-900">🪑 Finde einen guten Platz!</h4>
            <p className="text-slate-700 leading-relaxed">
              Such dir einen ruhigen Ort zum Lernen. Am Schreibtisch ist besser als auf dem Sofa. Dein Rücken freut sich auch!
            </p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <h4 className="font-bold text-lg mb-3 text-yellow-900">💡 Genug Licht!</h4>
            <p className="text-slate-700 leading-relaxed">
              Achte darauf, dass es hell genug ist. Deine Augen werden nicht so schnell müde.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'remember-tricks',
      title: 'Wie merke ich mir Dinge besser?',
      icon: '🎪',
      category: 'Gedächtnis',
      color: 'from-green-50 to-emerald-50 border-green-200',
      preview: 'Coole Tricks, um dir Mathe-Sachen besser zu merken.',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Mit diesen Tricks kannst du dir Mathe-Sachen viel besser merken:
          </p>

          <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
            <h4 className="font-bold text-lg mb-3 text-pink-900">🎭 Erfinde Geschichten!</h4>
            <p className="text-slate-700 leading-relaxed mb-3">
              Wenn du dir das Einmaleins merken willst, denk dir lustige Geschichten aus.
            </p>
            <p className="text-slate-700 leading-relaxed italic">
              Beispiel: 7 × 8 = 56 → "Sieben Zwerge gehen zum Achter-Looping und haben 56 Bonbons dabei!"
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
            <h4 className="font-bold text-lg mb-3 text-orange-900">🖐️ Benutze deine Finger!</h4>
            <p className="text-slate-700 leading-relaxed">
              Beim Rechnen darfst du deine Finger benutzen! Das ist nicht "babyish", sondern schlau. Viele Erwachsene machen das auch noch.
            </p>
          </div>

          <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-200">
            <h4 className="font-bold text-lg mb-3 text-cyan-900">🎤 Singe es!</h4>
            <p className="text-slate-700 leading-relaxed">
              Manche Dinge kann man sich als Lied besser merken. Erfinde ein Lied für das Einmaleins oder andere Regeln!
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
            <h4 className="font-bold text-lg mb-3 text-indigo-900">🔄 Wiederhole es!</h4>
            <p className="text-slate-700 leading-relaxed">
              Schaue dir Sachen, die du gelernt hast, nach einem Tag, nach einer Woche und nach einem Monat noch einmal an. Dann bleiben sie für immer im Kopf!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'mistakes-ok',
      title: 'Fehler machen ist okay!',
      icon: '💪',
      category: 'Motivation',
      color: 'from-amber-50 to-orange-50 border-amber-200',
      preview: 'Warum Fehler wichtig für das Lernen sind.',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Hast du manchmal Angst, Fehler zu machen? Das musst du nicht! Hier erfährst du warum:
          </p>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-bold text-lg mb-3 text-green-900">🌱 Fehler helfen beim Lernen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Wenn du einen Fehler machst, lernt dein Gehirn besonders gut. Es merkt sich dann, wie es richtig geht. Fehler sind wie ein Training für dein Gehirn!
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-bold text-lg mb-3 text-blue-900">🎮 Wie beim Videospielen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Bei einem Videospiel verlierst du auch manchmal. Dann versuchst du es nochmal und wirst besser. Beim Lernen ist es genauso!
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h4 className="font-bold text-lg mb-3 text-purple-900">👨‍🔬 Sogar Erwachsene machen Fehler!</h4>
            <p className="text-slate-700 leading-relaxed">
              Weißt du was? Albert Einstein, einer der schlauesten Menschen der Welt, hat gesagt: "Wer noch nie einen Fehler gemacht hat, hat noch nie etwas Neues probiert."
            </p>
          </div>

          <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
            <h4 className="font-bold text-lg mb-3 text-rose-900">💖 Sei nett zu dir selbst!</h4>
            <p className="text-slate-700 leading-relaxed">
              Wenn du einen Fehler machst, sage nicht "Ich bin dumm!". Sage lieber: "Ich lerne noch!" oder "Beim nächsten Mal schaffe ich es!"
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'practice-fun',
      title: 'Wie macht Üben Spaß?',
      icon: '🎉',
      category: 'Motivation',
      color: 'from-pink-50 to-rose-50 border-pink-200',
      preview: 'Mache aus dem Üben ein spannendes Spiel!',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Üben muss nicht langweilig sein! Hier sind Ideen, wie du es spannend machen kannst:
          </p>

          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <h4 className="font-bold text-lg mb-3 text-yellow-900">🎯 Setze dir Ziele!</h4>
            <p className="text-slate-700 leading-relaxed">
              Zum Beispiel: "Heute schaffe ich 10 Aufgaben!" Wenn du dein Ziel erreicht hast, darfst du stolz auf dich sein!
            </p>
          </div>

          <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-200">
            <h4 className="font-bold text-lg mb-3 text-cyan-900">🏆 Sammle Punkte!</h4>
            <p className="text-slate-700 leading-relaxed">
              Male dir eine Belohnungsliste. Für jede Aufgabe gibt es einen Punkt. Bei 50 Punkten gibt es eine Belohnung (z.B. dein Lieblingsessen)!
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-bold text-lg mb-3 text-green-900">⏱️ Mache ein Rennen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Stelle einen Timer auf 5 Minuten. Wie viele Aufgaben schaffst du? Morgen versuchst du, deinen eigenen Rekord zu brechen!
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h4 className="font-bold text-lg mb-3 text-purple-900">👨‍👩‍👧 Übe mit anderen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Mit Freunden oder Familie macht Üben mehr Spaß! Ihr könnt euch gegenseitig Aufgaben stellen oder zusammen rätseln.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'homework-strategy',
      title: 'Hausaufgaben clever machen',
      icon: '📝',
      category: 'Organisation',
      color: 'from-indigo-50 to-blue-50 border-indigo-200',
      preview: 'So werden Hausaufgaben schneller fertig!',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Mit diesen Tricks sind deine Hausaufgaben schneller erledigt:
          </p>

          <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
            <h4 className="font-bold text-lg mb-3 text-orange-900">✅ Fange mit dem Leichten an!</h4>
            <p className="text-slate-700 leading-relaxed">
              Starte mit Aufgaben, die du gut kannst. Das gibt dir ein gutes Gefühl und Schwung für die schwierigeren Aufgaben!
            </p>
          </div>

          <div className="bg-teal-50 rounded-xl p-5 border border-teal-200">
            <h4 className="font-bold text-lg mb-3 text-teal-900">📋 Mache eine Liste!</h4>
            <p className="text-slate-700 leading-relaxed">
              Schreibe auf, was du alles machen musst. Streiche durch, was fertig ist. Das fühlt sich super an!
            </p>
          </div>

          <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
            <h4 className="font-bold text-lg mb-3 text-pink-900">🍎 Mache Snack-Pausen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Nach jeder fertigen Aufgabe darfst du einen Bissen von deinem Lieblingssnack nehmen. So macht es gleich mehr Spaß!
            </p>
          </div>

          <div className="bg-violet-50 rounded-xl p-5 border border-violet-200">
            <h4 className="font-bold text-lg mb-3 text-violet-900">🙋 Frage, wenn du nicht weiterkommst!</h4>
            <p className="text-slate-700 leading-relaxed">
              Sitze nicht ewig an einer Aufgabe fest. Frage deine Eltern, Geschwister oder schreibe es in die Community. Zusammen findet ihr eine Lösung!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'before-test',
      title: 'Vor der Arbeit: Keine Panik!',
      icon: '🎒',
      category: 'Prüfungen',
      color: 'from-red-50 to-orange-50 border-red-200',
      preview: 'So bereitest du dich gut auf Tests vor.',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Eine Mathe-Arbeit steht an? Mit diesen Tipps bist du bestens vorbereitet:
          </p>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-bold text-lg mb-3 text-blue-900">📅 Plane voraus!</h4>
            <p className="text-slate-700 leading-relaxed">
              Fange 5 Tage vorher an zu üben, nicht erst am Abend davor. Jeden Tag ein bisschen ist besser als alles auf einmal!
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-bold text-lg mb-3 text-green-900">😴 Schlafe gut!</h4>
            <p className="text-slate-700 leading-relaxed">
              In der Nacht vor der Arbeit brauchst du 9-10 Stunden Schlaf. Dein Gehirn sortiert dann alles, was du gelernt hast!
            </p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <h4 className="font-bold text-lg mb-3 text-yellow-900">🍌 Iss ein gutes Frühstück!</h4>
            <p className="text-slate-700 leading-relaxed">
              Am Tag der Arbeit: Iss etwas Gesundes. Eine Banane gibt dir Energie für dein Gehirn!
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h4 className="font-bold text-lg mb-3 text-purple-900">🌬️ Tief durchatmen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Wenn du nervös bist: Atme tief durch die Nase ein (1-2-3-4) und durch den Mund aus (1-2-3-4). Das beruhigt!
            </p>
          </div>

          <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
            <h4 className="font-bold text-lg mb-3 text-rose-900">✨ Du schaffst das!</h4>
            <p className="text-slate-700 leading-relaxed">
              Sage dir selbst: "Ich habe geübt. Ich bin vorbereitet. Ich kann das!" Positive Gedanken helfen wirklich!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'parents-help',
      title: 'Wie können Eltern helfen?',
      icon: '👨‍👩‍👧',
      category: 'Familie',
      color: 'from-teal-50 to-cyan-50 border-teal-200',
      preview: 'Tipps für Eltern, die beim Lernen unterstützen möchten.',
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Manchmal ist es gut, wenn Mama oder Papa beim Lernen helfen. So geht es am besten:
          </p>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h4 className="font-bold text-lg mb-3 text-amber-900">🎯 Nicht zu viel helfen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Eltern sollen nicht die ganze Aufgabe lösen. Besser ist es, kleine Tipps zu geben, damit du selbst auf die Lösung kommst!
            </p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
            <h4 className="font-bold text-lg mb-3 text-emerald-900">💬 Redet zusammen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Sage deinen Eltern, wie sie dir helfen können. Zum Beispiel: "Kannst du mir Aufgaben stellen?" oder "Hör mir zu, wie ich es erkläre!"
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-bold text-lg mb-3 text-blue-900">🎉 Feiern ist wichtig!</h4>
            <p className="text-slate-700 leading-relaxed">
              Wenn du etwas Schwieriges geschafft hast, sollten deine Eltern dich loben! Das motiviert dich für die nächsten Aufgaben.
            </p>
          </div>

          <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
            <h4 className="font-bold text-lg mb-3 text-pink-900">⏰ Feste Zeiten helfen!</h4>
            <p className="text-slate-700 leading-relaxed">
              Sprecht ab, wann jeden Tag Lernzeit ist. Zum Beispiel: Nach dem Mittagessen 30 Minuten Mathe. Dann weiß jeder Bescheid!
            </p>
          </div>
        </div>
      )
    }
  ];

  const categories = ['Alle', 'Lernen', 'Konzentration', 'Gedächtnis', 'Motivation', 'Organisation', 'Prüfungen', 'Familie'];
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const filteredTips = selectedCategory === 'Alle' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  if (selectedTip) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setSelectedTip(null)}
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
          <span className="text-lg">Zurück zur Übersicht</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className={`p-10 bg-gradient-to-br ${selectedTip.color} border-b-4`}>
            <div className="flex items-center gap-5 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                <span className="text-5xl">{selectedTip.icon}</span>
              </div>
              <div>
                <div className="px-3 py-1 bg-white/80 rounded-full text-sm font-bold text-slate-700 inline-block mb-2">
                  {selectedTip.category}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">{selectedTip.title}</h2>
              </div>
            </div>
          </div>
          <div className="p-8">
            {selectedTip.content}
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
        <span className="text-lg">Zurück zur Übersicht</span>
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 rounded-3xl p-8 shadow-lg border-4 border-white">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
            <span className="text-5xl">💡</span>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2">Tipps & Tricks</h2>
            <p className="text-lg text-white/90 font-medium">Lerne, wie du noch besser lernen kannst!</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTips.map((tip) => (
          <button
            key={tip.id}
            onClick={() => setSelectedTip(tip)}
            className={`p-6 rounded-3xl border bg-gradient-to-br ${tip.color} text-left transition-all hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
                {tip.icon}
              </div>
              <span className="px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-slate-700">
                {tip.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{tip.title}</h3>
            <p className="text-sm text-slate-600">{tip.preview}</p>
          </button>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-slate-600 font-medium">Keine Tipps in dieser Kategorie</p>
        </div>
      )}
    </div>
  );
}
