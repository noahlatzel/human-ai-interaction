import React from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/ChatGPT Image 19. Nov. 2025, 19_18_02.png';
import '../components/styles.css';

interface DiscoverPageProps {
  onBackToDashboard?: () => void;
}

interface DiscoverItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ onBackToDashboard }) => {
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
              <div className="discover-icon-wrapper-new">
                <span className="discover-icon-new">{item.icon}</span>
              </div>
              <h3 className="discover-card-title-new">{item.title}</h3>
              <p className="discover-card-description-new">{item.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DiscoverPage;

