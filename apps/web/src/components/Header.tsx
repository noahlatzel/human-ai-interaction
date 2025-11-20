import React from 'react';
import LevelProgress from './LevelProgress';

interface HeaderProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ currentLevel, currentXP, xpForNextLevel, streak }) => {
  return (
    <header className="dashboard-header">
      <div className="header-stats">
        <LevelProgress 
          currentLevel={currentLevel}
          currentXP={currentXP}
          xpForNextLevel={xpForNextLevel}
        />
      </div>
      
      <div className="stat-item">
        <span className="stat-icon">🔥</span>
        <span className="stat-label">Streak</span>
        <span className="stat-value">{streak}</span>
      </div>
    </header>
  );
};

export default Header;

