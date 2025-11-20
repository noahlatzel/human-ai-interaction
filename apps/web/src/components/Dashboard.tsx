import React, { useState } from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/Forest.png';
import '../components/styles.css';

interface Topic {
  id: string;
  title: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  description?: string;
}

interface DashboardProps {
  onNavigateToTask?: () => void;
  onNavigateToAccount?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToDiscover?: () => void;
  onNavigateToTopicDetail?: (topicId: string) => void;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateToTask, 
  onNavigateToAccount, 
  onNavigateToCalendar, 
  onNavigateToDiscover,
  onNavigateToTopicDetail,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'class'>('practice');
  const [userName] = useState('Jonathan');
  const [streak] = useState(32);
  
  const currentDate = new Date();
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const currentDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  
  const formatDate = (date: Date) => {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
  };

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  const homePracticeTopics: Topic[] = [
    {
      id: 'addition',
      title: 'Plus',
      icon: '➕',
      color: 'orange',
      description: 'Lerne die Grundlagen der Addition und löse spannende Aufgaben'
    },
    {
      id: 'subtraction',
      title: 'Minus',
      icon: '➖',
      color: 'orange',
      description: 'Meistere die Subtraktion mit verschiedenen Schwierigkeitsgraden'
    },
    {
      id: 'addition-subtraction',
      title: 'Kombinationsaufgaben',
      icon: '±',
      color: 'purple',
      description: 'Kombiniere Addition und Subtraktion in gemischten Aufgaben'
    },
    {
      id: 'multiplication',
      title: 'Multiplikation',
      icon: '✖️',
      color: 'blue',
      description: 'Erlerne die Multiplikation Schritt für Schritt'
    },
    {
      id: 'division',
      title: 'Division',
      icon: '➗',
      color: 'blue',
      description: 'Teile Zahlen und löse Divisionsaufgaben'
    },
    {
      id: 'ratios-proportions',
      title: 'Prozentrechnung',
      icon: '⚖️',
      color: 'purple',
      description: 'Verstehe Verhältnisse und proportionale Beziehungen'
    },
    {
      id: 'money-change',
      title: 'Währungsrechnung',
      icon: '💰',
      color: 'orange',
      description: 'Lerne mit Geld umzugehen und Wechselgeld zu berechnen'
    },
    {
      id: 'unit-problems',
      title: 'Maße & Gewichte',
      icon: '📏',
      color: 'blue',
      description: 'Löse Sachaufgaben mit verschiedenen Einheiten'
    },
    {
      id: 'mixed-multistep',
      title: 'Textaufgaben',
      icon: '📝',
      color: 'purple',
      description: 'Meistere komplexe Aufgaben mit mehreren Lösungsschritten'
    }
  ];

  const inClassPracticeTopics: Topic[] = [];

  const handleTopicClick = (topic: Topic) => {
    if (onNavigateToTopicDetail) {
      onNavigateToTopicDetail(topic.id);
    } else if (onNavigateToTask) {
      onNavigateToTask();
    }
  };

  return (
    <div className="dashboard-new" style={{ 
      backgroundImage: `url("${forestBackground}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header Section */}
      <header className="dashboard-header-new">
        <div className="header-content-new">
          <div className="greeting-section-new">
            <h1 className="greeting-text-new">{getGreeting()}, {userName}!</h1>
          </div>
          <div className="header-actions-new">
            <div className="user-profile-new">
              <img 
                src={avatarImage} 
                alt="User Avatar" 
                className="user-avatar-new"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="genius-badge-new">GENIUS</div>
            </div>
            <button 
              className="logout-btn-new" 
              onClick={onLogout} 
              aria-label="Abmelden"
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Abmelden</span>
            </button>
          </div>
        </div>
      </header>

      {/* Daily Progress Card */}
      <div className="progress-card-new">
        <div className="progress-header-new">
          <span className="date-text-new">{formatDate(currentDate)}</span>
          <div className="streak-badge-new">
            <span className="streak-icon-new">🔥</span>
            <span className="streak-number-new">{streak}</span>
          </div>
        </div>
        <div className="week-grid-new">
          {dayNames.map((day, index) => {
            const isActive = index === currentDayIndex;
            const isCompleted = index < currentDayIndex;
            return (
              <div 
                key={day} 
                className={`day-cell-new ${isActive ? 'active-day' : ''} ${isCompleted ? 'completed-day' : ''}`}
              >
                <span className="day-name-new">{day}</span>
                {(isActive || isCompleted) && (
                  <span className="day-flame-new">🔥</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container-new">
        <button 
          className={`tab-btn-new ${activeTab === 'practice' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="tab-icon-new">📚</span>
          <span className="tab-label-new">Zuhause üben</span>
        </button>
        <button 
          className={`tab-btn-new ${activeTab === 'class' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('class')}
        >
          <span className="tab-icon-new">📋</span>
          <span className="tab-label-new">Klassenübungen</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="content-area-new">
        {activeTab === 'practice' && (
          <div className="topics-wrapper-new">
            <div className="topics-grid-new">
              {homePracticeTopics.map((topic) => (
                <button
                  key={topic.id}
                  className={`topic-card-new topic-${topic.color}`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="topic-card-header-new">
                    <span className="topic-card-icon-new">{topic.icon}</span>
                    <div className="topic-card-info-new">
                      <h3 className="topic-card-title-new">{topic.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'class' && (
          <div className="topics-wrapper-new">
            <div className="topics-grid-new">
              {inClassPracticeTopics.length === 0 ? (
                <div className="empty-state-new">
                  <span className="empty-icon-new">📋</span>
                  <p className="empty-text-new">Noch keine Aufgaben verfügbar</p>
                </div>
              ) : (
                inClassPracticeTopics.map((topic) => (
                  <button
                    key={topic.id}
                    className={`topic-card-new topic-${topic.color}`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="topic-card-header-new">
                      <span className="topic-card-icon-new">{topic.icon}</span>
                      <div className="topic-card-info-new">
                        <h3 className="topic-card-title-new">{topic.title}</h3>
                      </div>
                    </div>
                    {topic.description && (
                      <p className="topic-card-description-new">{topic.description}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-new">
        <button className="nav-btn-new nav-active" onClick={() => {}}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label-new">Start</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToDiscover}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 3L12 12M12 12L16 8M12 12L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label-new">Entdecken</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToCalendar}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 4V6M17 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <text x="12" y="18" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="600">17</text>
            </svg>
          </span>
          <span className="nav-label-new">Kalender</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToAccount}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 20C6 16 8.686 14 12 14C15.314 14 18 16 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="nav-label-new">Profil</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
