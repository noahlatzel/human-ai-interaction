import React from 'react';
import squirrelImage from '../assets/WhatsApp_Image_2025-11-19_at_19.11.00-removebg-preview.png';

const ChatBot: React.FC = () => {
  return (
    <div className="chatbot-container">
      <div className="speech-bubble">
        <p className="speech-text">
          Hey wie geht es dir heute? Hast du Lust Mathematik zu lernen?
        </p>
      </div>
      <div className="squirrel-wrapper">
        <img 
          src={squirrelImage} 
          alt="MatheBuddy Chat Bot" 
          className="squirrel-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextSibling) {
              (target.nextSibling as HTMLElement).style.display = 'block';
            }
          }}
        />
        <div className="squirrel-emoji" style={{ display: 'none' }}>🐿️</div>
      </div>
    </div>
  );
};

export default ChatBot;

