import React, { useState } from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/ChatGPT Image 19. Nov. 2025, 19_18_02.png';
import '../components/styles.css';

interface Topic {
  id: string;
  title: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

interface DashboardProps {
  onNavigateToTask?: () => void;
  onNavigateToTopics?: () => void;
  onNavigateToAccount?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToDiscover?: () => void;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateToTask, 
  onNavigateToTopics, 
  onNavigateToAccount, 
  onNavigateToCalendar, 
  onNavigateToDiscover, 
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
      title: 'Addition',
      icon: '➕',
      color: 'orange'
    },
    {
      id: 'subtraction',
      title: 'Subtraktion',
      icon: '➖',
      color: 'orange'
    },
    {
      id: 'addition-subtraction',
      title: 'Kombination aus Addition & Subtraktion',
      icon: '±',
      color: 'purple'
    },
    {
      id: 'multiplication',
      title: 'Multiplikation',
      icon: '✖️',
      color: 'blue'
    },
    {
      id: 'division',
      title: 'Division',
      icon: '➗',
      color: 'blue'
    },
    {
      id: 'ratios-proportions',
      title: 'Verhältnisse & Proportionen',
      icon: '⚖️',
      color: 'purple'
    },
    {
      id: 'money-change',
      title: 'Geldwechsel / Zahlungsmöglichkeiten',
      icon: '💰',
      color: 'orange'
    },
    {
      id: 'unit-problems',
      title: 'Einheitenbezogene Sachaufgaben (kg, €, Stück)',
      icon: '📏',
      color: 'blue'
    },
    {
      id: 'mixed-multistep',
      title: 'Gemischte mehrschrittige Textaufgaben',
      icon: '📝',
      color: 'purple'
    }
  ];

  const inClassPracticeTopics: Topic[] = [];

  const handleTopicClick = (topic: Topic) => {
    if (onNavigateToTask) {
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
              <span className="logout-text">Log out</span>
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
          <span className="tab-label-new">Home Practice</span>
        </button>
        <button 
          className={`tab-btn-new ${activeTab === 'class' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('class')}
        >
          <span className="tab-icon-new">📋</span>
          <span className="tab-label-new">In-class practice</span>
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
                  <div className="topic-icon-wrapper-new">
                    <span className="topic-icon-new">{topic.icon}</span>
                  </div>
                  <h3 className="topic-title-new">{topic.title}</h3>
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
                    <div className="topic-icon-wrapper-new">
                      <span className="topic-icon-new">{topic.icon}</span>
                    </div>
                    <h3 className="topic-title-new">{topic.title}</h3>
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
          <span className="nav-icon-new">😊</span>
          <span className="nav-label-new">Home</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToDiscover}>
          <span className="nav-icon-new">🧭</span>
          <span className="nav-label-new">Discover</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToCalendar}>
          <span className="nav-icon-new">📅</span>
          <span className="nav-label-new">Calendar</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToAccount}>
          <span className="nav-icon-new">👤</span>
          <span className="nav-label-new">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
