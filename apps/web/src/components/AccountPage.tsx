import React, { useState } from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/ChatGPT Image 19. Nov. 2025, 19_18_02.png';
import '../components/styles.css';

interface AccountPageProps {
  onBackToDashboard?: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onBackToDashboard }) => {
  const [profileData, setProfileData] = useState({
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    klasse: '5a'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    // Add save logic here
  };

  return (
    <div 
      className="account-page-new" 
      style={{ 
        backgroundImage: `url("${forestBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="account-header-new">
        <button 
          className="account-back-btn-new"
          onClick={onBackToDashboard}
          aria-label="Zurück zum Dashboard"
        >
          <span className="back-icon-new">←</span>
          <span className="back-text-new">Zurück</span>
        </button>
        <div className="account-title-section-new">
          <img 
            src={avatarImage}
            alt="Avatar"
            className="account-avatar-new"
          />
          <h1 className="account-title-new">Mein Konto</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="account-content-new">
        {/* Profil Section */}
        <div className="account-section-card-new">
          <h2 className="account-section-title-new">Profil</h2>
          <div className="account-form-grid-new">
            <div className="account-form-item-new">
              <label className="account-label-new">Vorname</label>
              <input 
                type="text" 
                className="account-input-new"
                placeholder="Max"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">Nachname</label>
              <input 
                type="text" 
                className="account-input-new"
                placeholder="Mustermann"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">E-Mail</label>
              <input 
                type="email" 
                className="account-input-new"
                placeholder="max@example.com"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">Klasse</label>
              <input 
                type="text" 
                className="account-input-new"
                placeholder="5a"
                value={profileData.klasse}
                onChange={(e) => handleInputChange('klasse', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Statistiken Section */}
        <div className="account-section-card-new">
          <h2 className="account-section-title-new">Statistiken</h2>
          <div className="account-stats-grid-new">
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">📊</div>
              <div className="account-stat-value-new">650</div>
              <div className="account-stat-label-new">XP Gesamt</div>
            </div>
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">🔥</div>
              <div className="account-stat-value-new">7</div>
              <div className="account-stat-label-new">Tage Streak</div>
            </div>
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">✅</div>
              <div className="account-stat-value-new">42</div>
              <div className="account-stat-label-new">Aufgaben gelöst</div>
            </div>
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">🏆</div>
              <div className="account-stat-value-new">5</div>
              <div className="account-stat-label-new">Abzeichen</div>
            </div>
          </div>
        </div>

        {/* Einstellungen Section */}
        <div className="account-section-card-new">
          <h2 className="account-section-title-new">Einstellungen</h2>
          <div className="account-settings-list-new">
            <button className="account-setting-item-new">
              <span className="account-setting-icon-new">🔔</span>
              <span className="account-setting-text-new">Benachrichtigungen</span>
              <span className="account-setting-arrow-new">›</span>
            </button>
            <button className="account-setting-item-new">
              <span className="account-setting-icon-new">🎨</span>
              <span className="account-setting-text-new">Design & Darstellung</span>
              <span className="account-setting-arrow-new">›</span>
            </button>
            <button className="account-setting-item-new">
              <span className="account-setting-icon-new">🔒</span>
              <span className="account-setting-text-new">Passwort ändern</span>
              <span className="account-setting-arrow-new">›</span>
            </button>
            <button className="account-setting-item-new">
              <span className="account-setting-icon-new">📱</span>
              <span className="account-setting-text-new">Datenschutz</span>
              <span className="account-setting-arrow-new">›</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="account-actions-new">
          <button className="account-save-btn-new" onClick={handleSave}>
            Änderungen speichern
          </button>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
