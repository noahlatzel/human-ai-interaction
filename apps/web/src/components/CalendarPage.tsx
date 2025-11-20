import React, { useState } from 'react';
import avatarImage from '../assets/ChatGPT_Image_19._Nov._2025__19_49_20-removebg-preview.png';
import forestBackground from '../assets/ChatGPT Image 19. Nov. 2025, 19_18_02.png';
import '../components/styles.css';

interface CalendarPageProps {
  onBackToDashboard?: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onBackToDashboard }) => {
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
    </div>
  );
};

export default CalendarPage;
