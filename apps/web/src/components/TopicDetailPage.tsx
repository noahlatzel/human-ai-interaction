import React from 'react';
import forestBackground from '../assets/Forest.png';
import '../components/styles.css';

interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  icon: string;
  completed?: boolean;
}

interface TopicDetailPageProps {
  topicId: string;
  onBackToDashboard?: () => void;
  onStartLevel?: (topicId: string, levelId: string) => void;
}

const TopicDetailPage: React.FC<TopicDetailPageProps> = ({ 
  topicId, 
  onBackToDashboard,
  onStartLevel 
}) => {
  // Topic information mapping
  const topicInfo: Record<string, { title: string; icon: string; description: string; color: string }> = {
    'addition': {
      title: 'Addition',
      icon: '➕',
      description: 'Lerne die Grundlagen der Addition und löse spannende Aufgaben',
      color: 'orange'
    },
    'subtraction': {
      title: 'Subtraktion',
      icon: '➖',
      description: 'Meistere die Subtraktion mit verschiedenen Schwierigkeitsgraden',
      color: 'orange'
    },
    'addition-subtraction': {
      title: 'Kombination aus Addition & Subtraktion',
      icon: '±',
      description: 'Kombiniere Addition und Subtraktion in gemischten Aufgaben',
      color: 'purple'
    },
    'multiplication': {
      title: 'Multiplikation',
      icon: '✖️',
      description: 'Erlerne die Multiplikation Schritt für Schritt',
      color: 'blue'
    },
    'division': {
      title: 'Division',
      icon: '➗',
      description: 'Teile Zahlen und löse Divisionsaufgaben',
      color: 'blue'
    },
    'ratios-proportions': {
      title: 'Verhältnisse & Proportionen',
      icon: '⚖️',
      description: 'Verstehe Verhältnisse und proportionale Beziehungen',
      color: 'purple'
    },
    'money-change': {
      title: 'Geldwechsel / Zahlungsmöglichkeiten',
      icon: '💰',
      description: 'Lerne mit Geld umzugehen und Wechselgeld zu berechnen',
      color: 'orange'
    },
    'unit-problems': {
      title: 'Einheitenbezogene Sachaufgaben',
      icon: '📏',
      description: 'Löse Sachaufgaben mit verschiedenen Einheiten (kg, €, Stück)',
      color: 'blue'
    },
    'mixed-multistep': {
      title: 'Gemischte mehrschrittige Textaufgaben',
      icon: '📝',
      description: 'Meistere komplexe Aufgaben mit mehreren Lösungsschritten',
      color: 'purple'
    }
  };

  // Level definitions for each topic
  const getLevels = (topicId: string): Level[] => {
    const baseLevels: Record<string, Level[]> = {
      'addition': [
        {
          id: 'addition-1-10',
          name: 'Addition bis 10',
          description: 'Einfache Additionen mit Zahlen bis 10',
          difficulty: 'easy',
          duration: '8 Minuten',
          icon: '🔢'
        },
        {
          id: 'addition-1-20',
          name: 'Addition bis 20',
          description: 'Additionen mit Zahlen bis 20',
          difficulty: 'medium',
          duration: '10 Minuten',
          icon: '🔢'
        },
        {
          id: 'addition-1-100',
          name: 'Addition bis 100',
          description: 'Erweiterte Additionen mit Zahlen bis 100',
          difficulty: 'hard',
          duration: '15 Minuten',
          icon: '🔢'
        }
      ],
      'subtraction': [
        {
          id: 'subtraction-1-10',
          name: 'Subtraktion bis 10',
          description: 'Einfache Subtraktionen mit Zahlen bis 10',
          difficulty: 'easy',
          duration: '8 Minuten',
          icon: '🔢'
        },
        {
          id: 'subtraction-1-20',
          name: 'Subtraktion bis 20',
          description: 'Subtraktionen mit Zahlen bis 20',
          difficulty: 'medium',
          duration: '10 Minuten',
          icon: '🔢'
        },
        {
          id: 'subtraction-1-100',
          name: 'Subtraktion bis 100',
          description: 'Erweiterte Subtraktionen mit Zahlen bis 100',
          difficulty: 'hard',
          duration: '15 Minuten',
          icon: '🔢'
        }
      ],
      'multiplication': [
        {
          id: 'multiplication-tables',
          name: 'Einmaleins',
          description: 'Lerne das Einmaleins von 1 bis 10',
          difficulty: 'easy',
          duration: '12 Minuten',
          icon: '✖️'
        },
        {
          id: 'multiplication-2-digit',
          name: 'Multiplikation zweistellig',
          description: 'Multiplikation mit zweistelligen Zahlen',
          difficulty: 'medium',
          duration: '15 Minuten',
          icon: '✖️'
        },
        {
          id: 'multiplication-advanced',
          name: 'Erweiterte Multiplikation',
          description: 'Komplexe Multiplikationsaufgaben',
          difficulty: 'hard',
          duration: '20 Minuten',
          icon: '✖️'
        }
      ],
      'division': [
        {
          id: 'division-simple',
          name: 'Einfache Division',
          description: 'Grundlagen der Division',
          difficulty: 'easy',
          duration: '10 Minuten',
          icon: '➗'
        },
        {
          id: 'division-with-remainder',
          name: 'Division mit Rest',
          description: 'Divisionen mit Restbetrag',
          difficulty: 'medium',
          duration: '12 Minuten',
          icon: '➗'
        },
        {
          id: 'division-advanced',
          name: 'Erweiterte Division',
          description: 'Komplexe Divisionsaufgaben',
          difficulty: 'hard',
          duration: '18 Minuten',
          icon: '➗'
        }
      ],
      'addition-subtraction': [
        {
          id: 'addition-subtraction-basic',
          name: 'Grundlagen',
          description: 'Einfache Kombinationen aus Addition und Subtraktion',
          difficulty: 'easy',
          duration: '10 Minuten',
          icon: '±'
        },
        {
          id: 'addition-subtraction-intermediate',
          name: 'Mittelschwer',
          description: 'Komplexere Aufgaben mit beiden Operationen',
          difficulty: 'medium',
          duration: '12 Minuten',
          icon: '±'
        },
        {
          id: 'addition-subtraction-advanced',
          name: 'Fortgeschritten',
          description: 'Mehrschrittige Aufgaben mit Addition und Subtraktion',
          difficulty: 'hard',
          duration: '15 Minuten',
          icon: '±'
        }
      ],
      'ratios-proportions': [
        {
          id: 'ratios-basic',
          name: 'Einfache Verhältnisse',
          description: 'Grundlagen der Verhältnisse verstehen',
          difficulty: 'easy',
          duration: '10 Minuten',
          icon: '⚖️'
        },
        {
          id: 'ratios-intermediate',
          name: 'Proportionen',
          description: 'Proportionale Beziehungen erkennen und anwenden',
          difficulty: 'medium',
          duration: '12 Minuten',
          icon: '⚖️'
        },
        {
          id: 'ratios-advanced',
          name: 'Komplexe Verhältnisse',
          description: 'Schwierige Verhältnis- und Proportionalaufgaben',
          difficulty: 'hard',
          duration: '15 Minuten',
          icon: '⚖️'
        }
      ],
      'money-change': [
        {
          id: 'money-basic',
          name: 'Geldbeträge',
          description: 'Grundlagen: Geldbeträge erkennen und vergleichen',
          difficulty: 'easy',
          duration: '8 Minuten',
          icon: '💰'
        },
        {
          id: 'money-change',
          name: 'Wechselgeld',
          description: 'Wechselgeld berechnen und Zahlungen durchführen',
          difficulty: 'medium',
          duration: '10 Minuten',
          icon: '💰'
        },
        {
          id: 'money-advanced',
          name: 'Komplexe Geldaufgaben',
          description: 'Mehrschrittige Aufgaben mit Geld und Zahlungen',
          difficulty: 'hard',
          duration: '12 Minuten',
          icon: '💰'
        }
      ],
      'unit-problems': [
        {
          id: 'units-basic',
          name: 'Einfache Einheiten',
          description: 'Grundlagen: kg, €, Stück umrechnen',
          difficulty: 'easy',
          duration: '10 Minuten',
          icon: '📏'
        },
        {
          id: 'units-intermediate',
          name: 'Einheiten in Sachaufgaben',
          description: 'Sachaufgaben mit verschiedenen Einheiten lösen',
          difficulty: 'medium',
          duration: '12 Minuten',
          icon: '📏'
        },
        {
          id: 'units-advanced',
          name: 'Komplexe Einheitenaufgaben',
          description: 'Mehrschrittige Aufgaben mit mehreren Einheiten',
          difficulty: 'hard',
          duration: '15 Minuten',
          icon: '📏'
        }
      ],
      'mixed-multistep': [
        {
          id: 'multistep-basic',
          name: 'Einfache Textaufgaben',
          description: 'Zweischrittige Textaufgaben lösen',
          difficulty: 'easy',
          duration: '10 Minuten',
          icon: '📝'
        },
        {
          id: 'multistep-intermediate',
          name: 'Mehrschrittige Aufgaben',
          description: 'Textaufgaben mit mehreren Lösungsschritten',
          difficulty: 'medium',
          duration: '12 Minuten',
          icon: '📝'
        },
        {
          id: 'multistep-advanced',
          name: 'Komplexe Textaufgaben',
          description: 'Anspruchsvolle mehrschrittige Textaufgaben',
          difficulty: 'hard',
          duration: '15 Minuten',
          icon: '📝'
        }
      ]
    };

    // Default levels for topics without specific definitions
    const defaultLevels: Level[] = [
      {
        id: `${topicId}-easy`,
        name: 'Einfach',
        description: 'Einfache Aufgaben zum Einstieg',
        difficulty: 'easy',
        duration: '8 Minuten',
        icon: '⭐'
      },
      {
        id: `${topicId}-medium`,
        name: 'Mittel',
        description: 'Mittelschwere Aufgaben',
        difficulty: 'medium',
        duration: '12 Minuten',
        icon: '⭐⭐'
      },
      {
        id: `${topicId}-hard`,
        name: 'Schwer',
        description: 'Herausfordernde Aufgaben',
        difficulty: 'hard',
        duration: '15 Minuten',
        icon: '⭐⭐⭐'
      }
    ];

    return baseLevels[topicId] || defaultLevels;
  };

  const topic = topicInfo[topicId] || {
    title: 'Unbekanntes Thema',
    icon: '📚',
    description: 'Themenbereich',
    color: 'blue'
  };

  const levels = getLevels(topicId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'purple';
      default:
        return 'blue';
    }
  };

  const handleLevelClick = (level: Level) => {
    if (onStartLevel) {
      onStartLevel(topicId, level.id);
    }
  };

  return (
    <div 
      className="topic-detail-page-new" 
      style={{ 
        backgroundImage: `url("${forestBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="topic-detail-header-new">
        <button 
          className="topic-detail-back-btn-new"
          onClick={onBackToDashboard}
          aria-label="Zurück zum Dashboard"
        >
          <span className="back-icon-new">←</span>
          <span className="back-text-new">Zurück</span>
        </button>
        <div className="topic-detail-title-section-new">
          <div className={`topic-detail-icon-wrapper-new topic-${topic.color}`}>
            <span className="topic-detail-icon-new">{topic.icon}</span>
          </div>
          <h1 className="topic-detail-title-new">{topic.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="topic-detail-content-new">
        {/* Summary Section */}
        <div className="topic-detail-summary-card-new">
          <h2 className="topic-detail-section-title-new">Übersicht</h2>
          <p className="topic-detail-description-new">{topic.description}</p>
        </div>

        {/* Levels Section */}
        <div className="topic-detail-levels-section-new">
          <h2 className="topic-detail-section-title-new">Schwierigkeitslevel</h2>
          <div className="topic-detail-levels-grid-new">
            {levels.map((level) => (
              <button
                key={level.id}
                className={`topic-detail-level-card-new level-${getDifficultyColor(level.difficulty)}`}
                onClick={() => handleLevelClick(level)}
              >
                <div className="topic-detail-level-header-new">
                  <span className="topic-detail-level-icon-new">{level.icon}</span>
                  <div className="topic-detail-level-info-new">
                    <h3 className="topic-detail-level-name-new">{level.name}</h3>
                    <span className={`topic-detail-difficulty-badge-new difficulty-${level.difficulty}`}>
                      {level.difficulty === 'easy' ? 'Einfach' : level.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                    </span>
                  </div>
                </div>
                <p className="topic-detail-level-description-new">{level.description}</p>
                <div className="topic-detail-level-footer-new">
                  <span className="topic-detail-level-duration-new">⏱️ {level.duration}</span>
                  {level.completed && (
                    <span className="topic-detail-level-completed-new">✅ Abgeschlossen</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicDetailPage;

