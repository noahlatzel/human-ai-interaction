import React, { useState } from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';

interface FooterNavProps {
  onNavigateToAccount?: () => void;
}

const FooterNav: React.FC<FooterNavProps> = ({ onNavigateToAccount }) => {
  const [activeNav, setActiveNav] = useState<string>('nav_home');
  
  const navItems = [
    { id: "nav_home", icon: "🏠", label: "Home" },
    { id: "nav_exercises", icon: "🧮", label: "Übungen" },
    { id: "nav_profile", icon: null, label: "Ich", image: avatarImage }
  ];

  const handleNavClick = (itemId: string) => {
    setActiveNav(itemId);
    if (itemId === 'nav_profile' && onNavigateToAccount) {
      onNavigateToAccount();
    }
  };

  return (
    <nav className="footer-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id)}
          aria-label={item.label}
        >
          {item.image ? (
            <img 
              src={item.image}
              alt={item.label}
              className="nav-icon-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextSibling) {
                  (target.nextSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
          ) : (
            <span className="nav-icon">{item.icon}</span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default FooterNav;

