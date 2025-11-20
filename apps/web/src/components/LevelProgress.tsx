import React from 'react';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  levelIcon?: string;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ currentLevel, currentXP, xpForNextLevel, levelIcon }) => {
  const progressPercentage = (currentXP / xpForNextLevel) * 100;
  
  const levels = [
    { id: 1, name: "Einsteiger", icon: "🐿️", xpRequired: 0 },
    { id: 2, name: "Fortgeschritten", icon: "🦌", xpRequired: 1000 },
    { id: 3, name: "Experte", icon: "🦅", xpRequired: 2500 },
    { id: 4, name: "Meister", icon: "🐉", xpRequired: 5000 }
  ];
  
  const currentLevelData = levels.find(l => l.id === currentLevel) || levels[0];
  const nextLevelData = levels.find(l => l.id === currentLevel + 1);
  
  return (
    <div className="level-progress-container">
      <div className="level-icon-display">
        <span className="level-icon">{currentLevelData.icon}</span>
        <span className="level-number">Lvl {currentLevel}</span>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar-arrow">
          <div 
            className="progress-bar-fill"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            <div className="chevron-pattern"></div>
          </div>
          <div className="progress-bar-empty"></div>
        </div>
        {nextLevelData && (
          <div className="next-level-icon-display">
            <span className="next-level-icon">{nextLevelData.icon}</span>
            <span className="next-level-number">Lvl {nextLevelData.id}</span>
          </div>
        )}
      </div>
      
      <div className="level-xp-info">
        <span className="current-xp">{currentXP}</span>
        <span className="xp-separator">/</span>
        <span className="next-xp">{xpForNextLevel}</span>
      </div>
    </div>
  );
};

export default LevelProgress;

