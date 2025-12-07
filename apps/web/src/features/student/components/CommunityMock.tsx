import { useState } from 'react';
import communityIcon from '../../../assets/Community_Icon.png';

export default function CommunityMock() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);

  const discussions = [
    {
      id: 'general-textaufgaben',
      user: 'Anna M.',
      avatar: '👧',
      topic: 'Wie löse ich Textaufgaben schneller?',
      replies: 12,
      time: 'vor 2 Stunden',
      category: 'Tipps',
    },
    {
      id: 'general-lerngruppe',
      user: 'Max K.',
      avatar: '👦',
      topic: 'Wer möchte zusammen für die Mathe-Arbeit lernen?',
      replies: 8,
      time: 'vor 5 Stunden',
      category: 'Lerngruppe',
    },
    {
      id: 'general-challenge',
      user: 'Lisa S.',
      avatar: '👧',
      topic: 'Ich habe die Challenge geschafft! 🎉',
      replies: 15,
      time: 'gestern',
      category: 'Erfolge',
    },
    {
      id: 'general-division',
      user: 'Tom H.',
      avatar: '👦',
      topic: 'Hilfe bei Division mit Rest gesucht',
      replies: 6,
      time: 'vor 1 Tag',
      category: 'Fragen',
    },
  ];

  const generalDiscussionThread = {
    id: 'general-textaufgaben',
    topic: 'Wie löse ich Textaufgaben schneller?',
    user: 'Anna M.',
    avatar: '👧',
    time: 'vor 2 Stunden',
    category: 'Tipps',
    content: 'Hallo! Ich brauche oft sehr lange für Textaufgaben. Ich verstehe die Aufgabe, aber dann weiß ich nicht genau, was ich rechnen soll. Habt ihr Tipps, wie man Textaufgaben schneller lösen kann? 📖',
    replies: [
      {
        user: 'Felix P.',
        avatar: '👦',
        time: 'vor 1 Stunde 45 Min',
        content: 'Hi Anna! Ich unterstreiche immer die wichtigen Zahlen und Wörter in der Aufgabe. Das hilft mir, nicht durcheinander zu kommen! 🖍️'
      },
      {
        user: 'Sarah W.',
        avatar: '👧',
        time: 'vor 1 Stunde 30 Min',
        content: 'Guter Tipp Felix! Ich male mir manchmal auch ein kleines Bild zur Aufgabe. Bei "Max hat 5 Äpfel und bekommt 3 dazu" male ich 5 Kreise und dann noch 3 dazu. So sehe ich sofort, dass ich plus rechnen muss!'
      },
      {
        user: 'David K.',
        avatar: '👦',
        time: 'vor 1 Stunde 15 Min',
        content: 'Meine Lehrerin hat uns gezeigt, dass man nach Signalwörtern suchen soll:\n- "dazu", "mehr", "insgesamt" = Plus ➕\n- "weg", "weniger", "übrig" = Minus ➖\n- "mal", "jeder bekommt" = Mal ✖️\n- "verteilt", "aufgeteilt" = Geteilt ➗'
      },
      {
        user: 'Mia S.',
        avatar: '👧',
        time: 'vor 1 Stunde',
        content: 'Super Liste David! Ich schreibe die Aufgabe auch immer in meinen eigenen Worten auf. Zum Beispiel: "Emma hat 8 Bonbons und gibt 3 ab" → Emma: 8, gibt ab: -3, wie viele bleiben? Das hilft mir sehr!'
      },
      {
        user: 'Jonas R.',
        avatar: '👦',
        time: 'vor 50 Minuten',
        content: 'Ich habe eine Checkliste:\n1. Aufgabe zweimal lesen 📖\n2. Wichtige Zahlen markieren 🔢\n3. Was wird gefragt? ❓\n4. Rechenzeichen überlegen ➕➖✖️➗\n5. Rechnung aufschreiben und lösen ✏️'
      },
      {
        user: 'Luna H.',
        avatar: '👧',
        time: 'vor 40 Minuten',
        content: 'Toll Jonas! Bei schwierigen Aufgaben stelle ich mir die Situation auch im Kopf wie einen kleinen Film vor. Wenn Lisa 12 Sticker hat und 7 verschenkt, sehe ich das Stickerheft vor mir. Das macht es einfacher!'
      },
      {
        user: 'Ben M.',
        avatar: '👦',
        time: 'vor 30 Minuten',
        content: 'Mein Trick: Ich überlege mir immer: "Wird es am Ende mehr oder weniger?" Bei "mehr" ist es meistens Plus oder Mal, bei "weniger" Minus oder Geteilt. Das ist nicht immer so, aber oft!'
      },
      {
        user: 'Emily F.',
        avatar: '👧',
        time: 'vor 20 Minuten',
        content: 'Wenn ich ganz unsicher bin, rechne ich auch erstmal mit kleineren Zahlen. Statt "47 Kinder fahren mit 8 Bussen" rechne ich erst "8 Kinder mit 2 Bussen". Dann weiß ich, welche Rechenart richtig ist!'
      },
      {
        user: 'Paul L.',
        avatar: '👦',
        time: 'vor 15 Minuten',
        content: 'Nach dem Rechnen kontrolliere ich immer: Passt das Ergebnis zur Frage? Wenn die Aufgabe fragt "Wie viele Äpfel bleiben übrig?" und ich habe 100 raus, kann das nicht stimmen, wenn es am Anfang nur 10 waren! 🍎'
      },
      {
        user: 'Sophia T.',
        avatar: '👧',
        time: 'vor 10 Minuten',
        content: 'Super Hinweis Paul! Und nicht vergessen: Die Einheit (Stück, cm, Euro) und einen Antwortsatz schreiben! "Es bleiben 7 Äpfel übrig." Dann gibt es auch keine Punktabzüge! ✅'
      },
      {
        user: 'Anna M.',
        avatar: '👧',
        time: 'vor 5 Minuten',
        content: 'Wow, vielen Dank für all die tollen Tipps! 🤩 Die Checkliste von Jonas und die Signalwörter von David werde ich auf jeden Fall ausprobieren. Und das mit den kleineren Zahlen von Emily ist auch super! Ich fühle mich jetzt viel sicherer! 💪'
      },
      {
        user: 'Lehrer Schmidt',
        avatar: '👨‍🏫',
        time: 'vor 2 Minuten',
        content: 'Toll, wie ihr euch hier gegenseitig helft! 👏 Alle Strategien sind super. Denkt daran: Übung macht den Meister. Je mehr Textaufgaben ihr löst, desto schneller werdet ihr! Viel Erfolg! 📚'
      }
    ]
  };

  const discussionThread = {
    id: 'addition-zahlen-100',
    topic: 'Zahlen bis 100 addieren',
    user: 'Julia K.',
    avatar: '👧',
    time: 'vor 1 Stunde',
    content: 'Hallo zusammen! Ich habe manchmal Probleme beim Addieren von größeren Zahlen wie 47 + 38. Habt ihr Tipps, wie ich das schneller rechnen kann? 🤔',
    replies: [
      {
        user: 'Max T.',
        avatar: '👦',
        time: 'vor 50 Minuten',
        content: 'Hi Julia! Ich mache das immer so: Erst die Zehner zusammen (40 + 30 = 70) und dann die Einer (7 + 8 = 15). Am Ende addiere ich beides: 70 + 15 = 85! 😊'
      },
      {
        user: 'Sophie L.',
        avatar: '👧',
        time: 'vor 45 Minuten',
        content: 'Gute Idee Max! Ich runde manchmal auch auf. Bei 47 + 38 denke ich: 47 + 40 = 87, dann ziehe ich die 2 ab: 87 - 2 = 85. So kann man leichter im Kopf rechnen!'
      },
      {
        user: 'Leon W.',
        avatar: '👦',
        time: 'vor 30 Minuten',
        content: 'Cool, Sophie! Meine Lehrerin hat uns gezeigt, dass man auch zur nächsten 10 gehen kann. Bei 47 + 38: Erst 47 + 3 = 50, dann noch die restlichen 35 dazu: 50 + 35 = 85! 🎯'
      },
      {
        user: 'Emma K.',
        avatar: '👧',
        time: 'vor 25 Minuten',
        content: 'Ich stelle mir das oft bildlich vor. 47 sind 4 Zehnerstangen und 7 Einer. 38 sind 3 Zehnerstangen und 8 Einer. Zusammen sind das 7 Zehnerstangen (70) plus 15 Einer = 85! 📊'
      },
      {
        user: 'Tim R.',
        avatar: '👦',
        time: 'vor 15 Minuten',
        content: 'Ich finde die Stellenwerttafel auch super hilfreich! Dann sieht man genau, welche Zahlen zusammengehören. Z E\n4 7\n+ 3 8\n= 8 5'
      },
      {
        user: 'Julia K.',
        avatar: '👧',
        time: 'vor 10 Minuten',
        content: 'Wow, danke euch allen! 🙏 Besonders die Methode von Sophie mit dem Aufrunden finde ich super. Ich werde alle Methoden mal ausprobieren und schauen, welche mir am besten gefällt!'
      },
      {
        user: 'Noah B.',
        avatar: '👦',
        time: 'vor 5 Minuten',
        content: 'Viel Erfolg Julia! Bei mir hat es geholfen, jeden Tag ein paar Aufgaben zu üben. Nach einer Woche ging es schon viel leichter! 💪'
      },
      {
        user: 'Lena M.',
        avatar: '👧',
        time: 'vor 2 Minuten',
        content: 'Genau! Und wenn du unsicher bist, kannst du auch immer mit Material arbeiten - Plättchen, Stäbchen oder sogar Gummibärchen zum Zählen! 🍬'
      }
    ]
  };

  const mathAreas = [
    {
      id: 'addition',
      title: 'Addition',
      icon: '➕',
      color: 'from-green-50 to-emerald-50 border-green-200',
      discussions: [
        { id: 'addition-zahlen-100', topic: 'Zahlen bis 100 addieren', user: 'Julia K.', replies: 8, time: 'vor 1 Stunde' },
        { id: 'addition-kopfrechnen', topic: 'Kopfrechnen-Tricks für Addition', user: 'Leon M.', replies: 15, time: 'vor 3 Stunden' },
        { id: 'addition-stellenweise', topic: 'Stellenweise Addition verstehen', user: 'Marie P.', replies: 6, time: 'gestern' },
        { id: 'addition-uebertrag', topic: 'Übertrag bei Addition - wann?', user: 'Tim S.', replies: 12, time: 'vor 2 Tagen' },
      ]
    },
    {
      id: 'subtraction',
      title: 'Subtraktion',
      icon: '➖',
      color: 'from-blue-50 to-cyan-50 border-blue-200',
      discussions: [
        { id: 'sub-entbuendeln', topic: 'Entbündeln beim Subtrahieren', user: 'Emma L.', replies: 10, time: 'vor 2 Stunden' },
        { id: 'sub-zehnerueber', topic: 'Minus-Aufgaben mit Zehnerübergang', user: 'Noah B.', replies: 7, time: 'vor 4 Stunden' },
        { id: 'sub-ergaenzen', topic: 'Ergänzen statt Abziehen?', user: 'Lena W.', replies: 9, time: 'gestern' },
        { id: 'sub-hundert', topic: 'Rechnen über die Hundert', user: 'Felix H.', replies: 5, time: 'vor 2 Tagen' },
      ]
    },
    {
      id: 'multiplication',
      title: 'Multiplikation',
      icon: '✖️',
      color: 'from-purple-50 to-pink-50 border-purple-200',
      discussions: [
        { id: 'mult-tricks', topic: 'Einmaleins-Tricks und Eselsbrücken', user: 'Sophie T.', replies: 20, time: 'vor 30 Min' },
        { id: 'mult-7er', topic: '7er-Reihe ist so schwer!', user: 'Paul R.', replies: 14, time: 'vor 2 Stunden' },
        { id: 'mult-zehner', topic: 'Multiplizieren mit Zehnerzahlen', user: 'Anna F.', replies: 8, time: 'vor 5 Stunden' },
        { id: 'mult-tausch', topic: 'Tauschaufgaben nutzen', user: 'Max D.', replies: 11, time: 'gestern' },
      ]
    },
    {
      id: 'division',
      title: 'Division',
      icon: '➗',
      color: 'from-orange-50 to-amber-50 border-orange-200',
      discussions: [
        { id: 'div-rest', topic: 'Division mit Rest verstehen', user: 'Lisa N.', replies: 13, time: 'vor 1 Stunde' },
        { id: 'div-schnell', topic: 'Geteilt-Aufgaben schneller lösen', user: 'Tom J.', replies: 9, time: 'vor 3 Stunden' },
        { id: 'div-verteilen', topic: 'Verteilen vs. Aufteilen', user: 'Mia K.', replies: 7, time: 'vor 6 Stunden' },
        { id: 'div-zehner', topic: 'Division durch Zehnerzahlen', user: 'Ben W.', replies: 10, time: 'gestern' },
      ]
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 shadow-lg border-4 border-white">
        <div className="flex items-center justify-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md p-3">
            <img src={communityIcon} alt="Community" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2">Community</h2>
            <p className="text-lg text-white/90 font-medium">Tausche dich mit anderen Schülern aus!</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-black text-emerald-600">248</div>
          <div className="text-sm text-slate-600 font-medium">Aktive Schüler</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-black text-blue-600">42</div>
          <div className="text-sm text-slate-600 font-medium">Diskussionen</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-black text-purple-600">156</div>
          <div className="text-sm text-slate-600 font-medium">Hilfeantworten</div>
        </div>
      </div>

      {/* Math Areas Discussions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📚</span>
          <h3 className="text-xl font-bold text-slate-900">Diskussionen nach Themenbereich</h3>
        </div>
        
        {selectedDiscussion === 'addition-zahlen-100' || selectedDiscussion === 'general-textaufgaben' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedDiscussion(null)}
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
              <span className="text-lg">Zurück zur Diskussionsliste</span>
            </button>

            {/* Original Post */}
            <div className={`rounded-2xl p-5 border-2 ${selectedDiscussion === 'addition-zahlen-100' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  {selectedDiscussion === 'addition-zahlen-100' ? discussionThread.avatar : generalDiscussionThread.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">
                      {selectedDiscussion === 'addition-zahlen-100' ? discussionThread.user : generalDiscussionThread.user}
                    </span>
                    <span className={`px-2 py-0.5 text-white text-xs rounded-full font-medium ${selectedDiscussion === 'addition-zahlen-100' ? 'bg-green-600' : 'bg-blue-600'}`}>
                      Themenersteller
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedDiscussion === 'addition-zahlen-100' ? discussionThread.time : generalDiscussionThread.time}
                  </p>
                </div>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {selectedDiscussion === 'addition-zahlen-100' ? discussionThread.topic : generalDiscussionThread.topic}
              </h4>
              <p className="text-slate-700">
                {selectedDiscussion === 'addition-zahlen-100' ? discussionThread.content : generalDiscussionThread.content}
              </p>
            </div>

            {/* Replies */}
            <div className={`space-y-3 pl-6 border-l-2 ${selectedDiscussion === 'addition-zahlen-100' ? 'border-green-200' : 'border-blue-200'}`}>
              {(selectedDiscussion === 'addition-zahlen-100' ? discussionThread.replies : generalDiscussionThread.replies).map((reply, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                      {reply.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{reply.user}</span>
                        <span className="text-xs text-slate-500">{reply.time}</span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-line">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <textarea
                placeholder="Schreibe eine hilfreiche Antwort..."
                className="w-full rounded-lg border border-slate-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button className={`px-4 py-2 text-white rounded-lg font-bold text-sm transition-colors shadow-sm ${selectedDiscussion === 'addition-zahlen-100' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Antwort senden
                </button>
              </div>
            </div>
          </div>
        ) : selectedArea ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedArea(null)}
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
              <span className="text-lg">Zurück zu allen Bereichen</span>
            </button>
            
            <div className="space-y-3">
              {mathAreas.find(area => area.id === selectedArea)?.discussions.map((discussion, index) => (
                <button
                  key={index}
                  onClick={() => discussion.id === 'addition-zahlen-100' ? setSelectedDiscussion(discussion.id) : null}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-white hover:bg-emerald-50/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                      {['👧', '👦', '👧', '👦'][index % 4]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{discussion.user}</span>
                      </div>
                      <p className="text-slate-900 font-medium mb-1">{discussion.topic}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          💬 {discussion.replies} Antworten
                        </span>
                        <span>•</span>
                        <span>{discussion.time}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {mathAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`p-5 rounded-2xl border bg-gradient-to-br ${area.color} text-left transition-all hover:shadow-md hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                    {area.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{area.title}</h4>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  {area.discussions.length} aktive Diskussionen
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* General Discussions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h3 className="text-xl font-bold text-slate-900">Allgemeine Diskussionen</h3>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm">
            Neue Diskussion
          </button>
        </div>

        <div className="space-y-3">
          {discussions.map((discussion) => (
            <button
              key={discussion.id}
              onClick={() => discussion.id === 'general-textaufgaben' ? setSelectedDiscussion(discussion.id) : null}
              className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-white hover:bg-emerald-50/50"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                  {discussion.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{discussion.user}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {discussion.category}
                    </span>
                  </div>
                  <p className="text-slate-900 font-medium mb-1">{discussion.topic}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      💬 {discussion.replies} Antworten
                    </span>
                    <span>•</span>
                    <span>{discussion.time}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-3xl">ℹ️</span>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Community-Regeln</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>✓ Sei freundlich und respektvoll</li>
              <li>✓ Hilf anderen beim Lernen</li>
              <li>✓ Keine Lösungen verraten - nur Tipps geben</li>
              <li>✓ Frage bei Problemen einen Lehrer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
