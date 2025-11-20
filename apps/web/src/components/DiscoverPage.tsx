import React from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/Forest.png';
import '../components/styles.css';

interface DiscoverPageProps {
  onBackToDashboard?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToAccount?: () => void;
}

interface DiscoverItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ 
  onBackToDashboard,
  onNavigateToDashboard,
  onNavigateToCalendar,
  onNavigateToAccount
}) => {
  const discoverItems: DiscoverItem[] = [
    {
      id: 'new-topics',
      title: 'Neue Themen',
      description: 'Entdecke neue mathematische Konzepte',
      icon: '🌟',
      color: 'orange'
    },
    {
      id: 'challenges',
      title: 'Herausforderungen',
      description: 'Teste dein Wissen mit spannenden Challenges',
      icon: '🏆',
      color: 'purple'
    },
    {
      id: 'achievements',
      title: 'Errungenschaften',
      description: 'Schaue dir deine Erfolge an',
      icon: '🎖️',
      color: 'blue'
    },
    {
      id: 'leaderboard',
      title: 'Bestenliste',
      description: 'Vergleiche dich mit anderen',
      icon: '📊',
      color: 'green'
    },
    {
      id: 'tips',
      title: 'Tipps & Tricks',
      description: 'Lerne effektive Lernstrategien',
      icon: '💡',
      color: 'orange'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Tausche dich mit anderen aus',
      icon: '👥',
      color: 'purple'
    }
  ];

  const handleItemClick = (item: DiscoverItem) => {
    console.log('Selected discover item:', item);
    // Add navigation logic here if needed
  };

  return (
    <div 
      className="discover-page-new" 
      style={{ 
        backgroundImage: `url("${forestBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="discover-header-new">
        <button 
          className="discover-back-btn-new"
          onClick={onBackToDashboard}
          aria-label="Zurück zum Dashboard"
        >
          <span className="back-icon-new">←</span>
          <span className="back-text-new">Zurück</span>
        </button>
        <div className="discover-title-section-new">
          <img 
            src={avatarImage}
            alt="Avatar"
            className="discover-avatar-new"
          />
          <h1 className="discover-title-new">Entdecken</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="discover-content-new">
        <div className="discover-intro-new">
          <p className="discover-subtitle-new">Entdecke neue Möglichkeiten zum Lernen</p>
        </div>

        <div className="discover-grid-new">
          {discoverItems.map((item) => (
            <button
              key={item.id}
              className={`discover-card-new discover-${item.color}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="discover-card-header-new">
                <span className="discover-card-icon-new">{item.icon}</span>
                <div className="discover-card-info-new">
                  <h3 className="discover-card-title-new">{item.title}</h3>
                </div>
              </div>
              <p className="discover-card-description-new">{item.description}</p>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-new">
        <button className="nav-btn-new" onClick={onNavigateToDashboard}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label-new">Start</span>
        </button>
        <button className="nav-btn-new nav-active" onClick={() => {}}>
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

export default DiscoverPage;

