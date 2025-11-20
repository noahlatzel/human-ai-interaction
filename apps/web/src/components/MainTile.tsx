import React from 'react';

interface MainTileProps {
  title: string;
  icon: string;
  color: string;
  description?: string;
  onClick?: () => void;
}

const MainTile: React.FC<MainTileProps> = ({ title, icon, color, description, onClick }) => {
  return (
    <button 
      className={`main-tile tile-${color}`}
      onClick={onClick}
      aria-label={title}
    >
      <div className="tile-icon">{icon}</div>
      <h2 className="tile-title">{title}</h2>
    </button>
  );
};

export default MainTile;

