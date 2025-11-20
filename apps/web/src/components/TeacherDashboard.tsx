import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles.css';

interface Student {
  id: string;
  name: string;
  completedTasks: number;
  totalTasks: number;
}

interface TeacherDashboardProps {
  onLogout?: () => void;
  onNavigateToAccount?: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout, onNavigateToAccount }) => {
  const navigate = useNavigate();
  const [currentClass] = useState('3a');
  
  const [students] = useState<Student[]>([
    { id: '1', name: 'Lisa M.', completedTasks: 4, totalTasks: 12 },
    { id: '2', name: 'Tim K.', completedTasks: 8, totalTasks: 12 },
    { id: '3', name: 'Emma S.', completedTasks: 12, totalTasks: 12 },
    { id: '4', name: 'Max W.', completedTasks: 0, totalTasks: 12 },
    { id: '5', name: 'Sophie H.', completedTasks: 6, totalTasks: 12 },
    { id: '6', name: 'Noah B.', completedTasks: 10, totalTasks: 12 },
  ]);

  const calculateSuccessRate = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/teacher-login');
  };

  const handleAddStudent = () => {
    console.log('Add Student clicked');
    // Add logic here
  };

  const handleAddMathProblem = () => {
    console.log('Add new Math Problem clicked');
    // Add logic here
  };

  return (
    <div className="teacher-dashboard">
      {/* Top Bar */}
      <header className="teacher-top-bar">
        <h1 className="teacher-dashboard-title">Teacher Dashboard</h1>
        <div className="teacher-top-bar-icons">
          <button 
            className="teacher-icon-btn"
            onClick={() => onNavigateToAccount && onNavigateToAccount()}
            aria-label="Profil"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 20C6 16 8.686 14 12 14C15.314 14 18 16 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button 
            className="teacher-icon-btn"
            onClick={handleLogout}
            aria-label="Abmelden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Title Section */}
      <div className="teacher-title-section">
        <span className="teacher-title-placeholder">Titel</span>
        <span className="teacher-class-title">Klasse {currentClass} – Übersicht</span>
      </div>

      {/* Main Content Area */}
      <main className="teacher-main-content">
        {/* Left Side - Class List */}
        <div className="teacher-left-column">
          <div className="teacher-section-header">
            <h2 className="teacher-section-title">Klassenliste</h2>
            <span className="teacher-success-rate-label">Success rate</span>
          </div>
          <div className="teacher-student-list">
            {students.map((student) => {
              const successRate = calculateSuccessRate(student.completedTasks, student.totalTasks);
              const hasNoTasks = student.totalTasks === 0;
              
              return (
                <div key={student.id} className="teacher-student-item">
                  <div className="teacher-student-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M6 20C6 16 8.686 14 12 14C15.314 14 18 16 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="teacher-student-info">
                    <span className="teacher-student-name">{student.name}</span>
                    <span className="teacher-student-performance">
                      {hasNoTasks ? (
                        '– / –'
                      ) : (
                        `${student.completedTasks}/${student.totalTasks} – ${successRate}%`
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="teacher-divider"></div>

        {/* Right Side - Actions */}
        <div className="teacher-right-column">
          <button 
            className="teacher-action-btn teacher-add-student-btn"
            onClick={handleAddStudent}
          >
            <span className="teacher-btn-text">Add</span>
            <span className="teacher-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 20C6 16 8.686 14 12 14C15.314 14 18 16 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </button>
          
          <button 
            className="teacher-action-btn teacher-add-problem-btn"
            onClick={handleAddMathProblem}
          >
            <span className="teacher-btn-text">Add new Math Problem</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;

