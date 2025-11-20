import React, { useState } from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/Forest.png';
import '../components/styles.css';

interface CalendarPageProps {
  onBackToDashboard?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToDiscover?: () => void;
  onNavigateToAccount?: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ 
  onBackToDashboard,
  onNavigateToDashboard,
  onNavigateToDiscover,
  onNavigateToAccount
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('de-DE', { month: 'long' });
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const days = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);
  // Adjust firstDay to make Monday 0, Sunday 6 (standard JS is Sun 0)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  const renderCalendarDays = () => {
    const calendarDays = [];
    // Empty cells for days before the start of the month
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="cal-day-new cal-day-empty"></div>
      );
    }
    
    // Days of the month
    for (let i = 1; i <= days; i++) {
      const isToday = isCurrentMonth && i === today.getDate();
      const hasEvent = i % 7 === 0 || i === 15 || i === 22;
      const eventType = i % 7 === 0 ? 'blue' : i === 15 ? 'orange' : 'purple';
        
      calendarDays.push(
        <div 
          key={i} 
          className={`cal-day-new ${isToday ? 'cal-day-today' : ''} ${hasEvent ? 'cal-day-has-event' : ''}`}
        >
          <span className="cal-day-number">{i}</span>
          {hasEvent && <div className={`cal-event-dot cal-event-${eventType}`}></div>}
        </div>
      );
    }
    return calendarDays;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Mock events data
  const upcomingEvents = [
    {
      id: 1,
      day: 15,
      month: getMonthName(currentDate).slice(0, 3),
      title: 'Mathe Test',
      description: 'Kapitel 3: Brüche',
      time: '10:00',
      color: 'blue'
    },
    {
      id: 2,
      day: 22,
      month: getMonthName(currentDate).slice(0, 3),
      title: 'Hausaufgaben Abgabe',
      description: 'Geometrie Arbeitsblatt',
      time: '14:00',
      color: 'orange'
    },
    {
      id: 3,
      day: 28,
      month: getMonthName(currentDate).slice(0, 3),
      title: 'Projekt Präsentation',
      description: 'Gruppenprojekt Mathematik',
      time: '09:00',
      color: 'purple'
    }
  ];

  return (
    <div 
      className="calendar-page-new" 
      style={{ 
        backgroundImage: `url("${forestBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="calendar-header-new">
        <button 
          className="calendar-back-btn-new"
          onClick={onBackToDashboard}
          aria-label="Zurück zum Dashboard"
        >
          <span className="back-icon-new">←</span>
          <span className="back-text-new">Zurück</span>
        </button>
        <div className="calendar-title-section-new">
          <img 
            src={avatarImage}
            alt="Avatar"
            className="calendar-avatar-new"
          />
          <h1 className="calendar-title-new">Mein Kalender</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="calendar-content-new">
        {/* Calendar Container */}
        <div className="calendar-wrapper-new">
          {/* Month Navigation */}
          <div className="calendar-nav-new">
            <button 
              onClick={prevMonth} 
              className="cal-nav-btn-new cal-nav-prev"
              aria-label="Vorheriger Monat"
            >
              <span>‹</span>
            </button>
            <div className="cal-month-display-new">
              <h2 className="cal-month-name-new">
                {getMonthName(currentDate)} {getYear(currentDate)}
              </h2>
              <button 
                onClick={goToToday}
                className="cal-today-btn-new"
              >
                Heute
              </button>
            </div>
            <button 
              onClick={nextMonth} 
              className="cal-nav-btn-new cal-nav-next"
              aria-label="Nächster Monat"
            >
              <span>›</span>
            </button>
          </div>
          
          {/* Weekday Headers */}
          <div className="cal-weekdays-new">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <div key={day} className="cal-weekday-new">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="cal-grid-new">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="events-section-new">
          <h3 className="events-title-new">Nächste Termine</h3>
          <div className="events-list-new">
            {upcomingEvents.map((event) => (
              <div key={event.id} className={`event-item-new event-${event.color}`}>
                <div className="event-date-box-new">
                  <span className="event-day-new">{event.day}.</span>
                  <span className="event-month-new">{event.month}</span>
                </div>
                <div className="event-info-new">
                  <h4 className="event-title-new">{event.title}</h4>
                  <p className="event-desc-new">{event.description}</p>
                </div>
                <div className="event-time-new">
                  {event.time}
                </div>
              </div>
            ))}
          </div>
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
          <span className="nav-label-new">Home</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToDiscover}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 3L12 12M12 12L16 8M12 12L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label-new">Discover</span>
        </button>
        <button className="nav-btn-new nav-active" onClick={() => {}}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 4V6M17 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <text x="12" y="18" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="600">17</text>
            </svg>
          </span>
          <span className="nav-label-new">Calendar</span>
        </button>
        <button className="nav-btn-new" onClick={onNavigateToAccount}>
          <span className="nav-icon-new">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 20C6 16 8.686 14 12 14C15.314 14 18 16 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="nav-label-new">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default CalendarPage;
