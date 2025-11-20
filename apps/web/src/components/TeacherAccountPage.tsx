import React, { useState } from 'react';
import avatarImage from '../assets/Lehrer_Avatar.png';
import forestBackground from '../assets/Forest.png';
import '../components/styles.css';

interface TeacherAccountPageProps {
  onBackToDashboard?: () => void;
}

const TeacherAccountPage: React.FC<TeacherAccountPageProps> = ({ onBackToDashboard }) => {
  const [profileData, setProfileData] = useState({
    firstName: 'Maria',
    lastName: 'Schmidt',
    email: 'maria.schmidt@schule.de',
    school: 'Grundschule Musterstadt',
    subjects: 'Mathematik, Deutsch',
    phone: '+49 123 456789'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving teacher profile:', profileData);
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
          <h1 className="account-title-new">Lehrer-Konto</h1>
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
                placeholder="Maria"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">Nachname</label>
              <input 
                type="text" 
                className="account-input-new"
                placeholder="Schmidt"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">E-Mail</label>
              <input 
                type="email" 
                className="account-input-new"
                placeholder="maria.schmidt@schule.de"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">Schule</label>
              <input 
                type="text" 
                className="account-input-new"
                placeholder="Grundschule Musterstadt"
                value={profileData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">Fächer</label>
              <input 
                type="text" 
                className="account-input-new"
                placeholder="Mathematik, Deutsch"
                value={profileData.subjects}
                onChange={(e) => handleInputChange('subjects', e.target.value)}
              />
            </div>
            <div className="account-form-item-new">
              <label className="account-label-new">Telefon</label>
              <input 
                type="tel" 
                className="account-input-new"
                placeholder="+49 123 456789"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Statistiken Section */}
        <div className="account-section-card-new">
          <h2 className="account-section-title-new">Statistiken</h2>
          <div className="account-stats-grid-new">
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">👥</div>
              <div className="account-stat-value-new">24</div>
              <div className="account-stat-label-new">Schüler gesamt</div>
            </div>
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">📚</div>
              <div className="account-stat-value-new">3</div>
              <div className="account-stat-label-new">Klassen</div>
            </div>
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">📝</div>
              <div className="account-stat-value-new">156</div>
              <div className="account-stat-label-new">Aufgaben erstellt</div>
            </div>
            <div className="account-stat-card-new">
              <div className="account-stat-icon-new">✅</div>
              <div className="account-stat-value-new">89%</div>
              <div className="account-stat-label-new">Durchschnittliche Erfolgsrate</div>
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
              <span className="account-setting-icon-new">👥</span>
              <span className="account-setting-text-new">Klassenverwaltung</span>
              <span className="account-setting-arrow-new">›</span>
            </button>
            <button className="account-setting-item-new">
              <span className="account-setting-icon-new">🔒</span>
              <span className="account-setting-text-new">Passwort ändern</span>
              <span className="account-setting-arrow-new">›</span>
            </button>
            <button className="account-setting-item-new">
              <span className="account-setting-icon-new">📊</span>
              <span className="account-setting-text-new">Berichte & Export</span>
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

export default TeacherAccountPage;

