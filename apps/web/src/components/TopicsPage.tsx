import React from 'react';

interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface TopicsPageProps {
  onBackToDashboard?: () => void;
  onSelectTopic?: (topic: Topic) => void;
}

const TopicsPage: React.FC<TopicsPageProps> = ({ onBackToDashboard, onSelectTopic }) => {
  const topics: Topic[] = [
    {
      id: 'addition',
      title: 'Addition',
      icon: '➕',
      description: 'Grundlagen der Addition'
    },
    {
      id: 'subtraction',
      title: 'Subtraktion',
      icon: '➖',
      description: 'Grundlagen der Subtraktion'
    },
    {
      id: 'addition-subtraction',
      title: 'Kombination aus Addition & Subtraktion',
      icon: '➕➖',
      description: 'Gemischte Aufgaben mit Addition und Subtraktion'
    },
    {
      id: 'multiplication',
      title: 'Multiplikation',
      icon: '✖️',
      description: 'Grundlagen der Multiplikation'
    },
    {
      id: 'division',
      title: 'Division',
      icon: '➗',
      description: 'Grundlagen der Division'
    },
    {
      id: 'ratios-proportions',
      title: 'Verhältnisse & Proportionen',
      icon: '⚖️',
      description: 'Verhältnisse und proportionale Beziehungen'
    },
    {
      id: 'money-change',
      title: 'Geldwechsel / Zahlungsmöglichkeiten',
      icon: '💰',
      description: 'Aufgaben rund um Geld und Zahlungen'
    },
    {
      id: 'unit-problems',
      title: 'Einheitenbezogene Sachaufgaben (kg, €, Stück)',
      icon: '📏',
      description: 'Sachaufgaben mit verschiedenen Einheiten'
    },
    {
      id: 'mixed-multistep',
      title: 'Gemischte mehrschrittige Textaufgaben',
      icon: '📝',
      description: 'Komplexe Aufgaben mit mehreren Schritten'
    }
  ];

  const handleTopicClick = (topic: Topic) => {
    if (onSelectTopic) {
      onSelectTopic(topic);
    } else {
      // Fallback: Zur TaskPage navigieren
      console.log('Selected topic:', topic);
    }
  };

  return (
    <div className="topics-page-container">
      <div className="forest-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Back Button */}
      <button 
        className="topics-back-button"
        onClick={onBackToDashboard}
        aria-label="Zurück zum Dashboard"
      >
        ← Zurück
      </button>

      <div className="topics-page-content">
        <div className="topics-header">
          <h1 className="topics-title">Themen</h1>
          <p className="topics-subtitle">Wähle einen Aufgabenbereich aus</p>
        </div>

        <div className="topics-grid">
          {topics.map((topic) => (
            <button
              key={topic.id}
              className="topic-card"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="topic-icon">{topic.icon}</div>
              <h3 className="topic-title">{topic.title}</h3>
              <p className="topic-description">{topic.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;

